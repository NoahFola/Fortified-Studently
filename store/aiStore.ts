import { create } from "zustand";
import { chat } from "@/lib/chat";

export const useAIStore = create<AIStore>((set, get) => ({
  messages: [],
  suggestions: [],
  context: {},

  pushMessage: (msg) =>
    set((s) => ({
      ...s,
      messages: [
        ...s.messages,
        {
          ...msg,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  pushSuggestion: (sug) =>
    set((s) => ({
      ...s,
      suggestions: [
        ...s.suggestions,
        {
          ...sug,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  updateContext: (ctx) => set({ context: ctx }),

  getSuggestion: async () => {
    const res = await chat(
      "Give a study-related suggestion for the student based on context."
    );
    // Use pushSuggestion to ensure type safety
    get().pushSuggestion?.(res);
  },
}));
