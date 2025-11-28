"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS ---
// export interface WrittenQuestion {
//   id: string;
//   question: string;
//   sampleAnswer: string;
//   explanation: string;
//   hint: string;
// }

interface WrittenTestViewProps {
  questions: WrittenQuestion[];
}

// --- FRAMER MOTION VARIANTS ---
const cardVariants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  }),
};

// --- COMPONENT ---
export default function WrittenTestView({ questions }: WrittenTestViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  // Helper function to navigate
  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = totalQuestions - 1;
      if (newIndex >= totalQuestions) newIndex = 0;
      return newIndex;
    });
    // Reset state for new question
    setUserAnswer("");
    setShowAnswer(false);
  };

  const handleNext = () => paginate(1);
  const handlePrev = () => paginate(-1);
  const handleSubmit = () => setShowAnswer(true);

  return (
    <div className="flex flex-col items-center space-y-6 p-4 sm:p-0">
      {/* --- Progress Indicator --- */}
      <div className="text-sm font-medium text-muted-foreground bg-popover rounded-full px-4 py-1 shadow-sm">
        {currentIndex + 1} / {totalQuestions}
      </div>

      {/* --- Main Question Area (Animated) --- */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          //@ts-expect-error framer-motion-error
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-3xl"
        >
          <Card className="shadow-lg border-2 border-primary/10">
            <CardContent className="p-6 space-y-6">
              {/* Question Text */}
              <div className="text-xl font-semibold text-foreground text-center min-h-[5rem] flex items-center justify-center">
                <p>{currentQuestion.question}</p>
              </div>

              <Separator />

              {/* User Input */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-muted-foreground">
                  Your Answer:
                </h3>
                <Textarea
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={showAnswer}
                  rows={5}
                  className="bg-background border-input focus:ring-2 focus:ring-primary/50"
                />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={showAnswer || userAnswer.trim().length === 0}
                    className="transition duration-150"
                  >
                    {showAnswer ? "Answer Submitted" : "Submit & Review"}
                  </Button>
                </div>
              </div>

              {/* Sample Answer & Explanation (Shown on Submit) */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pt-4 border-t border-dashed border-input"
                  >
                    {/* Sample Answer */}
                    <div className="space-y-2 p-4 bg-secondary/30 rounded-lg border border-secondary/50">
                      <h4 className="flex items-center text-lg font-bold text-secondary-foreground">
                        <CheckCircle className="w-5 h-5 mr-2 text-secondary-foreground" />
                        Sample Answer
                      </h4>
                      <p className="text-foreground/80">
                        {/* {currentQuestion.sampleAnswer} */}
                      </p>
                    </div>

                    {/* Explanation */}
                    {currentQuestion.explanation && (
                      <div className="space-y-2 p-4 bg-popover rounded-lg border border-popover-foreground/10">
                        <h4 className="flex items-center text-lg font-bold text-primary">
                          <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                          Explanation
                        </h4>
                        <p className="text-foreground/80">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    )}

                    {/* Hint (if provided) */}
                    {currentQuestion.hint && (
                      <div className="space-y-2 p-4 bg-card rounded-lg border border-card-foreground/10">
                        <h4 className="flex items-center text-lg font-bold text-yellow-600">
                          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                          Hint Reference
                        </h4>
                        <p className="text-foreground/80">
                          {currentQuestion.hint}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* --- Navigation Controls --- */}
      <div className="flex justify-between w-full max-w-3xl pt-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
