"use client";

import { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlannerStore, PlannerEvent } from "@/store/plannerStore";
import { EventModal } from "./EventModal";
import { cn } from "@/lib/utils";

export function CalendarGrid() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
    const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | undefined>(
        undefined
    );

    const { events } = usePlannerStore();

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const handleDayClick = (date: Date) => {
        setSelectedDate(format(date, "yyyy-MM-dd"));
        setSelectedEvent(undefined);
        setIsModalOpen(true);
    };

    const handleEventClick = (e: React.MouseEvent, event: PlannerEvent) => {
        e.stopPropagation();
        setSelectedEvent(event);
        setSelectedDate(undefined);
        setIsModalOpen(true);
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="flex flex-col h-full bg-background rounded-lg border shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-2xl font-bold text-foreground">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b bg-muted/40">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="p-3 text-center text-sm font-medium text-muted-foreground"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {days.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const dayEvents = events.filter((e) => e.date === dateKey);
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => handleDayClick(day)}
                            className={cn(
                                "min-h-[120px] p-2 border-b border-r transition-colors hover:bg-muted/30 cursor-pointer flex flex-col gap-1",
                                !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                isToday(day) && "bg-primary/5"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <span
                                    className={cn(
                                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                                        isToday(day)
                                            ? "bg-primary text-primary-foreground"
                                            : "text-foreground"
                                    )}
                                >
                                    {format(day, "d")}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="flex flex-col gap-1 mt-1">
                                {dayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={(e) => handleEventClick(e, event)}
                                        className={cn(
                                            "text-xs px-2 py-1 rounded truncate font-medium text-white shadow-sm transition-all hover:opacity-90",
                                            event.color || "bg-gray-500"
                                        )}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                existingEvent={selectedEvent}
            />
        </div>
    );
}
