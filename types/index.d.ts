type ActionType = "added-note" | "completed-topic" | "daily-login";
// src/types/index.d.ts

// ==============================
// 🧩 UI STORE TYPES
// ==============================
interface UIStore {
  darkMode: boolean;
  sidebarOpen: boolean;

  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

// ==============================
// 🎓 SEMESTER TYPES
// ==============================
interface Semester {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  courses: Course[];
  gpa: number;
  progress: number;
  // units?:number;
}

interface SemesterStore {
  semesters: Semester[];

  addSemester: (
    semester: Omit<Semester, "id" | "gpa" | "courses" | "progress">
  ) => void;
  getSemesterById: (semesterId: string) => Semester;
  updateSemester: (id: string, partial: Partial<Semester>) => void;
  calculateGPA: (semesterId: string, courses: Course[]) => number;
  updateSemesterProgress: (semesterId: string) => number;
}

// ==============================
// 📘 COURSE TYPES
// ==============================
interface Course {
  id: string;
  semesterId: string;
  name: string;
  code: string;
  units: number;
  topics?: Topic[];
  notes?: Note[];
  progress?: number;
  grade: "A" | "B" | "C" | "D" | "E" | "F" | "-";
}

interface CourseStore {
  courses: Course[];
  // selectedCourseId: string | null;
  getCoursesForSemester: (semesterId: string) => Course[];
  getCourseById: (courseId: string) => Course;
  addCourse: (
    semesterId: string,
    courseInput: Omit<Course, "id" | "semesterId">
  ) => Course;
  updateCourse: (id: string, partial: Partial<Course>) => void;
  updateCourseProgress: (id: string) => number;
  // selectCourse: (id: string) => void;
}

// ==============================
// 📝 TOPIC & NOTE TYPES
// ==============================
interface Topic {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  progress: number; // 0-100
  subtopics?: string[];
}

interface Note {
  id: string;
  topicId: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
  source?: "user" | "ai" | "upload";
}

interface TopicStore {
  topics: Topic[];
  notes: Note[];

  addTopic: (
    courseId: string,
    topic: Omit<Topic, "id" | "progress" | "courseId">
  ) => void;
  updateTopicProgress: (topicId: string, progress: number) => void;
  getTopicById: (topicId: string) => Topic;
  addNote: (
    topicId: string,
    courseId: string,
    note: Omit<Note, "id" | "createdAt" | "courseId" | "topicId">
  ) => void;
  updateNote: (noteId: string, content: string) => void;
}

// ==============================
// 📚 STUDY PLAN & TEST TYPES
// ==============================

// Each study task inside a plan
interface StudyTask {
  id: string;
  topicId: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
}

interface StudyPlan {
  id: string;
  courseId: string;
  createdAt: string;
  tasks: StudyTask[];
  aiSummary?: string;
}

// A single test question
interface TestQuestion {
  id: string;
  question: string;
  explanation: string;
  options: string[];
  correctIndex: number;
}

// A full test for a course or topic
interface Test {
  id: string;
  courseId: string;
  topicId?: string;
  createdAt: string;
  questions: TestQuestion[];
  score?: number;
}

// AI Recommendations
interface Recommendation {
  id: string;
  timestamp: string;
  message: string;
  courseId?: string;
  topicId?: string;

  // Recommendation category
  type:
    | "review"
    | "study"
    | "deadline"
    | "warning"
    | "motivation"
    | "ai-generated";

  // e.g., urgency level
  priority?: "low" | "medium" | "high";
}
interface StudyNotes {
  title: string;
  summary: string;
  content: string; // HTML
}

interface FlashCard {
  id: string;
  front: string;
  back: string;
  status: "unfamiliar" | "learning" | "familiar" | "mastered";
}

// interface QuizQuestion {
//   id: string;
//   question: string;
//   options: string[];
//   correctIndex: number;
// }

interface FillBlank {
  id: string;
  sentence: string;
  correctAnswer: string;
  hint: string;
}

interface WrittenQuestion {
  id: string;
  question: string;
  // sampleAnswer: string;
  explanation: string;
  hint: string;
}
interface Resource {
  url: string;
  title: string;
  source: "youtube" | "google-scholar" | "article" | "general-web";
  type: "video" | "text" | "article";
}

interface RawStudySet {
  topic: string;
  emoji: string;

  notes: StudyNotes;
  flashcards: FlashCard[];
  quiz: TestQuestion[];
  fillInBlanks: FillBlank[];
  writtenQuestions: WrittenQuestion[];
  resources: Resource[];
}

type StudySetWithMeta = RawStudySet & {
  id: string;
  createdAt: string;
  source?: "paste" | "upload" | "record" | "ai";
};

interface StudyStore {
  studysets: Record<string, StudySetWithMeta>;
  activeId: string | null;
  isRecording: boolean; // <<< NEW STATE

  addStudySet: (s: StudySetWithMeta) => void;
  setActiveId: (id: string | null) => void;
  removeStudySet: (id: string) => void;
  clearAll: () => void;

  // NEW ACTIONS
  startRecording: () => void;
  stopRecording: () => void;

  fetchAIMessage: () => Promise<void>;
  generateTest: (topicTitle: string) => Promise<void>;
}

// ==============================
// 📅 PLANNER / CALENDAR TYPES
// ==============================
interface PlannerEvent {
  id: string;
  title: string;
  date: string; // ISO
  time?: string;
  type: "study" | "test" | "deadline" | "personal" | "ai-scheduled";
  linkedCourseId?: string;
  linkedTopicId?: string;
}

interface PlannerStore {
  events: PlannerEvent[];

  addEvent: (event: Omit<PlannerEvent, "id">) => void;

  autoScheduleStudySessions: (args: {
    courseId: string;
    days: number;
    dailyMinutes: number;
  }) => void;
}

// ==============================
// ⭐ GAMIFICATION TYPES
// ==============================
interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
}

interface GamificationStore {
  points: number;
  badges: string[];
  streak: number;

  completeAction: (action: ActionType) => void; //"completed_note" | "studied" | "added_topic"
}

// ==============================
// 🤖 AI STORE TYPES
// ==============================
interface BackgroundAgentMessage {
  id: string;
  timestamp: string;
  message: string;
  context?: string; // e.g., "study", "planner", "gpa"
}

interface AIStore {
  messages: BackgroundAgentMessage[];
  suggestions: Recommendation[];
  context: Record<string, unknown>;
  updateContext: (ctx) => void;
  pushMessage: (msg: Omit<BackgroundAgentMessage, "id" | "timestamp">) => void;
  pushSuggestion: (sug: Omit<Recommendation, "id" | "timestamp">) => void;
  getSuggestion: () => Promise<void>;
}
