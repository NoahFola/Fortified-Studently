"use client";

import { useEffect, useState } from "react";
import { usePlannerStore, PlannerEvent } from "@/store/plannerStore";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CalendarClock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MissedEventAlert() {
    const { checkMissedEvents, moveEventToToday } = usePlannerStore();
    const [missedEvents, setMissedEvents] = useState<PlannerEvent[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check for missed events on mount
        const missed = checkMissedEvents();
        if (missed.length > 0) {
            setMissedEvents(missed);
            setIsVisible(true);
        }
    }, [checkMissedEvents]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    const handleReschedule = () => {
        missedEvents.forEach((e) => moveEventToToday(e.id));
        setIsVisible(false);
    };

    if (!isVisible || missedEvents.length === 0) return null;

    const count = missedEvents.length;
    const title = count === 1 ? "Missed Session" : "Missed Sessions";
    const message =
        count === 1
            ? `You missed "${missedEvents[0].title}". Shall I move it to today?`
            : `You missed ${count} study sessions. Shall I move them to today?`;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-50 w-[350px]"
                >
                    <Card className="border-l-4 border-l-amber-500 shadow-xl">
                        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                            <div className="flex items-center gap-2">
                                <CalendarClock className="h-5 w-5 text-amber-500" />
                                <CardTitle className="text-base">{title}</CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mt-1 -mr-2"
                                onClick={handleDismiss}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <CardDescription className="text-foreground/90">
                                {message}
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={handleDismiss}>
                                Ignore
                            </Button>
                            <Button size="sm" onClick={handleReschedule}>
                                Yes, Reschedule
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
