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

// Components & Hooks
import FileUploader from "@/components/FileUploader";
import { useStudySetFileGeneration } from "@/hooks/useStudySetFileGeneration";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { loading, statusText, error, generateFromFile } =
    useStudySetFileGeneration();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleContinue = async () => {
    if (!selectedFile) return;

    // Clear local error state before starting
    // The hook manages its own internal error state

    await generateFromFile(selectedFile);

    // Modal will close automatically on successful redirect by the hook
  };

  // If generation is successful, the hook redirects and the modal naturally closes.
  const handleClose = () => {
    if (!loading) {
      setSelectedFile(null); // Reset file selection on close
      onClose();
    }
  };

  const isFileReady = !!selectedFile && !loading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Material</DialogTitle>
          <DialogDescription>
            Upload a file (PDF, Image, or Text) to generate a full study set.
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
          <Button onClick={handleContinue} disabled={!isFileReady}>
            {loading ? "Processing..." : "Generate Study Set"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
