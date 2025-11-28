// src/components/courses/TopicList.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useTopicStore } from "@/store/topicStore";
import TopicCard from "./TopicCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TopicList({ courseId }: { courseId: string }) {
  const { topics } = useTopicStore();
  const filtered = useMemo(() => {
    return topics.filter((t) => t.courseId === courseId);
  }, [topics, courseId]);
  const addTopic = useTopicStore((s) => s.addTopic);

  // States for modal
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTopic(courseId, {
      title,
      description,
      subtopics: [],
    });

    // reset
    setTitle("");
    setDescription("");
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-lg font-semibold">Topics</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="text-sm underline">+ Add Topic</button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Topic</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm">Topic Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Thermodynamics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Description (optional)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the topic..."
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Topic</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Render topics */}
      {filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No topics yet. Upload outline to auto-create topics or add one
          manually.
        </div>
      ) : (
        <div className="flex scrollbar gap-4 overflow-x-auto pt-2 pb-4 snap-x snap-mandatory">
          {filtered.map((t, idx) => (
            <TopicCard key={t.id} topic={t} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
