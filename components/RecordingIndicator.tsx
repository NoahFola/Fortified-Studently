"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStudyStore } from "@/store/studyStore";
import { useStudySetVoiceGeneration } from "@/hooks/useStudySetVoiceGeneration";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
};

export default function RecordingIndicator() {
  const { isRecording, stopRecording } = useStudyStore();
  const { loading, statusText, generateFromVoice } =
    useStudySetVoiceGeneration();
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Timer Logic ---
  useEffect(() => {
    if (isRecording) {
      // Start/continue timer only when isRecording is true
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      // Clear interval when recording stops
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Reset timer UI if not in loading/processing state
      if (!loading) {
        setSeconds(0);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, loading]);

  // --- Stop & Process Logic ---
  const handleStop = () => {
    if (isRecording) {
      // 1. Immediately stop the recording state in the store
      stopRecording();
      // 2. Trigger the generation hook
      generateFromVoice();
    }
  };

  return (
    <AnimatePresence>
      {(isRecording || loading) && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 h-16 z-[60] flex items-center justify-center p-3 shadow-2xl backdrop-blur-sm"
          style={{ background: "var(--card)" }}
        >
          <div className="flex items-center space-x-6 rounded-full px-5 py-2 shadow-xl border border-input bg-background">
            {/* Status / Mic Indicator */}
            <div className="flex items-center space-x-3">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 bg-red-600 rounded-full"
                />
              )}
              <Mic className="w-5 h-5 text-red-600" />
              <span className="font-bold text-foreground">
                {loading ? "Processing..." : "Recording Lecture"}
              </span>
            </div>

            {/* Timer */}
            <span className="text-xl font-mono text-foreground/80">
              {formatTime(seconds)}
            </span>

            {/* Stop Button */}
            <Button
              onClick={handleStop}
              disabled={loading}
              size="icon"
              className={cn(
                "h-10 w-10 transition-all",
                isRecording && !loading
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-primary/50 cursor-wait"
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Square className="w-4 h-4 fill-white text-white" />
              )}
            </Button>
            {loading && (
              <Badge className="text-sm animate-pulse" variant="secondary">
                {statusText}
              </Badge>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
