// src/components/semesters/CourseCard.tsx
"use client";
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/semesters/${course.semesterId}/courses/${course.id}`}>
      <motion.div
        className="p-4 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-lg shadow-md hover:shadow-xl transition-all px-4">
          {/* Header Section */}
          <motion.div
            className="flex justify-between items-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div>
              <h4 className="text-xl font-semibold text-card-foreground">
                {course.code ?? course.name}
              </h4>
              <p className="text-sm text-muted-foreground">{course.name}</p>
            </div>
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Pencil className="text-gray-500 hover:text-blue-500" />
            </motion.div> */}
          </motion.div>

          {/* Info Section */}
          <motion.div
            className="mt-3 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="text-sm text-muted-foreground">
              Units: {course.units ?? "-"}
            </div>
            <div className="text-sm text-muted-foreground">
              Grade: {course.grade ?? "-"}
            </div>
            <div className="text-sm text-muted-foreground">
              Topics: {course.topics?.length ?? 0}
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </Link>
  );
}
