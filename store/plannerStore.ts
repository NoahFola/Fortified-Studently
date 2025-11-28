import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EventType = "study" | "deadline" | "personal";

export interface PlannerEvent {
  id: string;
  title: string;
  date: string; // ISO string YYYY-MM-DD
  type: EventType;
  description?: string;
  completed: boolean;
  color?: string; // Optional override, otherwise derived from type
}

interface PlannerState {
  events: PlannerEvent[];

  addEvent: (event: Omit<PlannerEvent, "id" | "completed">) => void;
  updateEvent: (id: string, updates: Partial<PlannerEvent>) => void;
  deleteEvent: (id: string) => void;

  // "AI" Logic
  autoScheduleForTopic: (topic: string) => Promise<void>;
  checkMissedEvents: () => PlannerEvent[];
  moveEventToToday: (id: string) => void;
}

const EVENT_COLORS: Record<EventType, string> = {
  study: "bg-blue-500",
  deadline: "bg-red-500",
  personal: "bg-green-500",
};

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              id: crypto.randomUUID(),
              completed: false,
              color: EVENT_COLORS[event.type],
            },
          ],
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      autoScheduleForTopic: async (topic) => {
        // Mock "AI" Delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const today = new Date();
        const newEvents: PlannerEvent[] = [];

        // Generate 3 sessions over the next few days
        for (let i = 1; i <= 3; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateStr = date.toISOString().split("T")[0];

          newEvents.push({
            id: crypto.randomUUID(),
            title: `${topic} Session ${i}`,
            date: dateStr,
            type: "study",
            description: `Auto-scheduled study block for ${topic}. Focus on key concepts.`,
            completed: false,
            color: EVENT_COLORS["study"],
          });
        }

        set((state) => ({
          events: [...state.events, ...newEvents],
        }));
      },

      checkMissedEvents: () => {
        const { events } = get();
        const today = new Date().toISOString().split("T")[0];

        // Find events before today that are not completed
        return events.filter((e) => e.date < today && !e.completed);
      },

      moveEventToToday: (id) => {
        const today = new Date().toISOString().split("T")[0];
        get().updateEvent(id, { date: today });
      },
    }),
    {
      name: "planner-storage",
    }
  )
);
