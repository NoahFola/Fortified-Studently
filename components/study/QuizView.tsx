"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const QuizView = ({ questions }: { questions: TestQuestion[] }) => {
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const q = questions[index];
  const correctAnswer = q.options[q.correctIndex];

  const handleOptionSelect = (opt: string) => {
    if (isSubmitted) return;
    setSelectedOption(opt);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setIndex(Math.min(questions.length - 1, index + 1));
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handlePrev = () => {
    setIndex(Math.max(0, index - 1));
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  // Motion variants
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.4 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const optionVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        key={index} // re-render animation on question change
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <Card className="shadow-md">
          <CardContent className="p-8 md:p-12 space-y-8">
            {/* Question Header */}
            <motion.div variants={optionVariant} className="space-y-4">
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border text-muted-foreground">
                Question {index + 1} of {questions.length}
              </span>
              <h2 className="text-2xl font-semibold leading-tight">
                {q.question}
              </h2>
            </motion.div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt: string, i: number) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === correctAnswer;

                let styleClass = "hover:bg-gray-100";
                let icon = (
                  <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold mt-0.5 bg-gray-200">
                    {String.fromCharCode(65 + i)}
                  </div>
                );

                if (isSubmitted) {
                  if (isCorrect) {
                    styleClass =
                      "border-green-200 bg-green-50 ring-1 ring-green-500 text-green-900";
                    icon = (
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-green-100 text-green-700 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    );
                  } else if (isSelected) {
                    styleClass =
                      "border-red-200 bg-red-50 ring-1 ring-red-500 text-red-900";
                    icon = (
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-red-100 text-red-700 mt-0.5">
                        <XCircle className="w-4 h-4" />
                      </div>
                    );
                  } else {
                    styleClass = "opacity-50";
                  }
                } else if (isSelected) {
                  styleClass = "ring-1 ring-blue-400";
                }

                return (
                  <motion.button
                    key={i}
                    variants={optionVariant}
                    onClick={() => handleOptionSelect(opt)}
                    disabled={isSubmitted}
                    className={cn(
                      "p-4 text-left rounded-lg border transition-all flex items-start gap-4 group w-full",
                      styleClass
                    )}
                  >
                    {icon}
                    <span className="flex-1">{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Navigation */}
            <motion.div
              variants={optionVariant}
              className="flex items-center justify-between pt-4 border-t"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={index === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={index === questions.length - 1}
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizView;
