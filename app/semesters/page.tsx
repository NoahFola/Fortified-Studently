// app/semesters/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSemesterStore } from "@/store/semesterStore";
import SemesterCard from "@/components/semesters/SemesterCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import delay from "@/utils/delay";
import { AnimatePresence, motion } from "framer-motion";
import Glow from "@/components/Glow";
export default function SemestersPage() {
  const { semesters, addSemester } = useSemesterStore();
  const [isLoading, setIsLoading] = useState(false);
  const handleAddSemester = async () => {
    setIsLoading(true);
    await delay(2000);
    setIsLoading(false);
    addSemester({
      name: "Semester " + (semesters.length + 1),
      startDate: new Date().toISOString(),
      endDate: "",
    });
  };
  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-black/30 z-9999"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Semesters</h1>
          <p className="text-sm text-muted-foreground">
            Add a semester to start tracking courses and GPA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* <AddSemesterDialog /> */}
          <Button onClick={handleAddSemester}>+ Add Semester</Button>
        </div>
      </header>

      <main>
        {semesters.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold">No semesters yet</h3>
            <p className="text-sm text-muted-foreground">
              Click “Add Semester” to create your first semester.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {semesters.map((s, idx) => (
              <Link key={s.id} href={`/semesters/${s.id}`}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * idx }}
                  className="relative"
                >
                  <Glow />
                  <SemesterCard semester={s} />
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
