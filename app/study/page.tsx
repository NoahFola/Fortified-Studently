"use client";

import { useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";

// Store & Utils
import { useStudyStore } from "@/store/studyStore";

// Modular Components
import StudyActionCards from "@/components/study/StudyActionCards";
import RecentStudySets from "@/components/study/RecentStudySets";
import PasteModal from "@/components/study/PasteTextModal";
import UploadModal from "@/components/study/UploadModal";
import RecordModal from "@/components/study/RecordModal";

type ModalType = "upload" | "paste" | "record";

export default function StudyLanding() {
  const { studysets, removeStudySet } = useStudyStore();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  // Prepare data for RecentStudySets component
  const recentSets = Object.values(studysets || {}).sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) as any[]; // Cast to any[] since full type is complex

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* --- HERO / CREATE SECTION --- */}
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center space-y-4 mb-16 max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Hello, what do you wanna study?
          </h1>
          <p className="text-lg md:text-xl">
            Upload anything and get interactive notes, flashcards, quizzes, and
            more.
          </p>
        </div>

        {/* ACTION CARDS (Modular Component) */}
        <StudyActionCards setActiveModal={setActiveModal} />

        <div className="mt-16 animate-bounce ">
          <ArrowRight className="w-6 h-6 rotate-90" />
        </div>
      </div>

      {/* --- RECENT STUDY SETS SECTION (Modular Component) --- */}
      <div className="w-full border-t py-24 px-6 flex flex-col items-center min-h-screen -mt-[7px] relative">
        <RecentStudySets
          recentSets={recentSets}
          removeStudySet={removeStudySet}
        />
      </div>

      {/* --- MODALS (Modular Components) --- */}
      <UploadModal
        open={activeModal === "upload"}
        onClose={() => setActiveModal(null)}
      />
      <PasteModal
        open={activeModal === "paste"}
        onClose={() => setActiveModal(null)}
      />
      <RecordModal
        open={activeModal === "record"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
