import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudyStore } from "@/store/studyStore";
import { usePuterStore } from "@/lib/puter";
import { chat, chatWithFile } from "@/lib/chat";
import generateId from "@/utils/generateId";

// Importing all four modular prompts
import {
  GENERATE_CONTEXT_PROMPT,
  GENERATE_TOPIC_AND_NOTES_PROMPT,
  GENERATE_FLASHCARDS_PROMPT,
  GENERATE_QUIZ_BLANKS_PROMPT,
  GENERATE_WRITTEN_QUESTIONS_PROMPT,
  GENERATE_RESOURCES_PROMPT,
} from "@/utils/prompt";
import { convertPdfToImage } from "@/lib/pdf2img";

// --- PUTER RELATED TYPES (Re-declared for context) ---
interface FSItem {
  path: string;
  name: string;
  size: number;
}
interface PuterChatOptions {
  model: string;
}
interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}
// declare function convertPdfToImage(file: File): Promise<PdfConversionResult>;
// --- END PUTER RELATED TYPES ---

// Condensed Study Set structure for final save
// interface StudySetDraft {
//   topic?: string;
//   emoji?: string;
//   notes?: any;
//   flashcards?: any[];
//   quiz?: any[];
//   fillInBlanks?: any[];
//   writtenQuestions?: any[];
// }

interface UseFileGenerationResult {
  loading: boolean;
  error: string | null;
  statusText: string;
  generateFromFile: (file: File) => Promise<void>;
}

/**
 * Handles the complete workflow: upload, file analysis, multi-step AI generation, and redirection.
 */
export const useStudySetFileGeneration = (): UseFileGenerationResult => {
  const { fs } = usePuterStore();
  const { addStudySet } = useStudyStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");

  const generateFromFile = async (file: File) => {
    setError(null);
    setLoading(true);
    setStatusText("");

    let puterPath: string | null = null;
    //@ts-expect-error type
    const studySetDraft: RawStudySet = {};
    let fileContext = "";

    try {
      // --- 1. File Upload and Preparation ---
      let fileToUpload: File = file;

      if (file.type === "application/pdf") {
        setStatusText("Converting PDF to image for analysis...");
        const conversionResult = await convertPdfToImage(file);
        if (conversionResult.error || !conversionResult.file) {
          throw new Error(
            conversionResult.error ||
              "Failed to convert PDF to image for analysis."
          );
        }
        fileToUpload = file;
      }

      setStatusText(`Uploading ${fileToUpload.name}...`);
      const uploadedFile = await fs.upload([fileToUpload]);
      if (!uploadedFile) {
        throw new Error("Failed to upload file to Puter.");
      }
      puterPath = uploadedFile.path;

      // --- 2. AI: Extract Initial Context/Raw Text ---
      setStatusText("Reading file contents and summarizing context...");
      // Use chatWithFile to get the raw text content for modular prompts
      const contextResponse = await chatWithFile(
        puterPath,
        GENERATE_CONTEXT_PROMPT,
        { model: "claude-3-7-sonnet-latest" }
      );

      // Extract the context text (assuming it's the raw content from the file analysis)
      fileContext = contextResponse;

      if (!fileContext || fileContext.length < 50) {
        throw new Error(
          "AI could not extract enough content from the file. Please try a clearer document."
        );
      }

      // --- 3. Modular Generation Steps using Extracted Context ---
      const baseOptions = { model: "gemini-2.5-flash-preview-09-2025" };

      // Step A: Generate Topic and Notes (Combined Step)
      setStatusText("Generating Topic and Comprehensive Notes (1 of 5)...");
      const notesAndTopicPrompt = GENERATE_TOPIC_AND_NOTES_PROMPT(fileContext);
      const notesResponse = await chat(notesAndTopicPrompt, baseOptions);

      studySetDraft.topic = notesResponse.topic;
      studySetDraft.emoji = notesResponse.emoji;
      studySetDraft.notes = notesResponse.notes;

      // Step B: Generate Flashcards
      setStatusText("Generating Flashcards (2 of 5)...");
      const flashcardsPrompt = GENERATE_FLASHCARDS_PROMPT(fileContext);
      const flashcardsResponse = await chat(flashcardsPrompt, baseOptions);

      studySetDraft.flashcards = flashcardsResponse.flashcards;

      // Step C: Generate Quiz and Fill-in-the-Blanks (Combined Step)
      setStatusText("Generating Quiz and Fill-in-the-Blanks (3 of 5)...");
      const quizBlanksPrompt = GENERATE_QUIZ_BLANKS_PROMPT(fileContext);
      const quizBlanksResponse = await chat(quizBlanksPrompt, baseOptions);

      studySetDraft.quiz = quizBlanksResponse.quiz;
      studySetDraft.fillInBlanks = quizBlanksResponse.fillInBlanks;

      // Step D: Generate Written Questions
      setStatusText("Generating Written Questions (4 of 5)...");
      const writtenPrompt = GENERATE_WRITTEN_QUESTIONS_PROMPT(fileContext);
      const writtenResponse = await chat(writtenPrompt, baseOptions);

      studySetDraft.writtenQuestions = writtenResponse.writtenQuestions;
      setStatusText("Searching for external resources (5 of 5)...");
      const resourcesPrompt = GENERATE_RESOURCES_PROMPT(
        studySetDraft.topic!,
        studySetDraft.notes!.summary
      );
      const resourcesResponse = (await chat(resourcesPrompt)) as {
        resources: RawStudySet["resources"];
      };

      studySetDraft.resources = resourcesResponse.resources; // Map the generated resources

      // --- 4. Finalize and Save ---
      setStatusText("Finalizing study set...");

      const finalId = generateId(2);
      const finalStudySet = {
        ...studySetDraft,
        id: finalId,
        createdAt: new Date().toISOString(),
      } as RawStudySet & { id: string; createdAt: string };

      addStudySet(finalStudySet as StudySetWithMeta);

      // 5. Cleanup and Redirect
      await fs.delete(puterPath); // Cleanup uploaded file

      setStatusText("Study set generated! Redirecting...");
      router.push(`/study/sets/${finalId}`);
    } catch (err: any) {
      console.error("File generation failure:", err);
      setStatusText(`Error: ${err.message || "Failed to process file."}`);
      setError(
        err.message || "An unexpected error occurred during generation."
      );
      if (puterPath) await fs.delete(puterPath).catch(console.error); // Ensure cleanup on error
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, statusText, generateFromFile };
};
