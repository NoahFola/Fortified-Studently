// src/stores/semesterStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { gradePointsMap } from "@/constants/gradePointsMap";
import generateId from "@/utils/generateId";

export const useSemesterStore = create<SemesterStore>()(
  persist(
    (set, get) => ({
      semesters: [],

      addSemester: ({ name, startDate, endDate }) =>
        set((s) => ({
          semesters: [
            ...s.semesters,
            {
              id: generateId(1),
              name,
              startDate: startDate ?? new Date().toISOString(),
              endDate: endDate ?? "",
              courses: [],
              gpa: 0,
              progress: 0,
            },
          ],
        })),
      getSemesterById(semesterId) {
        return get().semesters.find((sem) => sem.id === semesterId)!;
      },
      updateSemester: (id, partial) =>
        set((s) => ({
          semesters: s.semesters.map((sem) =>
            sem.id === id ? { ...sem, ...partial } : sem
          ),
        })),
      updateSemesterProgress(semesterId: string) {
        const semester = get().getSemesterById(semesterId);
        const progress =
          semester.courses.reduce((sum, c) => sum + (c.progress ?? 0), 0) /
          semester.courses.length;
        const updatedSemester = {
          ...semester,
          progress,
        };
        set((s) => ({
          semesters: s.semesters.map((sem) =>
            sem.id === semesterId ? updatedSemester : sem
          ),
        }));
        return progress;
      },
      calculateGPA: (semesterId, courses) => {
        // const courseStore = getCourseStore(); // direct access to course store
        // const courses = courseStore.getCoursesForSemester(semesterId);

        if (!courses || courses.length === 0) return 0;

        let totalPoints = 0;
        let totalUnits = 0;

        for (const course of courses) {
          const courseGrade = course.grade;
          const gp = gradePointsMap[courseGrade] ?? 0;
          totalPoints += gp * course.units;
          totalUnits += course.units;
        }

        if (totalUnits === 0) return 0;
        const gpa = Number((totalPoints / totalUnits).toFixed(2));

        set((s) => ({
          semesters: s.semesters.map((sem) =>
            sem.id === semesterId ? { ...sem, gpa } : sem
          ),
        }));
        return gpa;
      },
    }),
    {
      name: "studently-semesters", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
