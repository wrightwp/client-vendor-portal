"use client";

import React, { ChangeEvent, KeyboardEvent } from "react";
import { formatDateInput, normalizeDate } from "@/lib/dateUtils";

interface DateInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
}

export function DateInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "MM/DD/YYYY",
  className = "form-control",
  style,
  disabled = false,
  required = false,
  autoFocus = false,
  "aria-label": ariaLabel,
}: DateInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatDateInput(rawVal);
    onChange(formatted);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If pressing Backspace right after a slash, delete the character before the slash as well
    if (e.key === "Backspace") {
      const input = e.currentTarget;
      const { selectionStart, selectionEnd } = input;
      if (
        selectionStart !== null &&
        selectionStart === selectionEnd &&
        (selectionStart === 3 || selectionStart === 6)
      ) {
        // We are right after a slash ('MM/' or 'MM/DD/')
        const current = input.value;
        if (current[selectionStart - 1] === "/") {
          e.preventDefault();
          const nextVal = current.slice(0, selectionStart - 2) + current.slice(selectionStart);
          const formatted = formatDateInput(nextVal);
          onChange(formatted);
        }
      }
    }
  };

  const handleBlur = () => {
    if (value && value.trim()) {
      const normalized = normalizeDate(value);
      if (normalized !== value) {
        onChange(normalized);
      }
    }
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      style={style}
      disabled={disabled}
      required={required}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
      maxLength={10}
      autoComplete="off"
    />
  );
}

export default DateInput;
