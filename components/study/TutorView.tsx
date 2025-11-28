import { GraduationCap } from "lucide-react";
import React from "react";

const TutorView = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <GraduationCap className="w-8 h-8 text-slate-300" />
      </div>
      <p className="text-sm font-medium text-slate-500">
        AI Tutor interaction coming soon.
      </p>
    </div>
  );
};

export default TutorView;
