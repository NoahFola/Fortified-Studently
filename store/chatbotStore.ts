import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import generateId from "@/utils/generateId";

// --- TYPE DEFINITIONS ---
export type ChatRole = "user" | "bot";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
}

interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isThinking: boolean;
  // Context IDs for global awareness
  activeCourseId: string | null;
  activeTopicId: string | null;

  // Actions
  toggleBot: () => void;
  setThinking: (status: boolean) => void;
  clearHistory: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setActiveContext: (courseId: string | null, topicId: string | null) => void;
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      messages: [
        {
          id: "initial",
          role: "bot",
          text: "Hello! I am your Study Bot. Paste some material, select a course, or choose a topic, and I can answer specific questions about it!",
          timestamp: new Date().toISOString(),
        },
      ],
      isThinking: false,
      activeCourseId: null,
      activeTopicId: null,

      toggleBot: () => set((state) => ({ isOpen: !state.isOpen })),
      setThinking: (status) => set({ isThinking: status }),
      clearHistory: () =>
        set({
          messages: [
            {
              id: "initial-clear",
              role: "bot",
              text: "History cleared. What can I help you learn today?",
              timestamp: new Date().toISOString(),
            },
          ],
        }),

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: generateId(3),
              timestamp: new Date().toISOString(),
            },
          ],
        })),

      setActiveContext: (courseId, topicId) =>
        set({
          activeCourseId: courseId,
          activeTopicId: topicId,
        }),
    }),
    {
      name: "studently.studybot",
      storage: createJSONStorage(() => localStorage),
      // Only persist messages and UI state, not dynamic context or thinking status
      partialize: (state) => ({
        messages: state.messages,
        isOpen: state.isOpen,
      }),
    }
  )
);
