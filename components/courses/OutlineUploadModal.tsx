// src/components/courses/OutlineUploadModal.tsx
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCourseStore } from "@/store/courseStore";
import { useTopicStore } from "@/store/topicStore";
import { chat } from "@/lib/chat"; // your Claude wrapper

/**
 * Mocked flow:
 *  - user pastes course outline text
 *  - we call chat() with a prompt to extract topics/subtopics
 *  - chat returns a JSON-like structure (we expect parsed text)
 *  - we add topics to topicStore
 */

export default function OutlineUploadModal({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const addTopic = useTopicStore((s) => s.addTopic);
  const addCourse = useCourseStore((s) => s.addCourse);

  const onExtract = async () => {
    if (!text.trim()) return;
    // Example prompt: ask Claude to return JSON array of topics with subtopics
    const prompt = `Extract topics and subtopics from this course outline. Return JSON:
[
  { "title": "...", "subtopics": ["...", "..."] }
]
Course outline:
${text}`;

    // chat() returns parsed response (per your wrapper); we expect JSON

    let res: any = null;
    try {
      res = await chat(prompt);
    } catch (e) {
      // fallback: naive split by lines
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      res = lines.slice(0, 6).map((l) => ({ title: l, subtopics: [] }));
    }

    // If res is string, try parse JSON inside it
    let parsed = res;
    if (typeof res === "string") {
      try {
        parsed = JSON.parse(res);
      } catch {
        // if not JSON, convert manually
        parsed = res
          .split("\n")
          .slice(0, 6)
          .map((l: string) => ({ title: l, subtopics: [] }));
      }
    }

    // Add topics to store (keep ids)
    if (Array.isArray(parsed)) {
      for (const t of parsed) {
        const title = t.title || t.name || "Untitled";
        const newTopic = { name: title };
        addTopic(courseId, title);
      }
    }

    setOpen(false);
    setText("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Outline</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paste course outline</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste syllabus, topics, or course outline here..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onExtract}>Extract Topics (AI)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
