"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePlannerStore, EventType, PlannerEvent } from "@/store/plannerStore";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: string;
    existingEvent?: PlannerEvent;
}

export function EventModal({
    isOpen,
    onClose,
    selectedDate,
    existingEvent,
}: EventModalProps) {
    const { addEvent, updateEvent, deleteEvent } = usePlannerStore();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<EventType>("study");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (existingEvent) {
                setTitle(existingEvent.title);
                setDate(existingEvent.date);
                setType(existingEvent.type);
                setDescription(existingEvent.description || "");
            } else {
                setTitle("");
                setDate(selectedDate || new Date().toISOString().split("T")[0]);
                setType("study");
                setDescription("");
            }
        }
    }, [isOpen, selectedDate, existingEvent]);

    const handleSave = () => {
        if (!title || !date) return;

        if (existingEvent) {
            updateEvent(existingEvent.id, {
                title,
                date,
                type,
                description,
            });
        } else {
            addEvent({
                title,
                date,
                type,
                description,
            });
        }
        onClose();
    };

    const handleDelete = () => {
        if (existingEvent) {
            deleteEvent(existingEvent.id);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {existingEvent ? "Edit Event" : "Add New Event"}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Math Exam"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="date" className="text-sm font-medium">
                            Date
                        </label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="type" className="text-sm font-medium">
                            Type
                        </label>
                        <Select
                            value={type}
                            onValueChange={(val) => setType(val as EventType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="study">Study (Blue)</SelectItem>
                                <SelectItem value="deadline">Deadline (Red)</SelectItem>
                                <SelectItem value="personal">Personal (Green)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Additional details..."
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    {existingEvent && (
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
