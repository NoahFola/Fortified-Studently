"use client";

import React, { useState, useEffect, useRef } from "react";
// Updated Lucide Icons for a modern feel
import {
  SendHorizontal,
  BookOpenText,
  X,
  Loader2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatbotStore, ChatMessage } from "@/store/chatbotStore";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyBotContext } from "@/hooks/useStudyBotContext";
import { chat } from "@/lib/chat";

// --- Framer Motion Variants ---
// Individual item (chat bubble) animation
const itemVariants = {
  // Use a slight bounce/spring effect for smooth entry
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  // Keep the exit property for potential future use (though not needed for new messages)
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Custom Chat Message component - Now uses motion.div and itemVariants
const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isBot = message.role === "bot";
  return (
    // Apply the item variant to the bubble itself
    <motion.div
      layout // Enables smooth position transitions when new items are added
      initial="initial"
      animate="animate"
      exit="exit"
      variants={itemVariants}
      className={cn(
        "flex max-w-[85%]",
        isBot ? "justify-start" : "justify-end ml-auto"
      )}
    >
      <div
        className={cn(
          "rounded-2xl p-3 text-sm shadow-lg",
          isBot
            ? "bg-secondary text-secondary-foreground rounded-tl-sm flex items-start space-x-2 border border-secondary/50"
            : "bg-primary text-primary-foreground rounded-br-sm"
        )}
      >
        {/* {isBot && (
          <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-foreground/90" />
        )} */}
        <div
          dangerouslySetInnerHTML={{
            __html:
              typeof message.text === "string"
                ? message.text.replace(/\n/g, "<br/>")
                : "",
          }}
        />
      </div>
    </motion.div>
  );
};

// NEW: Dedicated Chat History component to manage message entry
const ChatHistory = React.forwardRef<
  HTMLDivElement,
  { messages: ChatMessage[] }
>(({ messages }, ref) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {/* AnimatePresence is key here: it watches for children being added/removed */}
    <AnimatePresence initial={false}>
      {messages.map((msg) => (
        // The key must be stable (msg.id) for AnimatePresence to track it
        <ChatBubble key={msg.id} message={msg} />
      ))}
    </AnimatePresence>
    {/* Scroll anchor */}
    <div ref={ref} />
  </div>
));
ChatHistory.displayName = "ChatHistory";

// --- CHATBOT MAIN COMPONENT ---
export default function StudyBot() {
  const {
    isOpen,
    messages,
    isThinking,
    toggleBot,
    setThinking,
    addMessage,
    clearHistory,
  } = useChatbotStore();

  const pathname = usePathname();
  const {
    title: contextTitle,
    contextText,
    type: contextType,
  } = useStudyBotContext(pathname);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    // Shorter timeout is sufficient as we are only animating the new message
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage = input.trim();
    setInput("");

    // --- USER MESSAGE ENTRY ---
    // Add user message first. It will animate in immediately due to AnimatePresence.
    addMessage({ role: "user", text: userMessage });
    setThinking(true);
    const jsonFomat = { message: "This is the requested helpful response..." };
    try {
      const systemPrompt = `You are a helpful and context-aware Study Bot and Tutor and strict JSON API. Your goal is to guide the user based on the material provided below. Keep your responses concise, educational, and encouraging. If the user asks a question unrelated to the context, politely prompt them to focus on the study material. Max output character length: 2000. Output valid JSON only
            
            CURRENT STUDY CONTEXT:
            ---
            ${contextText}
            ---`;

      const chatHistory = messages.map((msg) => ({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.text,
      }));

      // NOTE: We need to pass the state *before* the new user message was added,
      // but since we added the user message a few lines above, we must adjust
      // the structure or ensure the history passed to 'chat' is correct.
      // Assuming 'messages' in the state is up-to-date, we proceed:
      const apiMessages = [
        { role: "system", content: systemPrompt },
        // Use the store's messages, which now include the new user message
        ...messages.map((msg) => ({
          role: msg.role === "bot" ? "assistant" : "user",
          content: msg.text,
        })),
        { role: "user", content: userMessage }, // Ensure the latest message is included if the store updates asynchronously
      ];

      // A more robust way: use the pre-send history + the new user message text
      const historyForAPI = [
        ...messages.map((msg) => ({
          role: msg.role === "bot" ? "assistant" : "user",
          content: msg.text,
        })),
        { role: "user", content: userMessage },
      ];
      const aiResponse = await chat(
        JSON.stringify([
          { role: "system", content: systemPrompt },
          ...historyForAPI,
        ])
      );

      const botText =
        aiResponse.response ||
        "I encountered an error trying to process your request. Please try again.";
      const suggestionsList = aiResponse.suggestions || [];
      setSuggestions(suggestionsList); // Store the suggestions

      // --- BOT MESSAGE ENTRY ---
      // Add bot message. It will animate in as a new item.
      addMessage({ role: "bot", text: botText });
    } catch (error) {
      console.error("AI Chat Error:", error);
      addMessage({
        role: "bot",
        text: "Sorry, I had trouble connecting to the AI tutor. Please check your network or try again.",
      });
    } finally {
      setThinking(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 350, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 350, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed right-0 top-0 h-screen w-full max-w-sm bg-background border-l border-border z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/70 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <BookOpenText className="w-6 h-6 text-primary" />
              <h2 className="!text-lg font-bold text-foreground tracking-wide">
                Junie
              </h2>
              {isThinking && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4 text-primary ml-2" />
                </motion.div>
              )}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearHistory}
                aria-label="Clear Chat History"
                className="hover:bg-accent/20 transition-colors"
              >
                <RefreshCcw className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBot}
                aria-label="Close Chatbot"
                className="hover:bg-destructive/20 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
              </Button>
            </div>
          </div>

          {/* Context Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="p-3 bg-muted/50 text-xs text-muted-foreground border-b border-border/50 flex items-center space-x-2 truncate font-medium"
          >
            <BookOpenText className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
            <span className="font-semibold text-primary capitalize">
              {contextType}:
            </span>
            <span className="truncate" title={contextTitle}>
              {contextTitle}
            </span>
          </motion.div>

          {/* Chat History Area - USE DEDICATED COMPONENT */}
          <ChatHistory messages={messages} ref={messagesEndRef} />
          {suggestions.length > 0 && (
            <div className="mt-4 space-x-2 flex overflow-x-auto scrollbar">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setInput(suggestion); // Set the suggestion as the input
                    handleSend(); // Automatically send the suggestion
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-end space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Ask about ${contextTitle} (or anything else!)...`}
                rows={1}
                className="flex-1 min-h-10 resize-none focus-visible:ring-primary/50 transition-shadow duration-300"
                disabled={isThinking}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                size="icon"
                className="h-10 w-10 flex-shrink-0 transition-all duration-200"
              >
                {isThinking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SendHorizontal className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Hit <span className="underline">Enter</span> to send
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
