// src/pages/semesterDetailPage.tsx
"use client";
import React, { useMemo, useState } from "react"; // Import useState
import { useParams } from "next/navigation";
import { useSemesterStore } from "@/store/semesterStore";
import SemesterKPIs from "@/components/semesters/SemesterKPIs";
import CourseCard from "@/components/semesters/CourseCard";
import GpaTable from "@/components/semesters/GpaTable";
import { useCourseStore } from "@/store/courseStore";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import AddCourseDialog from "@/components/semesters/AddCourseDialog";
import { Button } from "@/components/ui/button"; // Ensure Button is imported
import { Upload } from "lucide-react"; // Ensure Upload icon is imported
import { motion } from "framer-motion";
// Import the new modal
import UploadOutlineModal from "@/components/semesters/UploadOutlineDialog";
import Glow from "@/components/Glow";
import GPAGauge from "@/components/GPAGauge";

export default function SemesterDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { getSemesterById } = useSemesterStore();
  const semester = getSemesterById(id);

  const { getCoursesForSemester } = useCourseStore();
  const courses = getCoursesForSemester(id);

  const units = useMemo(() => {
    return courses.reduce((sum, c) => sum + c.units, 0);
  }, [courses]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (!semester) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold">Semester not found</h3>
        <Link href="/semesters">Back</Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {semester.name} Overview
      </h1>

      {/* Stat Cards Section */}
      <div className="flex overflow-x-auto py-4 px-2 scrollbar gap-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Glow />
          <motion.div
            className="rounded-2xl bg-card flex flex-col items-center justify-center relative z-8 min-w-[200px] p-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-base text-muted-foreground">GPA</div>
            <GPAGauge gpa={semester.gpa} />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Glow />
          <motion.div
            className="rounded-2xl bg-card flex flex-col items-center justify-center relative z-8 min-w-[200px] p-4 gap-3 min-h-[156px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-base text-muted-foreground">Courses</div>
            <div className="font-semibold text-4xl">{courses.length}</div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Glow />
          <motion.div
            className="rounded-2xl bg-card flex flex-col items-center justify-center relative z-8 min-w-[200px] p-4 min-h-[156px] gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-base text-muted-foreground">Units</div>
            <div className="font-semibold text-4xl">{units}</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Courses Section */}
      <section>
        <div className="flex items-center gap-3 mb-3 justify-between">
          <h2 className="text-lg font-semibold">Courses</h2>
          <div className="flex gap-2 items-center">
            <AddCourseDialog semesterId={id} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              className="text-primary hover:bg-primary/5 ml-auto"
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Outline
            </Button>
          </div>
        </div>

        {/* Show message if no courses */}
        {courses.length === 0 ? (
          <div className="rounded-xl p-6 bg-card border border-dashed">
            <p className="text-sm text-muted-foreground">
              No courses yet. Add a new course or upload an outline to
              auto-create courses.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {courses.map((c) => (
              <motion.div
                key={c.id}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              >
                <CourseCard course={c} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* GPA Table */}
      <section>
        <h2 className="text-lg font-semibold mb-3">GPA Table</h2>
        <GpaTable semesterId={semester.id} />
      </section>

      {/* Upload Outline Modal */}
      <UploadOutlineModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        semesterId={id}
      />
    </div>
  );
}
