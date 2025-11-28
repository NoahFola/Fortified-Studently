"use client";
import { Button } from "@/components/ui/button";
import { MessageCircle, MessageSquare } from "lucide-react";
import { useChatbotStore } from "@/store/chatbotStore";
import { usePathname } from "next/navigation"; // Hook to get current path
import StudyBot from "./StudyBot";
import { cn } from "@/lib/utils";
import RecordingIndicator from "./RecordingIndicator";

// Define paths where the bot should be hidden (e.g., test/quiz pages)
const HIDDEN_BOT_PATHS = [
  "/study/sets/quiz",
  "/study/sets/blanks",
  "/study/sets/written",
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggleBot } = useChatbotStore();
  const pathname = usePathname();

  // Logic to hide the bot based on the path
  const isBotAllowed = !HIDDEN_BOT_PATHS.some((path) =>
    pathname.includes(path)
  );

  return (
    <>
      <main className={cn("flex min-h-screen", isOpen ? "pr-96" : "pr-0")}>
        {/* Your main content area */}
        <RecordingIndicator />
        <div className="flex-1">{children}</div>

        {/* Floating Button to open the bot */}
        {isBotAllowed && !isOpen && (
          <Button
            onClick={toggleBot}
            size="icon"
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}
      </main>

      {/* The Chatbot Component (passes the current path as context key) */}
      {isBotAllowed && <StudyBot />}
    </>
  );
}
