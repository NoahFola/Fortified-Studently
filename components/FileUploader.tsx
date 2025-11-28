import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, X, UploadCloud, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
// Assuming formatSize utility is available
// import formatSize from "@/utils/formatSize";

// Mock formatSize function for runnable file generation
const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  maxSizeMB?: number;
}

const FileUploader = ({
  onFileSelect,
  selectedFile,
  maxSizeMB = 20,
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      // If files are rejected due to size/type, still call onFileSelect(null)
      // and let the parent handle displaying the error.
      if (fileRejections.length > 0) {
        // Handle rejection case (optional: display specific error message)
        onFileSelect(null);
        return;
      }
      const file = acceptedFiles[0] || null;
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    // Accept PDF, common image types, and common document types
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "text/plain": [".txt"],
    },
    maxSize: maxSizeMB * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-full rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
        "bg-muted/30 text-muted-foreground",
        isDragActive
          ? "border-primary/70 bg-primary/10"
          : "border-input hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {selectedFile ? (
          // --- File Selected View ---
          <div
            className="w-full flex items-center justify-between p-4 bg-background border rounded-lg shadow-sm"
            onClick={(e) => e.stopPropagation()} // Prevent dropping over the selected file info
          >
            <div className="flex items-center space-x-4">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <p className="truncate text-foreground font-medium max-w-xs text-sm">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation to prevent dropzone activation
                onFileSelect(null);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // --- Dropzone/Prompt View ---
          <div className="text-center space-y-2">
            <UploadCloud className="mx-auto w-10 h-10 text-primary/70" />
            <p className="text-lg font-semibold text-foreground">
              <span className="text-primary hover:underline">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              PDF, Image, or Text file (max {maxSizeMB}MB)
            </p>
            {isDragActive && (
              <p className="text-sm font-medium text-primary-foreground bg-primary/90 p-1 rounded">
                Drop the file here!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default FileUploader;
