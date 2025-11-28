import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
// import Glow from "../Glow"; // Cleaned up import

// Assuming StudySetWithMeta is defined elsewhere
interface StudySetWithMeta {
  id: string;
  topic: string;
  emoji?: string;
  createdAt: number;
  notes?: { summary: string };
  flashcards?: any[];
  quiz?: any[];
}

interface RecentStudySetsProps {
  recentSets: StudySetWithMeta[];
  removeStudySet: (id: string) => void;
}

export default function RecentStudySets({
  recentSets,
  removeStudySet,
}: RecentStudySetsProps) {
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this study set?")) {
      removeStudySet(id);
    }
  };

  // --- Framer Motion Variants ---
  const container = {
    // We remove the 'hidden' state here and let Framer Motion automatically
    // use 'hidden' for 'initial' on first render.
    // We only define 'show'.
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 1, y: 0 }, // Increased y for a more noticeable slide-up
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5, // Slightly longer duration for smoothness
        ease: "easeOut",
      },
    },
    // Add an exit state for when a card is deleted
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="w-[90%] md:w-[80%] space-y-8">
      {/* Header - Already works fine */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Your Knowledge Base
          </h2>
          <p className="mt-1 text-muted-foreground">
            Resume where you left off
          </p>
        </div>
      </motion.div>

      {/* Conditional Rendering of Content */}
      {recentSets.length === 0 ? (
        // Empty State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-64 border-2 border-dashed border-border 
          rounded-xl flex flex-col items-center justify-center 
          text-muted-foreground bg-muted/40"
        >
          <BookOpen className="w-10 h-10 mb-3 opacity-30" />
          <p>No study sets generated yet.</p>
        </motion.div>
      ) : (
        // Grid with stagger:
        // Set 'initial' to the 'hidden' key of the container implicitly.
        // Set 'animate' to the 'show' key.
        // This makes the animation run from 'hidden' to 'show' on mount.
        <motion.div
          variants={container}
          initial="hidden" // <<< Explicitly setting initial state
          animate="show" // <<< Explicitly setting animate state
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {recentSets.map((set) => (
            // The item motion div must be wrapped in AnimatePresence
            // if we want to animate its exit (e.g., on deletion).
            // For simple entry, the container stagger is enough.
            <motion.div variants={item} key={set.id} className="relative">
              <Card
                className="group relative cursor-pointer border-border 
                hover:border-ring transition-all overflow-hidden 
                hover:shadow-xl rounded-xl flex flex-col z-8"
                onClick={() => router.push(`/study/sets/${set.id}`)}
              >
                {/* Floating Delete Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }} // Animation on hover for the button wrapper
                  transition={{ duration: 0.25 }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDelete(e, set.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
                {/* Card Content ... (CardHeader, CardDescription, CardFooter) ... */}
                <CardHeader className="pb-3 flex-1">
                  <div className="flex justify-between items-start pr-8">
                    <CardTitle className="text-xl font-semibold flex items-center gap-3 text-foreground">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="text-3xl shrink-0"
                      >
                        {set.emoji || "📚"}
                      </motion.span>
                      <span className="truncate leading-tight">
                        {set.topic}
                      </span>
                    </CardTitle>
                  </div>
                  <CardDescription className="line-clamp-3 text-sm mt-3 pl-[60px] text-muted-foreground">
                    {set.notes?.summary || "No summary available."}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pl-[84px] pb-6 pt-0 mt-auto">
                  <div className="flex flex-wrap items-center gap-2 w-full">
                    {/* Chips */}
                    <Badge>{set.flashcards?.length || 0} Cards</Badge>
                    <Badge>{set.quiz?.length || 0} Quizzes</Badge>
                    {/* Date */}
                    {set.createdAt && (
                      <span className="text-xs text-muted-foreground flex items-center ml-auto">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(set.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
