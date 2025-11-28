"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useTopicStore } from "@/store/topicStore";
import { chat } from "@/lib/chat";


import "react-quill-new/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("./QuillEditor"), { ssr: false });
// components/courses/NoteEditor.tsx (Likely Definitions)

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }], // <-- Controls defined here
    ["link", "image"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list", // <-- Quill registers both 'ordered' and 'bullet' under the 'list' format
  "bullet", // <-- THIS IS THE PROBLEM
  "link",
  "image",
];
export default function NoteEditor({ courseId }: { courseId: string }) {
  const { notes, topics, addNote } = useTopicStore();
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const topic = topics.find((t) => t.id === n.topicId);
      return topic?.courseId === courseId;
    });
  }, [notes, courseId, topics]);
  const filteredTopics = useMemo(
    () => topics.filter((t) => t.courseId === courseId),
    [topics, courseId]
  );
  const [topicId, setTopicId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    if (filteredTopics.length > 0 && !topicId) setTopicId(topics[0].id);
  }, [filteredTopics, topics, topicId]);

  const onSave = () => {
    if (!topicId || !content.trim() || !title.trim()) return;
    addNote(topicId, courseId, { title, content, source: "user" });
    setTitle("");
    setContent("");
  };

  const onSummarize = async () => {
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      const res = await chat<{ title: string; noteContent: string }>(
        `Summarize the following note into 4 bullets: ${content}`
      );
      const newNote = {
        title: res.title as string,
        content: res.noteContent as string,
        source: "ai" as const,
      };
      addNote(topicId!, courseId, newNote);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <select
          value={topicId ?? ""}
          onChange={(e) => setTopicId(e.target.value)}
          className="input"
        >
          <option value="">Select topic</option>
          {filteredTopics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <Button
          onClick={() => {
            setTitle("");
            setContent("");
          }}
          variant="outline"
        >
          New
        </Button>
      </div>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="input w-full"
        />
      </div>

      <div>
        {/* <ReactQuill theme="snow" value={content} onChange={setContent} /> */}
        <QuillEditor
          value={content}
          onChange={setContent}
          modules={modules} // Pass modules
          formats={formats} // Pass formats
          theme="snow"
          placeholder="Write something amazing..."
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSave}>Save note</Button>
        <Button variant="outline" onClick={onSummarize} disabled={isLoading}>
          {isLoading ? "..." : "Summarize"}
        </Button>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Saved notes</h4>
        <div className="space-y-2">
          {filteredNotes.length === 0 ? (
            <div className="text-sm text-muted-foreground">No notes</div>
          ) : (
            filteredNotes.map((n) => (
              <div
                key={n.id}
                className="rounded-md p-3 bg-[var(--color-popover)]"
              >
                <div dangerouslySetInnerHTML={{ __html: n.content }} />
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
