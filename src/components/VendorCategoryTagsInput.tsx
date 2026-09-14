"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Plus, Check, Search, Tag } from "lucide-react";
import { parseVendorCategories, serializeVendorCategories, PRESET_CATEGORIES } from "@/lib/vendorCategories";

interface VendorCategoryTagsInputProps {
  /** The raw comma-separated vendorType string */
  value: string;
  /** Called with the new serialized string whenever tags change */
  onChange: (serialized: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
}

export default function VendorCategoryTagsInput({
  value,
  onChange,
  placeholder = "Type to search or add categories…",
}: VendorCategoryTagsInputProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [allCategories, setAllCategories] = useState<string[]>([...PRESET_CATEGORIES]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync tags from external value prop
  useEffect(() => {
    setTags(parseVendorCategories(value));
  }, [value]);

  // Fetch all known categories from the API
  useEffect(() => {
    fetch("/api/vendors/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories)) {
          setAllCategories(data.categories);
        }
      })
      .catch(() => {
        // Fallback to presets on error
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const emitChange = useCallback(
    (newTags: string[]) => {
      setTags(newTags);
      onChange(serializeVendorCategories(newTags));
    },
    [onChange]
  );

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      // Prevent duplicates (case-insensitive)
      if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
      emitChange([...tags, trimmed]);
      setInputValue("");
      setHighlightIndex(0);
    },
    [tags, emitChange]
  );

  const removeTag = useCallback(
    (index: number) => {
      const newTags = tags.filter((_, i) => i !== index);
      emitChange(newTags);
    },
    [tags, emitChange]
  );

  // Filter suggestions based on query
  const query = inputValue.trim().toLowerCase();
  const filteredSuggestions = allCategories.filter((cat) => {
    // Exclude already-selected
    if (tags.some((t) => t.toLowerCase() === cat.toLowerCase())) return false;
    // If no query, show all available
    if (!query) return true;
    return cat.toLowerCase().includes(query);
  });

  // Check if the typed text is an exact match for an existing category
  const exactMatch = allCategories.some((c) => c.toLowerCase() === query);

  // Show "create new" option only when query exists and isn't an exact match
  const showCreateOption = query.length > 0 && !exactMatch && !tags.some((t) => t.toLowerCase() === query);

  // Total selectable items in dropdown
  const totalItems = filteredSuggestions.length + (showCreateOption ? 1 : 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % Math.max(totalItems, 1));
      if (!isOpen) setIsOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + Math.max(totalItems, 1)) % Math.max(totalItems, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (totalItems > 0 && isOpen) {
        if (highlightIndex < filteredSuggestions.length) {
          addTag(filteredSuggestions[highlightIndex]);
        } else if (showCreateOption) {
          // Create new tag — use the raw input with first letter capitalized
          const newTag = inputValue.trim().charAt(0).toUpperCase() + inputValue.trim().slice(1);
          addTag(newTag);
        }
      } else if (inputValue.trim()) {
        const newTag = inputValue.trim().charAt(0).toUpperCase() + inputValue.trim().slice(1);
        addTag(newTag);
      }
    } else if (e.key === "Backspace" && !inputValue) {
      // Remove last tag
      if (tags.length > 0) {
        removeTag(tags.length - 1);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        const newTag = inputValue.trim().charAt(0).toUpperCase() + inputValue.trim().slice(1);
        addTag(newTag);
      }
    }
  };

  // Highlight matching text in suggestions
  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong style={{ color: "var(--accent-blue)", fontWeight: 700 }}>{text.slice(idx, idx + q.length)}</strong>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Tag chips + input area */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.4rem 0.6rem",
          minHeight: "40px",
          borderRadius: "var(--radius-sm, 8px)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: isOpen ? "var(--accent-blue)" : "var(--border)",
          background: "var(--bg-input)",
          cursor: "text",
          transition: "border-color 0.2s ease",
        }}
      >
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.2rem 0.55rem",
              borderRadius: "14px",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: "var(--accent-blue-light)",
              color: "var(--accent-blue)",
              border: "1px solid var(--accent-blue-light)",
              whiteSpace: "nowrap",
              lineHeight: 1.4,
            }}
          >
            <Tag size={11} style={{ opacity: 0.8, flexShrink: 0 }} />
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(idx);
              }}
              style={{
                background: "none",
                border: "none",
                padding: "1px",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                borderRadius: "50%",
                transition: "color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#ef4444";
                (e.target as HTMLElement).style.background = "rgba(239, 68, 68, 0.12)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "var(--text-muted)";
                (e.target as HTMLElement).style.background = "none";
              }}
              title={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setHighlightIndex(0);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Add more…"}
          style={{
            flex: 1,
            minWidth: "120px",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: "0.85rem",
            padding: "0.2rem 0",
          }}
        />
      </div>

      {/* Autocomplete dropdown */}
      {isOpen && totalItems > 0 && (
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm, 8px)",
            boxShadow: "var(--shadow-lg)",
            maxHeight: "220px",
            overflowY: "auto",
            zIndex: 999,
            padding: "0.25rem",
          }}
        >
          {/* Quick header */}
          {!query && (
            <div
              style={{
                padding: "0.3rem 0.6rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Search size={10} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} />
              Available Categories
            </div>
          )}

          {filteredSuggestions.map((cat, idx) => (
            <button
              key={cat}
              type="button"
              onClick={() => addTag(cat)}
              onMouseEnter={() => setHighlightIndex(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.5rem 0.65rem",
                border: "none",
                borderRadius: "6px",
                background: highlightIndex === idx ? "var(--bg-card-hover)" : "transparent",
                color: "var(--text-primary)",
                fontSize: "0.84rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s ease",
              }}
            >
              <Check
                size={14}
                style={{
                  color: "var(--accent-blue)",
                  opacity: 0.7,
                  flexShrink: 0,
                }}
              />
              <span>{highlightMatch(cat, query)}</span>
            </button>
          ))}

          {showCreateOption && (
            <button
              type="button"
              onClick={() => {
                const newTag = inputValue.trim().charAt(0).toUpperCase() + inputValue.trim().slice(1);
                addTag(newTag);
              }}
              onMouseEnter={() => setHighlightIndex(filteredSuggestions.length)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.5rem 0.65rem",
                border: "none",
                borderRadius: "6px",
                background:
                  highlightIndex === filteredSuggestions.length
                    ? "var(--bg-card-hover)"
                    : "transparent",
                color: "var(--text-primary)",
                fontSize: "0.84rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s ease",
                borderTop: filteredSuggestions.length > 0 ? "1px solid var(--border)" : "none",
                marginTop: filteredSuggestions.length > 0 ? "0.2rem" : 0,
                paddingTop: filteredSuggestions.length > 0 ? "0.55rem" : "0.5rem",
              }}
            >
              <Plus
                size={14}
                style={{
                  color: "#10b981",
                  flexShrink: 0,
                }}
              />
              <span>
                Create new category: <strong>&ldquo;{inputValue.trim()}&rdquo;</strong>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
