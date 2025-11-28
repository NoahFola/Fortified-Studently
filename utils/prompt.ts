// --- Base Formatting Requirements for all Prompts ---
const MATH_FORMATTING_REQUIREMENT = `
**MATH FORMATTING REQUIREMENT (CRITICAL):**
For ALL fields that contain mathematical notation, scientific notation, or equations, you MUST wrap the mathematical content using standard LaTeX delimiters:
- Inline Math: Use a single dollar sign ($...$)
- Display Math (Block): Use double dollar signs ($$...\$\$)
Example: "The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$."
`;

// --- 1. CONTEXT EXTRACTION (Used by file generation hook first) ---

export const GENERATE_CONTEXT_PROMPT = `
ROLE: You are an expert text extractor and summarizer.
TASK: Analyze the attached file (PDF/Image) and extract ALL essential text and data.
OUTPUT: Provide a continuous block of plain text containing the full, cleaned, and summarized content of the file. Do not include any JSON or conversational text. This output will serve as the input material for subsequent AI generation steps. Character limit: 4000.
`;

// --- 2. TOPIC AND NOTES GENERATION (Combined for efficiency) ---

export const GENERATE_TOPIC_AND_NOTES_PROMPT = (userMaterial: string) => `
ROLE: You are an expert educational content creator and a strict JSON API.
INPUT MATERIAL:
"${userMaterial}"

TASK:
1. Determine a concise 'topic' title and a relevant 'emoji'.
2. Generate comprehensive 'notes' in strict HTML format.
${MATH_FORMATTING_REQUIREMENT}
REQUIREMENTS:
- NOTES (HTML): Must be a rich summary. Use <h2> for section headers, <ul>/<li> for lists, and <strong> for key terms. DO NOT use Markdown.
- summary: Brief 2-sentence overview.

OUTPUT FORMAT (Strict JSON, no conversational text):
{
    "topic": "Short Topic Title",
    "emoji": "📚",
    "notes": {
        "title": "Engaging Title for Notes",
        "summary": "Brief 2-sentence overview.",
        "content": "<div><h2>Section 1: ...</h2><p>...</p></div>"
    }
}
`;

// --- 3. FLASHCARDS GENERATION ---

export const GENERATE_FLASHCARDS_PROMPT = (userMaterial: string) => `
ROLE: You are an expert flashcard generator and a strict JSON API.
INPUT MATERIAL:
"${userMaterial}"

TASK:
Generate 12 flashcards testing key concepts from the input material.
${MATH_FORMATTING_REQUIREMENT}
REQUIREMENTS:
- Generate exactly 12 flashcards.
- The 'status' field must be "unfamiliar" for all new cards.

OUTPUT FORMAT (Strict JSON array, no conversational text):
{
    "flashcards": [
        { "id": "f1", "front": "Question?", "back": "Answer", "status": "unfamiliar" },
        { "id": "f2", "front": "...", "back": "...", "status": "unfamiliar" }
    ]
}
`;

// --- 4. QUIZ AND FILL-IN-THE-BLANKS GENERATION (Combined for efficiency) ---

export const GENERATE_QUIZ_BLANKS_PROMPT = (userMaterial: string) => `
ROLE: You are an expert assessment creator and a strict JSON API.
INPUT MATERIAL:
"${userMaterial}"

TASK:
Generate 20 multiple-choice questions (Quiz) and 20 fill-in-the-blank sentences (Blanks).
${MATH_FORMATTING_REQUIREMENT}
REQUIREMENTS:
- QUIZ: Generate exactly 20 questions. Each must have 4 options and a correctIndex (0-3).
- FILL_BLANKS: Generate exactly 20 sentences. The missing keyword must be marked by "______". The 'correctAnswer' must contain ONLY the missing word/phrase.

OUTPUT FORMAT (Strict JSON object, no conversational text):
{
    "quiz": [
        { "id": "q1", "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0 }
    ],
    "fillInBlanks": [
        { "id": "b1", "sentence": "The concept is defined as ______.", "correctAnswer": "definition" }
    ]
}
`;

// --- 5. WRITTEN QUESTIONS GENERATION ---

