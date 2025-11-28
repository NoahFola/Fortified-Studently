import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useCourseStore } from "./courseStore";
import { useSemesterStore } from "./semesterStore";

export const useTopicStore = create<TopicStore>()(
  persist(
    (set, get) => ({
      topics: [],
      notes: [],

      addTopic: (courseId, topic) =>
        set((s) => ({
          topics: [
            ...s.topics,
            {
              id: crypto.randomUUID(),
              progress: 0,
              courseId,
              ...topic,
            },
          ],
        })),

      addNote: (topicId, courseId, note) =>
        set((s) => ({
          notes: [
            ...s.notes,
            {
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              ...note,
              topicId,
              courseId,
            },
          ],
        })),

      getTopicById: (topicId) => {
        const topic = get().topics.find((topic) => topic.id === topicId)!;
        return topic;
      },

      updateNote: (noteId, content) => {
        // Note update logic goes here, placeholder function body
      },

      updateTopicProgress: (topicId, progress) => {
        set((s) => ({
          topics: s.topics.map((t) =>
            t.id === topicId ? { ...t, progress } : t
          ),
        }));

        // Use the updated state to get the topic
        const topic = get().topics.find((t) => t.id === topicId); // This ensures you're getting the correct updated state
        console.log("Updated topic progress:", topic?.progress);

        if (topic) {
          // Update course progress
          useCourseStore.getState().updateCourseProgress(topic.courseId);

          const course = useCourseStore
            .getState()
            .getCourseById(topic.courseId);
          console.log("Updated course progress:", course.progress);

          // Update semester progress
          useSemesterStore.getState().updateSemesterProgress(course.semesterId);
        }
      },
    }),
    {
      name: "studently-topics",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
