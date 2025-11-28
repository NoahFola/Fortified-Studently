// src/components/DashboardQuickActions.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button"; // or use Button directly
import { useStudyStore } from "@/store/studyStore";
import { useAIStore } from "@/store/aiStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardQuickActions() {
  const generateStudyPlan = useStudyStore((s) => s.generateStudyPlan);
  const generateTest = useStudyStore((s) => s.generateTest);
  const fetchAIMessage = useStudyStore((s) => s.fetchAIMessage);
  const pushMessage = useAIStore((s) => s.pushMessage);
  const [courseName, setCourseName] = useState("Calculus II");
  const [topic, setTopic] = useState("Integration");

  const onPlan = async () => {
    await generateStudyPlan(courseName);
    pushMessage({
      message: `Generated a study plan for ${courseName}.`,
      context: "study",
    });
  };

  const onNotetaker = async () => {
    const msg = await fetchAIMessage();
    pushMessage({ message: msg || "Quick note ready.", context: "notetaker" });
  };

  const onFlashcards = async () => {
    await generateTest(topic);
    pushMessage({ message: `Generated flashcards/questions for ${topic}.` });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold">Quick Actions</h3>
        <div className="text-xs text-muted-foreground">AI-powered</div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="input w-full"
            placeholder="Course name"
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input w-full"
            placeholder="Topic"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onPlan} variant="default">
            Generate Study Plan
          </Button>
          <Button onClick={onNotetaker} variant="outline">
            AI Note Taker
          </Button>
          <Button onClick={onFlashcards} variant="ghost">
            Flashcards
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground"
        >
          Tip: use the AI to break a course into a 3-day revision plan.
        </motion.div>
      </div>
    </Card>
  );
}
