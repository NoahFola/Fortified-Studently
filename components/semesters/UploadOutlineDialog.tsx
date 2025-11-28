"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FileUploader from "@/components/FileUploader"; // Assuming this path
import { useOutlineGeneration } from "@/hooks/useOutlineGeneration"; // Assuming this path

interface UploadOutlineDialogProps {
  open: boolean;
  onClose: () => void;
  semesterId: string;
}

export default function UploadOutlineDialog({
  open,
  onClose,
  semesterId,
}: UploadOutlineDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { loading, statusText, error, generateOutline } =
    useOutlineGeneration();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    const success = await generateOutline(selectedFile, semesterId);

    // Close Dialog and reset state only on successful generation/processing
    if (success) {
      setSelectedFile(null);
      onClose();
    }
  };

  // Allow closing only when not actively loading
  const handleClose = () => {
    if (!loading) {
      setSelectedFile(null);
      onClose();
    }
  };

  const isFileReady = !!selectedFile && !loading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Course Outline</DialogTitle>
          <DialogDescription>
            Upload a PDF or image file of your course syllabus to automatically
            extract and create courses and topics for this semester.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <FileUploader
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            maxSizeMB={20}
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
        </div>

        <DialogFooter>
          <Button onClick={handleClose} variant="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={!isFileReady}>
            {loading ? "Analyzing..." : "Analyze and Add Courses"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
