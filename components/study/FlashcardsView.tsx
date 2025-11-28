"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function FlashcardsView({ cards }: { cards: FlashCard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const counts = {
    unfamiliar: cards.length,
    learning: 0,
    familiar: 0,
    mastered: 0,
  };

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => setIndex((prev) => (prev + 1) % cards.length), 300);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(
      () => setIndex((prev) => (prev - 1 < 0 ? cards.length - 1 : prev - 1)),
      300
    );
  };

  const currentCard = cards[index];

  const statusVariant = {
    hidden: { opacity: 0, y: 8 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.35 },
    }),
  };

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto py-8">
      {/* Status Dots */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-8 text-sm font-medium"
        initial="hidden"
        animate="show"
        exit="hidden"
      >
        {[
          {
            label: "Unfamiliar",
            color: "var(--destructive)",
            count: counts.unfamiliar,
          },
          { label: "Learning", color: "var(--accent)", count: counts.learning },
          {
            label: "Familiar",
            color: "var(--primary)",
            count: counts.familiar,
          },
          {
            label: "Mastered",
            color: "var(--chart-3)",
            count: counts.mastered,
          },
        ].map((s, i) => (
          <motion.span
            key={s.label}
            variants={statusVariant}
            custom={i}
            className="flex items-center gap-1.5"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.count} {s.label}
          </motion.span>
        ))}
      </motion.div>

      {/* Flashcard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full aspect-[3/2] relative cursor-pointer [perspective:1200px]"
        onClick={() => setFlipped(!flipped)}
      >
        {/* Flipping container */}
        <div
          className={cn(
            "w-full h-full relative transition-transform duration-500",
            "[transform-style:preserve-3d]",
            flipped ? "[transform:rotateY(180deg)]" : ""
          )}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center 
                       bg-card text-card-foreground border rounded-xl shadow-md 
                       p-10 text-center 
                       [backface-visibility:hidden]"
          >
            <div
              className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] 
                         uppercase font-bold tracking-wider border"
              style={{
                background: "var(--destructive)/15",
                color: "var(--destructive)",
                borderColor: "var(--destructive)/30",
              }}
            >
              Unfamiliar
            </div>

            <h3 className="text-2xl font-medium leading-relaxed">
              {currentCard.front}
            </h3>

            <motion.p
              className="absolute bottom-8 text-sm font-medium opacity-0 
                         group-hover:opacity-100 transition-opacity"
            >
              Click to flip
            </motion.p>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-card 
                       text-card-foreground border rounded-xl shadow-md 
                       p-10 text-center 
                       [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <h3 className="text-xl leading-relaxed font-medium">
              {currentCard.back}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="flex items-center gap-6 mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </motion.div>

        <span className="font-medium min-w-12 text-center">
          {index + 1} / {cards.length}
        </span>

        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
