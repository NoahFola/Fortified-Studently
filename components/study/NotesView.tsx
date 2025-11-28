"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const NotesView = ({ data }: { data: any }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // KaTeX auto-rendering logic (commented out, kept for reference)
  useEffect(() => {
    if (
      contentRef.current &&
      typeof window !== "undefined" &&
      typeof renderMathInElement !== "undefined"
    ) {
      renderMathInElement(contentRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }
  }, [data.notes.content]);

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="max-w-5xl mx-auto pb-20"
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <Card className="shadow-md overflow-hidden min-h-[80vh]">
          {/* Top gradient accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary to-accent w-full" />

          <CardContent className="p-8 sm:p-12 md:p-16 flex flex-col space-y-12">
            {/* Header */}
            <motion.div
              variants={item}
              className="space-y-6 border-b pb-10 mb-10"
            >
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary" /> Study Guide
                </span>
                <span>•</span>{" "}
                <span className="text-muted-foreground">
                  {data.topic || "General"}
                </span>
              </div>
              <motion.h1
                variants={item}
                className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]"
              >
                {data.notes.title}
              </motion.h1>
              <motion.p
                variants={item}
                className="text-xl leading-relaxed font-light max-w-3xl"
              >
                {data.notes.summary}
              </motion.p>
              <motion.div
                variants={item}
                className="flex items-center gap-4 pt-2"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold bg-card text-card-foreground"
                    >
                      {String.fromCharCode(64 + i)}
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  + 124 students studying this
                </span>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.article
              ref={contentRef}
              variants={item}
              className="prose max-w-none
                prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:flex prose-h2:items-center prose-h2:gap-3
                prose-h3:text-xl prose-h3:mt-8
                prose-p:leading-loose prose-p:mb-6
                prose-strong:font-bold prose-strong:px-1 prose-strong:rounded
                prose-ul:my-6 prose-ul:list-none prose-ul:pl-0
                prose-li:pl-6 prose-li:relative prose-li:mb-3 prose-li:before:content-['•'] prose-li:before:absolute prose-li:before:left-1 prose-li:before:font-bold
                prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:my-10"
              dangerouslySetInnerHTML={{ __html: data.notes.content }}
            />

            {/* Footer */}
            <motion.div
              variants={item}
              className="mt-20 pt-10 border-t flex items-center justify-between text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Estimated reading
                time: 15 mins
              </div>
              <div></div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotesView;
