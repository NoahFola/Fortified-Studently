import generateId from "@/utils/generateId";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { chat } from "@/lib/chat";
import { useAIStore } from "./aiStore";

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      studysets: {},
      activeId: null,
      isRecording: false, // <<< INITIAL VALUE

      addStudySet: (s) =>
        set((state) => ({
          studysets: { ...state.studysets, [s.id]: s },
          activeId: s.id,
        })),

      setActiveId: (id) => set({ activeId: id }),

      removeStudySet: (id) =>
        set((state) => {
          const copy = { ...state.studysets };
          delete copy[id];
          const nextActive = state.activeId === id ? null : state.activeId;
          return { studysets: copy, activeId: nextActive };
        }),

      clearAll: () => set({ studysets: {}, activeId: null }),

      // --- NEW RECORDING ACTIONS ---
      startRecording: () => set({ isRecording: true }),
      stopRecording: () => set({ isRecording: false }),
      // -----------------------------

      fetchAIMessage: async () => {
        const res = await chat<{ message: string }>(
          "Generate a short, encouraging study message for the student."
        );
        useAIStore.getState().pushMessage({
          message: res.message || "Keep up the good work!",
          context: "study",
        });
      },

      generateTest: async (topicTitle: string) => {
        const res = await chat<RawStudySet>(
          `Create a comprehensive study set for the topic: "${topicTitle}". Include notes, flashcards, quiz, fillInBlanks, and writtenQuestions.`
        );
        const newSet: StudySetWithMeta = {
          ...res,
          id: generateId(),
          createdAt: new Date().toISOString(),
          source: "ai",
        };
        get().addStudySet(newSet);
      },
    }),
    {
      name: "studently.studysets",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
