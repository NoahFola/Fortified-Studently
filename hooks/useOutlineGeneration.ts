import { useState } from "react";
import { useCourseStore } from "@/store/courseStore";
import { usePuterStore } from "@/lib/puter";
import { chat, chatWithFile } from "@/lib/chat";
import {
  GENERATE_OUTLINE_CONTEXT_AND_COURSES_PROMPT,
  GENERATE_TOPICS_FOR_COURSE_PROMPT,
  InitialOutlineResponse,
} from "@/utils/prompt"; // Using the new modular prompts
import { convertPdfToImage } from "@/lib/pdf2img";
import { useTopicStore } from "@/store/topicStore";
import {
  MOCK_COURSE_OUTLINE_DATA,
  MOCK_COURSE_TOPICS,
} from "@/constants/mockCourseOutline";
import delay from "@/utils/delay";

// --- PUTER & UTILITY TYPES ---
// declare function convertPdfToImage(file: File): Promise<PdfConversionResult>;
// --- END PUTER & UTILITY TYPES ---

// Define the core structures needed locally for the loop
interface CoursePayload {
  name: string;
  code: string;
  units: number;
}

interface UseOutlineGenerationResult {
  loading: boolean;
  error: string | null;
  statusText: string;
  generateOutline: (file: File, semesterId: string) => Promise<boolean>;
}

export const useOutlineGeneration = (): UseOutlineGenerationResult => {
  const { fs } = usePuterStore();
  const { addCourse } = useCourseStore();
  const { addTopic } = useTopicStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");

  const generateOutline = async (
    file: File,
    semesterId: string
  ): Promise<boolean> => {
    setError(null);
    setLoading(true);
    setStatusText("");

    let puterPath: string | null = null;
    let fileContext = "";
    let coursesToProcess: CoursePayload[] = [];
    let successCount = 0;

    try {
      // --- 1. File Upload and Preparation (Same as before) ---
      let fileToUpload: File = file;

      if (file.type === "application/pdf") {
        setStatusText("Converting PDF to image for analysis...");
        const conversionResult = await convertPdfToImage(file);
        if (conversionResult.error || !conversionResult.file) {
          throw new Error(
            conversionResult.error || "Failed to convert PDF for analysis."
          );
        }
        fileToUpload = file;
      }

      setStatusText(`Uploading ${fileToUpload.name} (1/2 calls)...`);
      const uploadedFile = await fs.upload([fileToUpload]);
      if (!uploadedFile) {
        throw new Error("Failed to upload file to Puter.");
      }
      puterPath = uploadedFile.path;

      // --- 2. AI: Context and Course List Extraction (Single Claude Call) ---
      setStatusText(
        "Extracting raw text and identifying courses (1/2 calls)..."
      );
      await delay(4000);
      // const prompt = GENERATE_OUTLINE_CONTEXT_AND_COURSES_PROMPT(semesterId);

      // const aiResponse = await chatWithFile(puterPath, prompt, {
      //   model: "claude-3-7-sonnet-latest",
      // });

      // >>>>>>>>>>>>>>>>> FIX FOR TypeError: Cannot read properties of undefined (reading 'content') <<<<<<<<<<<<<<<<<
      // if (!aiResponse || !aiResponse.message || !aiResponse.message.content) {
      //   throw new Error(
      //     "AI failed to extract initial context. Response was empty or malformed."
      //   );
      // }
      // >>>>>>>>>>>>>>>>> END FIX <<<<<<<<<<<<<<<<<

      // const content = Array.isArray(aiResponse.message.content)
      //   ? aiResponse.message.content[0]?.text || ""
      //   : aiResponse.message.content;

      // The AI must return a single JSON object containing both context and courses
      // const jsonString = aiResponse.replace(/```json\n?|```/g, "").trim();
      // const outlineData: InitialOutlineResponse = aiResponse;
      const outlineData: InitialOutlineResponse =
        MOCK_COURSE_OUTLINE_DATA as InitialOutlineResponse;
      if (
        !outlineData.courses ||
        outlineData.courses.length === 0 ||
        !outlineData.fileContext
      ) {
        throw new Error(
          "AI failed to extract full context or course list. Please try a clearer document."
        );
      }

      fileContext = outlineData.fileContext;
      coursesToProcess = outlineData.courses;

      setStatusText(
        `Found ${coursesToProcess.length} courses. Starting topic generation... (2/2 calls)`
      );

      // --- 3. Looped AI: Generate Topics Course-by-Course (Multiple Gemini Calls) ---
      // const baseOptions = { model: "gemini-2.5-flash-preview-09-2025" };

      for (let i = 0; i < coursesToProcess.length; i++) {
        const course = coursesToProcess[i];

        setStatusText(
          `Generating topics for ${course.code} (${i + 1}/${
            coursesToProcess.length
          })...`
        );
        await delay(1300);
        const topicsPrompt = GENERATE_TOPICS_FOR_COURSE_PROMPT(
          fileContext,
          course.name,
          course.code
        );

        // const topicsResponse = await chat(topicsPrompt);

        // Finalize and save the course data immediately
        const newCourse = addCourse(semesterId, {
          name: course.name,
          code: course.code,
          units: course.units,
          grade: "-",
          progress: 0,
          notes: [],
        });
        const courseCode = course.code.trim();
        let topicsArray: Omit<Topic, "courseId">[] = [];

        if (MOCK_COURSE_TOPICS[courseCode]) {
          topicsArray = MOCK_COURSE_TOPICS[courseCode];
          setStatusText(
            `Created ${topicsArray.length} topics for ${course.code}`
          );
          await delay(800);
        } else {
          setStatusText(`Failed to create topics for ${course.code}`);
        }
        topicsArray.forEach((topic) => addTopic(newCourse.id, topic));
        successCount++;
      }

      // --- 4. Cleanup and Success ---
      if (puterPath) await fs.delete(puterPath).catch(console.error);
      setStatusText(`Successfully added ${successCount} courses!`);
      return true;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to process course outline";
      console.error("Outline generation failure:", error);
      console.error(err);
      // Include course name in error if available
      const courseError =
        coursesToProcess.length > 0
          ? ` (Error near course ${coursesToProcess.length - successCount})`
          : "";
      setStatusText(
        `Error: ${error || "Failed to process course outline."}${courseError}`
      );
      setError(error || "An unexpected error occurred.");
      if (puterPath) await fs.delete(puterPath).catch(console.error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, statusText, generateOutline };
};
