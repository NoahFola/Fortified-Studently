"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const BlanksView = ({ questions }: { questions: FillBlank[] }) => {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const q = questions[index];
  const parts = q.sentence.split("______");
  const correctAnswer = q.correctAnswer || "answer";

  const handleCheck = () => {
    if (!userAnswer.trim()) return;

    if (
      userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    ) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  const handleNext = () => {
    const nextIndex = Math.min(questions.length - 1, index + 1);
    setIndex(nextIndex);
    setUserAnswer("");
    setStatus("idle");
  };

  const handlePrev = () => {
    const prevIndex = Math.max(0, index - 1);
    setIndex(prevIndex);
    setUserAnswer("");
    setStatus("idle");
  };

  return (
    <div className="max-w-3xl mx-auto py-8 flex flex-col items-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit="exit"
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Card
          className={cn(
            "border shadow-md overflow-hidden transition-colors duration-500",
            status === "correct"
              ? "bg-green-50 border-green-300"
              : status === "wrong"
              ? "bg-red-50 border-red-300"
              : "bg-card border-border"
          )}
        >
          <CardContent className="p-12 flex flex-col items-center text-center space-y-10">
            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  status === "idle"
                    ? "text-muted-foreground"
                    : status === "correct"
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {status === "idle"
                  ? "Fill in the blank"
                  : status === "correct"
                  ? "Correct!"
                  : "Incorrect, try again"}
              </span>
            </motion.div>

            {/* Sentence */}
            <h2 className="text-2xl font-medium leading-relaxed break-words">
              {parts[0]}
              <motion.span
                key={userAnswer + status}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "inline-block mx-2 border-b-2 min-w-[120px] px-2 font-bold transition-all rounded",
                  status === "idle"
                    ? "border-muted text-foreground"
                    : status === "correct"
                    ? "border-green-500 text-green-700 bg-green-100/50"
                    : "border-red-400 text-red-700 bg-red-100/50"
                )}
              >
                {status === "correct" ? correctAnswer : userAnswer || "\u00A0"}
              </motion.span>
              {parts[1]}
            </h2>

            {/* Input / Actions */}
            <div className="w-full max-w-sm flex flex-col gap-4">
              {status !== "correct" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Input
                      placeholder="Type your answer"
                      value={userAnswer}
                      onChange={(e) => {
                        setUserAnswer(e.target.value);
                        if (status === "wrong") setStatus("idle");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                      className="text-center text-lg h-12 bg-card border-border focus:border-primary focus:ring-primary"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                  >
                    <Button
                      onClick={handleCheck}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Check Answer
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-muted-foreground hover:text-accent"
                    >
                      <Sparkles className="w-3 h-3 mr-1 inline" /> Need a hint?
                    </Button>
                  </motion.div>
                </>
              )}

              {status === "correct" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={handleNext}
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex justify-center gap-4 mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </motion.div>

        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const nextIndex = Math.min(questions.length - 1, index + 1);
              setIndex(nextIndex);
              setUserAnswer("");
              setStatus("idle");
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BlanksView;
