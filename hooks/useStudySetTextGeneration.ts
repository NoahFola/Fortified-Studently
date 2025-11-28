import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudyStore } from "@/store/studyStore";
import { chat } from "@/lib/chat"; // Use the updated chat function
import generateId from "@/utils/generateId";
import {
  GENERATE_TOPIC_AND_NOTES_PROMPT,
  GENERATE_FLASHCARDS_PROMPT,
  GENERATE_QUIZ_BLANKS_PROMPT,
  GENERATE_WRITTEN_QUESTIONS_PROMPT,
  GENERATE_RESOURCES_PROMPT, // <--- NEW IMPORT
} from "@/utils/prompt"; // Using the new modular prompts

// Condensed Study Set structure for final save (needs to match the hook's output)

interface UseStudySetGenerationResult {
  loading: boolean;
  error: string | null;
  statusText: string;
  generateAndRedirect: (text: string) => Promise<void>;
}

/**
 * Handles the AI generation process for a study set from pasted text (non-file input).
 * This replaces the old store action generateStudySet(text).
 */
export const useStudySetTextGeneration = (): UseStudySetGenerationResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");

  const { addStudySet } = useStudyStore();
  const router = useRouter();

  const generateAndRedirect = async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    setLoading(true);
    setStatusText("");
    const studySetDraft: RawStudySet = {
      topic: "",
      emoji: "",
      notes: {
        title: "",
        content: "",
        summary: "",
      },
      flashcards: [] as RawStudySet["flashcards"],
      quiz: [] as RawStudySet["quiz"],
      fillInBlanks: [] as RawStudySet["fillInBlanks"],
      writtenQuestions: [] as RawStudySet["writtenQuestions"],
      resources: [] as RawStudySet["resources"],
    };

    try {
      // Use the pasted text as the context for all subsequent modular prompts
      const fileContext = text;

      // 1. AI: Generate Topic and Notes (Combined Step)
      setStatusText(
        "Generating Topic and Comprehensive Notes (Step 1 of 5)..."
      );
      const notesAndTopicPrompt = GENERATE_TOPIC_AND_NOTES_PROMPT(fileContext);
      const notesResponse = (await chat(notesAndTopicPrompt)) as RawStudySet;

      studySetDraft.topic = notesResponse.topic;
      studySetDraft.emoji = notesResponse.emoji;
      studySetDraft.notes = notesResponse.notes;

      // 2. AI: Generate Flashcards
      setStatusText("Generating Flashcards (Step 2 of 5)...");
      const flashcardsPrompt = GENERATE_FLASHCARDS_PROMPT(fileContext);
      const flashcardsResponse = (await chat(flashcardsPrompt)) as RawStudySet;

      studySetDraft.flashcards = flashcardsResponse.flashcards;

      // 3. AI: Generate Quiz and Fill-in-the-Blanks (Combined Step)
      setStatusText("Generating Quiz and Fill-in-the-Blanks (Step 3 of 5)...");
      const quizBlanksPrompt = GENERATE_QUIZ_BLANKS_PROMPT(fileContext);
      const quizBlanksResponse = (await chat(quizBlanksPrompt)) as RawStudySet;

      studySetDraft.quiz = quizBlanksResponse.quiz;
      studySetDraft.fillInBlanks = quizBlanksResponse.fillInBlanks;

      // 4. AI: Generate Written Questions
      setStatusText("Generating Written Questions (Step 4 of 5)...");
      const writtenPrompt = GENERATE_WRITTEN_QUESTIONS_PROMPT(fileContext);
      const writtenResponse = (await chat(writtenPrompt)) as RawStudySet;

      studySetDraft.writtenQuestions = writtenResponse.writtenQuestions;
      // 5. AI: Generate Resources (NEW STEP)
      setStatusText("Searching for external resources (Step 5 of 5)...");
      // Use the generated topic and summary for better resource search context
      const resourcesPrompt = GENERATE_RESOURCES_PROMPT(
        studySetDraft.topic,
        studySetDraft.notes.summary
      );
      const resourcesResponse = (await chat(resourcesPrompt)) as {
        resources: RawStudySet["resources"];
      };

      studySetDraft.resources = resourcesResponse.resources; // Map the generated resources

      // 5. Finalize and Save
      setStatusText("Finalizing study set...");

      const finalId = generateId(2);
      const finalStudySet = {
        ...studySetDraft,
        id: finalId,
        createdAt: new Date().toISOString(),
      } as RawStudySet & { id: string; createdAt: string };

      addStudySet(finalStudySet as StudySetWithMeta);

      // 6. Redirect
      setStatusText("Study set generated! Redirecting...");
      router.push(`/study/sets/${finalId}`);
    } catch (err) {
      console.error("Text generation failure:", err);
      const errorMessage =
        err instanceof Error ? err?.message : "Failed to process text.";
      setStatusText(`Error: ${errorMessage}`);
      setError(
        errorMessage || "An unexpected error occurred during generation."
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, statusText, generateAndRedirect };
};
