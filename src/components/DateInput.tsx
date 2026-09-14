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
  placeholder = "",
  className = "form-control",
  style,
  disabled = false,
  required = false,
  autoFocus = false,
  "aria-label": ariaLabel,
}: DateInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Pass raw input while typing without modifying in real-time
    onChange(e.target.value);
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
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      style={style}
      disabled={disabled}
      required={required}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
      autoComplete="off"
    />
  );
}

export default DateInput;
