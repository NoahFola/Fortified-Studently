// src/components/courses/CourseDetailHeader.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CourseDetailHeader({ course }: { course: Course }) {
  const progress = course.progress ?? 0;
  return (
    <motion.div
      className="bg-card text-card-foreground shadow rounded-2xl p-6 min-h-[250px] flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* <Button asChild>
        <a href={`/semesters/${course.semesterId}`}>Back</a>
      </Button> */}
      <h1 className="text-2xl font-bold">
        {course.code} - {course.name}
      </h1>
      <p className="">
        Units: {course.units} | Grade: {course.grade}
      </p>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            key={progress}
            className="bg-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Progress: {Math.ceil(progress) || 0}%
        </p>
      </div>
      {/* <div className="flex items-center gap-3">
        <button
          onClick={() => updateCourse(course.id, { name: course.name + "" })}
          title="Edit course"
          className="p-2 rounded"
        >
          <Pencil />
        </button>

        <OutlineUploadModal courseId={course.id} />
 */}

      {/* </div> */}
    </motion.div>
  );
}
