// src/components/courses/TopicCard.tsx
"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTopicStore } from "@/store/topicStore";

import { chat } from "@/lib/chat";
import { useStudyStore } from "@/store/studyStore";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Glow from "../Glow";

export default function TopicCard({
  topic,
  idx,
}: {
  topic: Topic;
  idx: number;
}) {
  const { addNote, updateTopicProgress } = useTopicStore();
  // const { completeAction } = useGamificationStore();
  const [loading, setLoading] = useState(false);

  const onComplete = () => {
    updateTopicProgress(topic.id, 100);
  };

  const progress = topic.progress ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: idx * 0.2 }}
      className="min-w-[250px] relative bg-card text-card-foreground border-none rounded-xl shadow flex flex-col justify-between min-h-[150px] snap-start group"
      whileHover={{ scale: 1.01 }}
    >
      <Glow />
      <div className="relative h-full z-8 transition-all bg-card text-card-foreground duration-500 min-w-[250px] rounded-xl  p-4 flex flex-col justify-between min-h-[150px] snap-start">
        <p className="font-semibold mb-2 text-clamp text-left capitalize">
          {topic.title}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            key={progress}
            className="bg-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex gap-2 items-center justify-between">
          <Link href="/study">
            <Button size="sm">Study</Button>
          </Link>
          <Button size="sm" variant="secondary" onClick={onComplete}>
            Complete Topic
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
