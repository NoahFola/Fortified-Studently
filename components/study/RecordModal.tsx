"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useStudyStore } from "@/store/studyStore"; // Import store

interface RecordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RecordModal({ open, onClose }: RecordModalProps) {
  const { startRecording } = useStudyStore();

  // Action when the user clicks 'Start Recording'
  const handleStartRecording = () => {
    onClose(); // Close the modal
    startRecording(); // Set global state to true to show the indicator
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {" "}
      <DialogContent>
        {" "}
        <DialogHeader>
          <DialogTitle>Start Lecture Recording</DialogTitle>{" "}
          <DialogDescription>
            This will simulate recording a lecture. Once stopped, it will
            generate a study set from the transcript.{" "}
          </DialogDescription>{" "}
        </DialogHeader>{" "}
        <div className="p-8 border-2 border-dashed rounded-md flex items-center justify-center text-muted-foreground">
          <Mic className="w-8 h-8 opacity-20" />{" "}
        </div>{" "}
        <DialogFooter>
          {" "}
          <Button onClick={onClose} variant="secondary">
            Cancel{" "}
          </Button>{" "}
          <Button onClick={handleStartRecording} variant="default">
            Start Recording
          </Button>{" "}
        </DialogFooter>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
}
