// src/components/PlannerPreview.tsx
"use client";
import React, { useMemo } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function PlannerPreview() {
  const events = usePlannerStore((s) => s.events);
  const addEvent = usePlannerStore((s) => s.addEvent);

  // Map your store events to the format react-big-calendar expects
  const calendarEvents = useMemo(() => {
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      start: new Date(e.date),
      end: new Date(e.date), // you can customize end time if your events have durations
      allDay: false,
      resource: e.type,
    }));
  }, [events]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold">Planner Preview</h3>
        <Button
          size="sm"
          onClick={() => addEvent("Quick Study", new Date().toISOString())}
        >
          Add
        </Button>
      </div>

      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        popup
      />
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-full max-w-4xl pointer-events-none opacity-20 z-0 hidden md:block"
        viewBox="0 0 100 800"
        preserveAspectRatio="none"
      >
        <path
          d="M 50 0 C 50 200, 50 200, 80 300 C 110 400, 10 500, 50 600 C 90 700, 50 800, 50 800"
          stroke="white"
          stroke-width="2"
          fill="none"
          stroke-dasharray="10 10"
        ></path>
      </svg>
    </div>
  );
}
