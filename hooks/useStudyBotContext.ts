"use client";

import { useMemo } from "react";
import { useCourseStore } from "@/store/courseStore";
import { useTopicStore } from "@/store/topicStore";
import { useStudyStore } from "@/store/studyStore";

interface StudyContext {
  id: string | null;
  type: "course" | "topic" | "studyset" | "general";
  title: string;
  contextText: string;
}

/**
 * Parses the URL pathname to determine the active context (Course, Topic, or Study Set)
 * and retrieves the corresponding detailed material (Notes, Topics, etc.) from the stores.
 * * @param pathname The current URL pathname (e.g., /semesters/s1/courses/c1/topics/t1)
 * @returns {StudyContext} An object containing the context details and material text.
 */
export const useStudyBotContext = (pathname: string): StudyContext => {
  const courseStore = useCourseStore();
  const topicStore = useTopicStore();
  const studyStore = useStudyStore();

  const context: StudyContext = useMemo(() => {
    // --- 1. Study Set Context (e.g., /study/sets/[id]) ---
    const studyMatch = pathname.match(/\/study\/sets\/([^/]+)/);
    if (studyMatch) {
      const setId = studyMatch[1];
      const set = studyStore.studysets[setId];

      if (set) {
        return {
          id: setId,
          type: "studyset",
          title: set.topic || "Study Set",
          contextText: `MATERIAL CONTEXT (Study Set: ${set.topic}): Summary: ${set.notes.summary}. Full Notes: ${set.notes.content}.`,
        };
      }
    }

    // --- 2. Topic/Course Context (e.g., /semesters/[sId]/courses/[cId]/topics/[tId]) ---
    const topicMatch = pathname.match(/\/courses\/([^/]+)\/topics\/([^/]+)/);
    if (topicMatch) {
      const courseId = topicMatch[1];
      const topicId = topicMatch[2];

      const topic = topicStore.topics.find((t) => t.id === topicId);
      const course = courseStore.courses.find((c) => c.id === courseId);

      // Attempt to retrieve related notes for deep context
      const notes = topicStore.notes
        .filter((n) => n.topicId === topicId)
        .map((n) => n.content)
        .join("\n\n--- NOTE BREAK ---\n\n");

      if (topic && course) {
        return {
          id: topicId,
          type: "topic",
          title: `${course.code}: ${topic.title}`,
          contextText: `COURSE: ${course.name} (${course.code}, ${course.units} units). TOPIC: ${topic.title}. DESCRIPTION: ${topic.description}. USER NOTES: ${notes}`,
        };
      }
    }

    // --- 3. Course Detail Context (e.g., /semesters/[sId]/courses/[cId]) ---
    const courseMatch = pathname.match(/\/courses\/([^/]+)$/);
    if (courseMatch) {
      const courseId = courseMatch[1];
      const course = courseStore.courses.find((c) => c.id === courseId);

      if (course) {
        // Collect all topics and their descriptions as context
        const topicSummaries = course.topics
          ?.map((t) => `${t.title}: ${t.description}`)
          .join("\n");

        return {
          id: courseId,
          type: "course",
          title: course.name,
          contextText: `COURSE: ${course.name} (${course.code}). UNITS: ${
            course.units
          }. TOPICS: ${topicSummaries || "No topics defined yet."}`,
        };
      }
    }

    // --- 4. Default/General Context ---
    return {
      id: null,
      type: "general",
      title: "General Learning",
      contextText:
        "The user is currently on a general page (Semester List, Planner, or Landing). Provide general advice or ask the user to navigate to a specific course/topic for targeted help.",
    };
  }, [
    pathname,
    courseStore.courses,
    topicStore.topics,
    topicStore.notes,
    studyStore.studysets,
  ]);

  return context;
};
