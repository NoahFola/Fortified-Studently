"use client";
import React from "react";
import { useCourseStore } from "@/store/courseStore";
import { motion } from "framer-motion";

export default function SemesterKPIs({
  semester,
  compact = false,
}: {
  semester: Semester;
  compact?: boolean;
}) {
  const { getCoursesForSemester } = useCourseStore();
  const courses = getCoursesForSemester(semester.id);
  const units = courses.reduce((s, c) => s + (c.units ?? 0), 0);
  const courseCount = courses.length;

  // GPA display uses semester.gpa
  const gpa = semester.gpa ?? 0;

  return (
    <motion.div
      className="flex gap-4 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-sm text-muted-foreground">Courses</div>
        <div className="font-semibold text-xl">{courseCount}</div>
        {/* <div className="mt-2 text-xs text-muted-foreground">Total Courses</div> */}
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="text-sm text-muted-foreground">Units</div>
        <div className="font-semibold text-xl">{units}</div>
        {/* <div className="mt-2 text-xs text-muted-foreground">Total Units</div> */}
      </div>

      {/* Optional: Add GPA or other KPIs */}
      {/* <div className="p-4 bg-card rounded-2xl flex flex-col items-center justify-center shadow-md">
        <div className="text-sm text-muted-foreground">GPA</div>
        <div className="font-semibold text-xl">
          {gpa ? gpa.toFixed(2) : "—"}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">GPA out of 4.0</div>
      </div> */}

      {/* Example for adding more KPIs */}
      {/* <div className="p-4 flex flex-col items-center justify-center">
        <div className="text-sm text-muted-foreground">Progress</div>
        <div className="font-semibold text-xl">{semester.progress ?? 0}%</div>
        <div className="mt-2 text-xs text-muted-foreground">
          Course Completion
        </div>
      </div> */}
    </motion.div>
  );
}
