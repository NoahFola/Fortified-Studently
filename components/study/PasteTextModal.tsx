import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useStudySetTextGeneration } from "@/hooks/useStudySetTextGeneration";
import { Loader2 } from "lucide-react";

interface PasteModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PasteModal({ open, onClose }: PasteModalProps) {
  const [pasteText, setPasteText] = useState("");
  const { loading, generateAndRedirect, statusText, error } =
    useStudySetTextGeneration();

  const handleGenerate = async () => {
    await generateAndRedirect(pasteText);
    setPasteText(""); // Clear text on success or failure
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Paste Material</DialogTitle>
          <DialogDescription>
            Paste text or notes to generate a study set.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          className="h-[300px] font-mono text-sm scrollbar overflow-y-auto"
          placeholder="Paste your content here..."
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          disabled={loading}
        />
        {(loading || error) && (
          <div className="text-sm p-3 rounded-lg bg-muted border border-border">
            {loading ? (
              <div className="flex items-center text-primary">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>{statusText || "Processing file..."}</span>
              </div>
            ) : (
              <p className="text-destructive font-medium">Error: {error}</p>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            disabled={loading || !pasteText.trim()}
            onClick={handleGenerate}
          >
            {loading ? "Thinking..." : "Generate Study Set"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
