// src/components/semesters/SemesterCard.tsx
"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import SemesterKPIs from "./SemesterKPIs";
import GPAGauge from "../GPAGauge";
import { Progress } from "../ui/progress";
import Glow from "../Glow";

export default function SemesterCard({ semester }: { semester: Semester }) {
  const gpa = semester.gpa ?? 0;
  return (
    <Card className="p-4 hover:shadow-lg transition !gap-1 relative z-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{semester.name}</h3>
        </div>
        <div className="ml-auto">
          <GPAGauge gpa={gpa} />
        </div>
      </div>

      <div className="flex gap-2 items-center ">
        <Progress value={semester.progress} />
        <span>{semester.progress ?? 0}%</span>
      </div>
      <SemesterKPIs semester={semester} />
      <p className="text-xs text-muted-foreground ml-auto">
        {semester.startDate
          ? new Date(semester.startDate).toLocaleDateString()
          : ""}
      </p>
    </Card>
  );
}
