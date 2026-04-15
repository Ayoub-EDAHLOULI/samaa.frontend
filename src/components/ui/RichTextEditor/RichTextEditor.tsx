"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.scss";

// Dynamically import Quill to prevent SSR "document is not defined" errors
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="quill-loading-skeleton animate-pulse" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = "",
}: RichTextEditorProps) {
  // Customizing the toolbar for B2B/Technical Needs
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [3, 4, false] }], // Headers for sections (e.g., "Technical Specifications")
        ["bold", "italic", "underline"], // Basic formatting
        [{ list: "ordered" }, { list: "bullet" }], // Crucial for technical specs
        ["link"], // For linking to external datasheets if needed
        ["clean"], // Remove formatting button
      ],
    }),
    [],
  );

  const formats = ["header", "bold", "italic", "underline", "list", "link"];

  return (
    <div className={`ae-rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Enter description..."}
      />
    </div>
  );
}
