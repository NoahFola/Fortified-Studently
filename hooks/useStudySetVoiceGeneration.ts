"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudyStore } from "@/store/studyStore";
import { chat } from "@/lib/chat";
import generateId from "@/utils/generateId";
import {
  GENERATE_TOPIC_AND_NOTES_PROMPT,
  GENERATE_FLASHCARDS_PROMPT,
  GENERATE_QUIZ_BLANKS_PROMPT,
  GENERATE_WRITTEN_QUESTIONS_PROMPT,
  GENERATE_RESOURCES_PROMPT,
} from "@/utils/prompt";

const MOCK_TRANSCRIPT =
  "The lecture today focused on Kirchhoff's laws. Kirchhoff's voltage law, or KVL, states that the sum of all voltages around any closed loop in a circuit must be zero. This is a consequence of the conservation of energy. Kirchhoff's current law, KCL, states that the sum of currents entering a node must equal the sum of currents leaving a node, which is a principle of conservation of charge. We solved three mesh analysis problems using KVL.";

interface UseVoiceGenerationResult {
  loading: boolean;
  error: string | null;
  statusText: string;
  generateFromVoice: () => Promise<void>;
}

/**
 * Handles the modular AI generation process using a mock transcribed voice input.
 */
export const useStudySetVoiceGeneration = (): UseVoiceGenerationResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");

  const { addStudySet, stopRecording } = useStudyStore();
  const router = useRouter();

  const generateFromVoice = async () => {
    // This is called AFTER the user hits the STOP button on the indicator
    if (loading) return;

    setError(null);
    setLoading(true);
    setStatusText("Transcribing audio (Mock: 100% complete)...");

    const fileContext = MOCK_TRANSCRIPT; // Use mock transcription as context
    // const baseOptions = { model: "gemini-2.5-flash-preview-09-2025" };

    try {
      // --- Modular Generation Steps using Mock Context ---

      // 1. AI: Generate Topic and Notes (Combined Step)
      setStatusText("Generating Topic and Comprehensive Notes (1 of 5)...");
      const notesAndTopicPrompt = GENERATE_TOPIC_AND_NOTES_PROMPT(fileContext);
      const notesResponse = (await chat(notesAndTopicPrompt)) as RawStudySet;

      const studySetDraft: RawStudySet = {
        topic: notesResponse.topic,
        emoji: notesResponse.emoji,
        notes: notesResponse.notes,
        flashcards: [],
        quiz: [],
        fillInBlanks: [],
        writtenQuestions: [],
        resources: [],
      };

      // 2. AI: Generate Flashcards
      setStatusText("Generating Flashcards (2 of 5)...");
      const flashcardsPrompt = GENERATE_FLASHCARDS_PROMPT(fileContext);
      const flashcardsResponse = (await chat(
        flashcardsPrompt,
        baseOptions
      )) as RawStudySet;
      studySetDraft.flashcards = flashcardsResponse.flashcards;

      // 3. AI: Generate Quiz and Fill-in-the-Blanks (Combined Step)
      setStatusText("Generating Quiz and Fill-in-the-Blanks (3 of 5)...");
      const quizBlanksPrompt = GENERATE_QUIZ_BLANKS_PROMPT(fileContext);
      const quizBlanksResponse = (await chat(
        quizBlanksPrompt,
        baseOptions
      )) as RawStudySet;
      studySetDraft.quiz = quizBlanksResponse.quiz;
      studySetDraft.fillInBlanks = quizBlanksResponse.fillInBlanks;

      // 4. AI: Generate Written Questions
      setStatusText("Generating Written Questions (4 of 5)...");
      const writtenPrompt = GENERATE_WRITTEN_QUESTIONS_PROMPT(fileContext);
      const writtenResponse = (await chat(
        writtenPrompt,
        baseOptions
      )) as RawStudySet;
      studySetDraft.writtenQuestions = writtenResponse.writtenQuestions;

      // 5. AI: Generate Resources
      setStatusText("Searching for external resources (5 of 5)...");
      const resourcesPrompt = GENERATE_RESOURCES_PROMPT(
        studySetDraft.topic,
        studySetDraft.notes.summary
      );
      const resourcesResponse = (await chat(resourcesPrompt, baseOptions)) as {
        resources: RawStudySet["resources"];
      };
      studySetDraft.resources = resourcesResponse.resources;

      // 6. Finalize and Save
      setStatusText("Finalizing study set...");

      const finalId = generateId(2);
      const finalStudySet = {
        ...studySetDraft,
        id: finalId,
        createdAt: new Date().toISOString(),
        source: "record" as const,
      };

      addStudySet(finalStudySet as StudySetWithMeta);

      // 7. Cleanup and Redirect
      setStatusText("Study set generated! Redirecting...");
      stopRecording(); // Set global state to stop recording visual
      router.push(`/study/sets/${finalId}`);
    } catch (err: any) {
      console.error("Voice generation failure:", err);
      setStatusText(`Error: ${err.message || "Failed to process audio."}`);
      setError(
        err.message || "An unexpected error occurred during generation."
      );
      stopRecording(); // Ensure global state is reset on error
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, statusText, generateFromVoice };
};
