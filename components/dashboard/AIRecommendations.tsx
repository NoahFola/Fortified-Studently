// src/components/AIRecommendations.tsx
"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIStore } from "@/store/aiStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AIRecommendations() {
  const suggestions = useAIStore((s) => s.suggestions);
  const getSuggestion = useAIStore((s) => s.getSuggestion);
  const messages = useAIStore((s) => s.messages);

  useEffect(() => {
    if (suggestions.length === 0) {
      getSuggestion();
    }
  }, [getSuggestion, suggestions.length]);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold">Today’s AI Recommendations</h3>
        <Button size="sm" onClick={getSuggestion} variant="ghost">
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {suggestions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              No suggestions yet — ask Junie to help.
            </motion.div>
          ) : (
            suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg p-3 bg-[var(--color-popover)]"
              >
                <div className="text-sm">{s.message}</div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        <div className="text-xs text-muted-foreground">
          {messages.length > 0 ? messages[messages.length - 1].message : ""}
        </div>
      </div>
    </Card>
  );
}