export const GENERATE_WRITTEN_QUESTIONS_PROMPT = (userMaterial: string) => `
ROLE: You are an expert essay question generator and a strict JSON API.
INPUT MATERIAL:
"${userMaterial}"

TASK:
Generate 10 open-ended essay-style questions (Written Questions).
${MATH_FORMATTING_REQUIREMENT}
REQUIREMENTS:
- Generate exactly 10 questions.
- Provide a brief 'explanation' for the answer to the question.
- Provide a short 'hint' to guide tshe user.

OUTPUT FORMAT (Strict JSON array, no conversational text):
{
    "writtenQuestions": [
        { 
            "id": "w1", 
            "question": "Explain the significance of X.", 
            "explanation": "This tests the high-level application of X.",
            "hint": "Focus on its historical impact.",
        }
    ]
}
`;
export interface CourseOutlineResponse {
  courses: Course[];
}
export interface HighLevelCourse {
  id: string; // Placeholder ID
  name: string;
  code: string;
  units: number;
}
export interface InitialOutlineResponse {
  /** Raw text extracted from the document, to be used for subsequent prompt context. */
  fileContext: string;
  /** High-level list of courses found in the document. */
  courses: HighLevelCourse[];
}

export const GENERATE_OUTLINE_CONTEXT_AND_COURSES_PROMPT = (
  semesterId: string
) => `
ROLE: You are an expert academic curriculum analyst and a strict JSON API.
TASK: Analyze the attached document (syllabus/outline). Perform two actions:
1. Extract ALL relevant instructional text (raw content) into the 'fileContext' field.
2. Identify and extract all unique courses, providing their 'name', 'code', and 'units'.

REQUIREMENTS:
- 'fileContext' must be the full, clean, raw text of the document.
- 'courses' must be a list of high-level course objects.
- Use a mock ID placeholder for 'id' fields (e.g., "mock-c1"). The client will replace them.

OUTPUT FORMAT (Strict JSON):
${JSON.stringify(
  {
    fileContext: "RAW TEXT CONTENT EXTRACTED FROM FILE...",
    courses: [
      {
        id: "mock-c1",
        name: "Introduction to Web Engineering",
        code: "WEB201",
        units: 3,
      },
      {
        id: "mock-c2",
        name: "Advanced Statistics",
        code: "STA305",
        units: 4,
      },
    ],
  },
  null,
  2
)}
`;

// --- 2. SINGLE COURSE TOPIC GENERATION PROMPT (Text Calls, Looped) ---

export const GENERATE_TOPICS_FOR_COURSE_PROMPT = (
  fullContext: string,
  courseName: string,
  courseCode: string
) => `
ROLE: You are an expert curriculum designer and a strict JSON API.
TASK: Based on the provided FULL COURSE CONTEXT, generate the detailed 'topics' and 'subtopics' specifically for the course: "${courseName}" (${courseCode}).

FULL COURSE CONTEXT (DO NOT USE FOR OUTPUT):
"${fullContext}"

REQUIREMENTS:
1.  Focus ONLY on topics relevant to "${courseName}".
2.  Generate a minimum of 6 to 10 detailed 'topics'.
3.  For each topic, provide a 'description' (summary) and a list of 3-5 key 'subtopics'.
4.  Use mock UUIDs for 'id' fields (e.g., "mock-t1"). Do NOT include 'courseId' in the output, as the client will inject the correct value.
5.  Set 'progress' to 0 for all topics.

OUTPUT FORMAT (Strict JSON array of topics):
{
    "topics": [
        {
          "id": "mock-t1",
          "title": "Topic Title 1",
          "description": "Summary of learning objectives for this module.",
          "progress": 0,
          "subtopics": ["Key Concept A", "Formula B", "Application C"],
        },
        // ... up to 10 topics
    ]
}
`;

export const GENERATE_RESOURCES_PROMPT = (topic: string, summary: string) => `
ROLE: You are a helpful educational search engine and a strict JSON API.
TASK: Based on the provided study topic and summary, perform a simulated web search to find 5-7 high-quality, relevant external learning resources (YouTube tutorials, scholarly articles, or reliable web pages).

INPUT:
Topic: ${topic}
Summary: ${summary}

REQUIREMENTS:
1.  Generate 5-7 resources covering different mediums (at least 2 YouTube videos, 1 article/scholar, the rest general web).
2.  Provide the exact 'url', a concise 'title', the 'source' (youtube, google-scholar, article, general-web), and the 'type' (video, text, article).
3.  Do NOT include math formatting (LaTeX) in this response.

OUTPUT FORMAT (Strict JSON array):
{
    "resources": [
        { 
            "url": "https://www.youtube.com/watch?v=...", 
            "title": "Topic Explained in 10 Minutes", 
            "source": "youtube", 
            "type": "video" 
        },
        { 
            "url": "https://scholar.google.com/...", 
            "title": "A Primer on Applied Theory (PDF)", 
            "source": "google-scholar", 
            "type": "article" 
        }
    ]
}
`;
