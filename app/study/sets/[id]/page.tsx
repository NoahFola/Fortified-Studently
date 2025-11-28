"use client";

import { useState, useEffect, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStudyStore } from "@/store/studyStore";
import {
  BookOpen,
  CheckSquare,
  Copy,
  PenTool,
  GraduationCap,
  ChevronLeft,
  MoreHorizontal,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import FlashcardsView from "@/components/study/FlashcardsView";
import QuizView from "@/components/study/QuizView";
import BlanksView from "@/components/study/BlanksView";
import NotesView from "@/components/study/NotesView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TutorView from "@/components/study/TutorView";
import WrittenTestView from "@/components/study/WrittenTestView";
import ResourcesView from "@/components/study/ResourcesView";
import { AnimatePresence } from "framer-motion";

type ViewMode =
  | "notes"
  | "flashcards"
  | "quiz"
  | "blanks"
  | "written"
  | "tutor"
  | "resources";

// Maps the ViewMode to the component
const tabToComponentMap = (setData: RawStudySet) => ({
  notes: <NotesView data={setData} />,
  flashcards: <FlashcardsView cards={setData.flashcards} />,
  quiz: <QuizView questions={setData.quiz} />,
  blanks: <BlanksView questions={setData.fillInBlanks} />,
  written: <WrittenTestView questions={setData.writtenQuestions} />,
  tutor: <TutorView />,
  resources: <ResourcesView resources={setData.resources} />,
});

export default function StudySetPage() {
  const { id } = useParams();
  const { studysets } = useStudyStore();
  const router = useRouter(); // Initialize activeTab with 'notes'

  const [activeTab, setActiveTab] = useState<ViewMode>("notes");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const setData = studysets[id as string];

  if (!isClient) return null;

  if (!setData) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen  ">
        <p>Study set not found.</p>{" "}
        <Button variant="link" onClick={() => router.push("/study")}>
          Go to Study Hub{" "}
        </Button>{" "}
      </div>
    );
  }

  const studyTools = [
    { id: "notes", label: "Notes", icon: BookOpen },
    { id: "flashcards", label: "Flashcards", icon: Copy },
    { id: "quiz", label: "Multiple Choice", icon: CheckSquare },
    { id: "blanks", label: "Fill in the Blanks", icon: PenTool },
    { id: "written", label: "Written Test", icon: Edit2 },
    { id: "resources", label: "Resources", icon: ExternalLink },
    { id: "tutor", label: "Tutor", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen ">
      {" "}
      <header className="h-16 border-b  flex items-center justify-between px-6 /80 backdrop-blur sticky top-0 z-20 shadow-sm">
        {" "}
        <div className="flex items-center gap-4">
          {" "}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/study")}
            className=" hover: hover: transition"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Hub{" "}
          </Button>
          <div className="h-6 w-px " />{" "}
          <div className="flex flex-col">
            {" "}
            <h2 className="!text-base font-bold flex items-center gap-2">
              {setData.emoji} {setData.topic}{" "}
            </h2>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex items-center gap-2">
          {" "}
          <Button variant="outline" size="sm" className="h-9 text-sm   hover:">
            Share{" "}
          </Button>{" "}
          <Button variant="ghost" size="icon" className="h-9 w-9  hover:">
            <MoreHorizontal className="w-5 h-5" />{" "}
          </Button>{" "}
        </div>{" "}
      </header>
      {/* --- Tabs Container and List --- */}{" "}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ViewMode)}
        className="w-full"
      >
        {/* Sticky Tabs List for easy navigation */}
        <div className="sticky top-16 z-10 border-b   shadow-sm">
          <TabsList className="flex gap-2 justify-center h-full mx-auto max-w-7xl px-4 py-2 bg-transparent">
            {studyTools.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className={cn(
                  "group flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                  activeTab === item.id
                    ? "" // Active style
                    : "text-foreground  hover:bg-background" // Inactive style
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {/* --- Tabs Content (Rendered outside the loop and contained) --- */}
        <div className="flex justify-center w-full min-h-[calc(100vh-140px)] p-4 md:p-8">
          <div className="w-full">
            {" "}
            {/* This limits the content width */}
            <AnimatePresence mode="wait">
              {studyTools.map((item) => (
                <TabsContent key={item.id} value={item.id} className="mt-0">
                  {tabToComponentMap(setData)[item.id as ViewMode]}
                </TabsContent>
              ))}
            </AnimatePresence>
          </div>
        </div>{" "}
      </Tabs>{" "}
    </div>
  );
}
