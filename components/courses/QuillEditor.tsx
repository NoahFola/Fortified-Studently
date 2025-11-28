// components/courses/QuillEditor.tsx

"use client";
import React, { useEffect, useState, forwardRef, useRef } from "react";
import dynamic from "next/dynamic";
// Change the import path for styles
import "react-quill-new/dist/quill.snow.css";

// Define the component type using the new package name
// NOTE: I'm also correcting your previous type definition to be safe.
// 'react-quill-new' exports the component as the default export.
type ReactQuillType = typeof import("react-quill-new").default;

// Dynamically import ReactQuill using the new package name
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
}) as ReactQuillType;

// Define QuillEditorProps interface (no change needed here)
// components/courses/QuillEditor.tsx
// ... (imports and type definitions above)

// Define QuillEditorProps interface
interface QuillEditorProps {
  /** The current HTML content of the editor. */
  value: string;

  /** Function called when the editor content changes. It receives the new HTML content. */
  onChange: (value: string) => void;

  /** The visual theme for the editor (e.g., 'snow', 'bubble'). Defaults to 'snow' in NoteEditor. */
  theme?: "snow" | "bubble" | string;

  /** Configuration for the toolbar and other editor features. */
  modules?: Record<string, any>;

  /** The list of formats (bold, italic, header, etc.) to allow in the editor. */
  formats?: string[];

  /** Placeholder text displayed when the editor is empty. */
  placeholder?: string;

  /** Additional optional props that ReactQuill accepts (e.g., readOnly, bounds). */
  // Using React.ComponentPropsWithoutRef to allow any standard props ReactQuill accepts
  // while omitting the 'ref' prop which is handled by forwardRef.

  [key: string]: any;
}

// ... (rest of the QuillEditor component)
const QuillEditor = forwardRef<ReactQuillType, QuillEditorProps>(
  (props, ref) => {
    // ... (Logic remains unchanged)
    const [mounted, setMounted] = useState(false);
    const quillRef = useRef<ReactQuillType>(null); // Ensuring client-side render (avoiding SSR issues)

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    } // Conditionally use the passed ref or the internal ref

    return <ReactQuill {...props} ref={ref || quillRef} />;
  }
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
