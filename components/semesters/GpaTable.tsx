// src/components/semesters/GpaTable.tsx
"use client";
import React, { FormEvent, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCourseStore } from "@/store/courseStore";
import { Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import formatText from "@/utils/formatText";
import { useSemesterStore } from "@/store/semesterStore";

export default function GpaTable({ semesterId }: { semesterId: string }) {
  const { getCoursesForSemester, updateCourse } = useCourseStore();
  const { semesters } = useSemesterStore();
  const [isLoading, setIsLoading] = useState(false);
  const courses = useMemo(
    () => getCoursesForSemester(semesterId),
    [semesterId, getCoursesForSemester, semesters]
  );
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState<Course>({
    id: "", // Fallback valid values
    semesterId: "",
    name: "",
    code: "",
    units: 0,
    topics: [],
    notes: [],
    progress: 0,
    grade: "-",
    // other fields as per your Course interface
  });

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      updateCourse(updatedCourse.id, updatedCourse);
    } catch (err) {
      console.error("Error updating course");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };
  return (
    <>
      <div className="overflow-x-auto rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length < 0
              ? "No courses yet. Add a new course or upload an outline to auto-create courses"
              : courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.code ?? c.name}</TableCell>
                    <TableCell>{c.units ?? "-"}</TableCell>
                    <TableCell>{c.grade ?? "-"}</TableCell>
                    <TableCell>
                      <Dialog open={!!isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger onClick={() => setUpdatedCourse(c)}>
                          <Edit2 size={20} className="cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Course</DialogTitle>
                          </DialogHeader>

                          <form
                            className="space-y-2 text-black"
                            onSubmit={handleUpdate}
                          >
                            <Input
                              type="text"
                              name="code"
                              placeholder="Course Code"
                              value={updatedCourse?.code || ""}
                              onChange={(e) =>
                                setUpdatedCourse((prev) => ({
                                  ...prev,
                                  [e.target.name]: e.target.value.toUpperCase(),
                                }))
                              }
                            />

                            <Input
                              type="text"
                              name="name"
                              placeholder="Course Name"
                              value={updatedCourse.name || ""}
                              onChange={(e) =>
                                setUpdatedCourse((prev) => ({
                                  ...prev,
                                  [e.target.name]: e.target.value,
                                }))
                              }
                            />

                            <Select
                              value={updatedCourse.grade ?? "-"}
                              onValueChange={(value) =>
                                setUpdatedCourse((prev) => ({
                                  ...prev,
                                  grade: value as Course["grade"],
                                }))
                              }
                            >
                              <SelectTrigger className="w-full p-3 rounded-xl bg-white border-2 border-[#2463eb6b]">
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                              <SelectContent>
                                {["A", "B", "C", "D", "E", "F"].map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Input
                              type="number"
                              name="units"
                              placeholder="Units"
                              value={updatedCourse.units || ""}
                              onChange={(e) =>
                                setUpdatedCourse((prev) => ({
                                  ...prev,
                                  [e.target.name]: Number(e.target.value),
                                }))
                              }
                            />

                            <Button
                              type="submit"
                              className="primary-button text-white ml-auto w-fit"
                            >
                              Save
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
