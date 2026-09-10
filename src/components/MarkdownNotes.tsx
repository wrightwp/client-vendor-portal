"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  Heading,
  Highlighter,
  Code,
  Quote,
  Eraser,
  Eye,
  Edit3,
} from "lucide-react";

interface MarkdownNoteEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minRows?: number;
}

export function MarkdownNoteEditor({
  value,
  onChange,
  placeholder = "Enter markdown formatted client-specific vendor notes... (e.g. **Bold**, *Italic*, ### Header, - List, `Contract #9918`)",
  minRows = 5,
}: MarkdownNoteEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyMarkdown = (prefix: string, suffix: string = "", defaultText: string = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;

    const replacement = `${prefix}${selected}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const insertList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    let replacement = "";
    if (selected) {
      replacement = selected
        .split("\n")
        .map((line) => (line.startsWith("- ") ? line : `- ${line}`))
        .join("\n");
    } else {
      replacement = "- Item 1\n- Item 2\n- Item 3\n";
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
  };

  const clearFormatting = () => {
    const stripped = value
      .replace(/<[^>]*>/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/^###\s+/gm, "")
      .replace(/^- /gm, "")
      .replace(/^>\s+/gm, "");
    onChange(stripped);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {/* Markdown Toolbar & Mode Switcher Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.45rem 0.65rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md) var(--radius-md) 0 0",
          borderBottom: "none",
        }}
      >
        {/* Markdown Toolbar Controls */}
        {activeTab === "edit" ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => applyMarkdown("**", "**", "bold text")}
              className="toolbar-btn"
              title="Bold (**text**)"
              style={toolBtnStyle}
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => applyMarkdown("*", "*", "italic text")}
              className="toolbar-btn"
              title="Italic (*text*)"
              style={toolBtnStyle}
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => applyMarkdown("### ", "", "Header Title")}
              className="toolbar-btn"
              title="Heading (### Header)"
              style={toolBtnStyle}
            >
              <Heading size={14} />
            </button>
            <button
              type="button"
              onClick={insertList}
              className="toolbar-btn"
              title="Bullet List (- item)"
              style={toolBtnStyle}
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => applyMarkdown("`", "`", "Contract #9981")}
              className="toolbar-btn"
              title="Badge / Code (`code`)"
              style={toolBtnStyle}
            >
              <Code size={14} />
            </button>
            <button
              type="button"
              onClick={() => applyMarkdown("> ", "", "Note quote")}
              className="toolbar-btn"
              title="Quote (> Note)"
              style={toolBtnStyle}
            >
              <Quote size={14} />
            </button>
            <button
              type="button"
              onClick={() => applyMarkdown("<mark>", "</mark>", "highlighted tag")}
              className="toolbar-btn"
              title="Highlight (<mark>text</mark>)"
              style={toolBtnStyle}
            >
              <Highlighter size={14} />
            </button>
            <span style={{ width: "1px", height: "16px", background: "var(--border)", margin: "0 0.25rem" }} />
            <button
              type="button"
              onClick={clearFormatting}
              className="toolbar-btn"
              title="Clear Markdown Syntax"
              style={{ ...toolBtnStyle, color: "var(--text-muted)" }}
            >
              <Eraser size={14} />
            </button>
          </div>
        ) : (
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)" }}>
            Markdown Formatted Output Preview
          </span>
        )}

        {/* Tab Toggle */}
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: "600",
              background: activeTab === "edit" ? "var(--accent-blue-light)" : "transparent",
              color: activeTab === "edit" ? "var(--accent-blue)" : "var(--text-muted)",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Edit3 size={12} />
            <span>Markdown</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: "600",
              background: activeTab === "preview" ? "var(--accent-blue-light)" : "transparent",
              color: activeTab === "preview" ? "var(--accent-blue)" : "var(--text-muted)",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Eye size={12} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Box or Preview Box */}
      {activeTab === "edit" ? (
        <textarea
          ref={textareaRef}
          rows={minRows}
          className="form-textarea"
          style={{
            borderRadius: "0 0 var(--radius-md) var(--radius-md)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div
          style={{
            padding: "0.875rem 1rem",
            borderRadius: "0 0 var(--radius-md) var(--radius-md)",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            minHeight: "120px",
            fontSize: "0.9rem",
            lineHeight: "1.6",
            color: "var(--text-primary)",
            overflowY: "auto",
          }}
        >
          {value ? (
            <MarkdownNoteRenderer content={value} />
          ) : (
            <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              No markdown content entered to preview.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const toolBtnStyle: React.CSSProperties = {
  background: "var(--bg-card-hover)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  borderRadius: "4px",
  padding: "0.25rem 0.45rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

/**
 * Parses Markdown syntax (**bold**, *italic*, ### Heading, - list, `code`, > quote)
 * and renders formatted HTML cleanly.
 */
export function MarkdownNoteRenderer({ content }: { content: string }) {
  if (!content) return null;

  // Convert Markdown syntax into HTML
  let html = content
    // Convert headers (### Heading)
    .replace(/^###\s+(.*$)/gim, '<h3 class="markdown-h3 rich-h3">$1</h3>')
    .replace(/^##\s+(.*$)/gim, '<h3 class="markdown-h3 rich-h3">$1</h3>')
    .replace(/^#\s+(.*$)/gim, '<h3 class="markdown-h3 rich-h3">$1</h3>')
    // Convert bold (**text** or <b>)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>')
    // Convert italic (*text* or <i>)
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>')
    // Convert inline code / badges (`code` or <code>)
    .replace(/`(.*?)`/g, '<code class="markdown-code rich-code">$1</code>')
    .replace(/<code>(.*?)<\/code>/gi, '<code class="markdown-code rich-code">$1</code>')
    // Convert mark / highlight (<mark> or ==text==)
    .replace(/==(.*?)==/g, '<span class="markdown-highlight rich-highlight">$1</span>')
    .replace(/<mark>(.*?)<\/mark>/gi, '<span class="markdown-highlight rich-highlight">$1</span>')
    // Convert blockquotes (> quote)
    .replace(/^>\s+(.*$)/gim, '<blockquote class="markdown-quote rich-quote">$1</blockquote>')
    // Convert bullet lists (- item or • item)
    .replace(/^[\-•\*]\s+(.*$)/gim, '<div class="markdown-list-item rich-list-item"><span class="markdown-bullet rich-bullet">•</span> <span>$1</span></div>')
    // Remove newlines following block tags (div, h3, blockquote) so they don't produce extra <br/> gaps
    .replace(/(<\/div>|<\/h3>|<\/blockquote>)\n/gi, "$1")
    // Linebreaks for remaining inline lines
    .replace(/\n/g, "<br/>");

  return (
    <div
      className="markdown-note-container rich-note-container"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        lineHeight: "1.65",
        fontSize: "0.875rem",
        color: "var(--text-primary)",
      }}
    />
  );
}

// Backwards compatibility aliases
export const RichTextNoteEditor = MarkdownNoteEditor;
export const RichTextNoteRenderer = MarkdownNoteRenderer;
