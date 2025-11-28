// app/courses/[id]/page.tsx
"use client";
import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseDetailHeader from "@/components/courses/CourseDetailHeader";
import TopicList from "@/components/courses/TopicList";
import NoteEditor from "@/components/courses/NoteEditor";
import { useCourseStore } from "@/store/courseStore";
import { Card } from "@/components/ui/card";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const { courses } = useCourseStore();
  const course = useMemo(() => {
    return courses.find((c) => c.id === courseId);
  }, [courseId, courses]);

  if (!course) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Course not found</h2>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-6 max-w-7xl mx-auto">
      <CourseDetailHeader course={course} />
      <TopicList courseId={courseId} />

      {/* <Card className="p-4"> */}
      {/* <h3 className="text-lg font-semibold mb-3">Notes Editor</h3> */}
      {/* <NoteEditor courseId={courseId} /> */}
      {/* </Card> */}

      {/* <aside className="space-y-6">
          <Card className="p-4">
            <h3 className="text-md font-semibold">Suggested timeline</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This timeline is AI-suggested (mocked) and editable. Use it to
              schedule study sessions.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div>Week 1: Intro + Topic 1</div>
                <div className="text-xs text-muted-foreground">3 days</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Week 2: Topic 2 & 3</div>
                <div className="text-xs text-muted-foreground">4 days</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-md font-semibold">Quick Actions</h3>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={`/study/course/${courseId}`}
                className="text-blue-600 underline"
              >
                Go to Study View
              </a>
              <button className="btn btn-ghost">Export Notes</button>
            </div>
          </Card>
        </aside> */}
    </div>
  );
}
