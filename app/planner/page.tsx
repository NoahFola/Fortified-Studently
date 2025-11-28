"use client";

import { useState } from "react";
import { CalendarGrid } from "@/components/planner/CalendarGrid";
import { MissedEventAlert } from "@/components/planner/MissedEventAlert";
import { Button } from "@/components/ui/button";
import { usePlannerStore } from "@/store/plannerStore";
import { Sparkles, Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PlannerPage() {
  const { autoScheduleForTopic } = usePlannerStore();
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutoSchedule = async () => {
    if (!topic) return;
    setIsGenerating(true);
    await autoScheduleForTopic(topic);
    setIsGenerating(false);
    setTopic("");
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planner</h1>
          <p className="text-muted-foreground">
            Manage your study schedule and deadlines.
          </p>
        </div>
        <Button variant="secondary">
          <Calendar size={20} /> Sync Google Calendar
        </Button>
        {/* AI Auto-Scheduler Demo */}
        <div className="flex items-center gap-2 w-full md:w-auto bg-card border p-2 rounded-lg shadow-sm">
          <Input
            placeholder="Enter topic to auto-schedule..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full md:w-[250px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          />
          <Button
            onClick={handleAutoSchedule}
            disabled={!topic || isGenerating}
            size="sm"
            className="shrink-0"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Auto Schedule
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <CalendarGrid />
      </div>

      <MissedEventAlert />
    </div>
  );
}
