// app/semesters/[id]/page.tsx
"use client";
import React, { FormEvent, useState } from "react";
import { useCourseStore } from "@/store/courseStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import formatText from "@/utils/formatText";
import { Plus } from "lucide-react";

const AddCourseDialog = ({ semesterId }: { semesterId: string }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addCourse } = useCourseStore();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get("course-name") as string;
    const code = formData.get("course-code") as string;
    const units = formData.get("course-units") as string;
    if (!name || !code || !units) return;

    const newCourse = {
      name: formatText(name, "capitalize"),
      code: formatText(code, "uppercase"),
      units: Number(units),
      grade: "-" as Course["grade"],
    };
    addCourse(semesterId, newCourse);
    form.reset();
    setIsAdding(false);
  }
  return (
    <Dialog open={!!isAdding} onOpenChange={setIsAdding}>
      <DialogTrigger onClick={() => setIsAdding(true)}>
        <Button>
          <Plus size={16} className="mr-2" /> Add Course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Course</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <label htmlFor="course-code" className="w-full">
            <input
              type="text"
              name="course-code"
              id="course-code"
              placeholder="Course Code"
              className="border rounded-md uppercase placeholder:capitalize"
            />
          </label>
          <label htmlFor="course-name" className="w-full">
            <input
              type="text"
              name="course-name"
              id="course-name"
              placeholder="Course Name"
              className=" border rounded-md uppercase  placeholder:capitalize"
            />
          </label>
          <label htmlFor="course-units" className="w-full">
            <input
              type="number"
              name="course-units"
              id="course-units"
              placeholder="Units"
              className=" border rounded-md "
            />
          </label>
          <Button type="submit" className="text-white w-fit ml-auto">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddCourseDialog;
