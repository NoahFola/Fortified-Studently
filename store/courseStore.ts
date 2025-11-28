import generateId from "@/utils/generateId";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useTopicStore } from "./topicStore";

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: [],

      addCourse: (semesterId, coursePayLoad) => {
        const newCourse = {
          id: generateId(),
          semesterId,
          name: coursePayLoad.name,
          grade: coursePayLoad.grade || "-",
          units: coursePayLoad.units,
          code: coursePayLoad.code,
          notes: [],
          topics: coursePayLoad.topics ?? [],
          progress: 0,
        };
        set((s) => ({
          courses: [...s.courses, newCourse],
        }));
        return newCourse;
      },
      getCourseById(courseId) {
        return get().courses.find((course) => course.id === courseId)!;
      },
      getCoursesForSemester: (semesterId) =>
        get().courses.filter((c) => c.semesterId === semesterId),
      updateCourse: (id, partial) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === id ? { ...c, ...partial } : c
          ),
        })),
      updateCourseProgress(id) {
        const topics = useTopicStore
          .getState()
          .topics.filter((topic) => topic.courseId === id);

        const course = get().getCourseById(id);

        // Calculate progress
        const progress =
          (course.topics?.reduce((sum, t) => sum + (t.progress ?? 0), 0) ?? 0) /
          (course.topics?.length || 1);

        console.log("this is progress", progress);

        // Update the course in the store
        const updatedCourse = {
          ...course,
          topics, // Ensure the updated topics are included
          progress, // Update the progress field
        };

        // Update the course list in the store with the modified course
        set((s) => ({
          courses: s.courses.map(
            (c) => (c.id === id ? updatedCourse : c) // Update the existing course
          ),
        }));

        console.log(course, get().courses, topics);

        return progress;
      },
    }),

    {
      name: "studently-courses",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
