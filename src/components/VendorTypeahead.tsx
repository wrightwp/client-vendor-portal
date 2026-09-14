"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Store, Tag, ChevronDown } from "lucide-react";
import { parseVendorCategories } from "@/lib/vendorCategories";

interface VendorTypeaheadProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowedCategories?: string[];
  allVendors?: any[];
  style?: React.CSSProperties;
  className?: string;
}

/**
  Check if a vendor matches the allowed categories (e.g. "Stoploss", "Stoploss MGU").
 */
function vendorMatchesCategories(vendor: any, allowedCategories: string[]): boolean {
  if (!vendor) return false;
  const vendorCats = parseVendorCategories(vendor.vendorType);
  const rawType = (vendor.vendorType || "").toLowerCase().replace(/[\s\-_]/g, "");

  // Convert allowed categories to normalized keys
  const targetKeys = allowedCategories.map((c) => c.toLowerCase().replace(/[\s\-_]/g, ""));

  // Check parsed category tags
  const tagMatch = vendorCats.some((cat) => {
    const key = cat.toLowerCase().replace(/[\s\-_]/g, "");
    return targetKeys.some((t) => key.includes(t) || t.includes(key));
  });

  if (tagMatch) return true;

  // Fallback check on raw vendorType
  return targetKeys.some((t) => rawType.includes(t));
}

export default function VendorTypeahead({
  value,
  onChange,
  placeholder = "Search vendor...",
  allowedCategories = ["Stoploss", "Stoploss MGU"],
  allVendors: propVendors,
  style,
  className,
}: VendorTypeaheadProps) {
  const [vendors, setVendors] = useState<any[]>(propVendors || []);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync propVendors when updated
  useEffect(() => {
    if (propVendors && propVendors.length > 0) {
      setVendors(propVendors);
    }
  }, [propVendors]);

  // Fetch vendors if not provided in props
  useEffect(() => {
    if (!propVendors || propVendors.length === 0) {
      let isMounted = true;
      setIsLoading(true);
      fetch("/api/vendors")
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.success && Array.isArray(data.vendors)) {
            setVendors(data.vendors);
          }
        })
        .catch((err) => console.error("Error fetching vendors for typeahead:", err))
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [propVendors]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter vendors strictly to allowed categories first
  const categoryFilteredVendors = vendors.filter((v) =>
    vendorMatchesCategories(v, allowedCategories)
  );

  // Filter by query string
  const query = (value || "").trim().toLowerCase();
  const matchingVendors = categoryFilteredVendors.filter((v) => {
    if (!query) return true;
    const nameMatch = (v.name || "").toLowerCase().includes(query);
    const catMatch = parseVendorCategories(v.vendorType).some((c) =>
      c.toLowerCase().includes(query)
    );
    return nameMatch || catMatch;
  });

  const handleSelectVendor = (vendorName: string) => {
    onChange(vendorName);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          className={className || "form-input"}
          style={{
            width: "100%",
            paddingRight: "2rem",
            ...style,
          }}
          value={value || ""}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
        />
        <ChevronDown
          size={14}
          style={{
            position: "absolute",
            right: "0.6rem",
            pointerEvents: "none",
            color: "var(--text-muted)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
          }}
        />
      </div>

      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-lg)",
            maxHeight: "220px",
            overflowY: "auto",
            padding: "0.35rem",
          }}
        >
          {isLoading ? (
            <div
              style={{
                padding: "0.6rem 0.8rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              Loading vendors...
            </div>
          ) : matchingVendors.length === 0 ? (
            <div
              style={{
                padding: "0.6rem 0.8rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              {categoryFilteredVendors.length === 0 ? (
                <>No vendors tagged as <strong>{allowedCategories.join(" or ")}</strong></>
              ) : (
                <>No matching <strong>{allowedCategories.join(" / ")}</strong> vendors found</>
              )}
            </div>
          ) : (
            matchingVendors.map((vendor) => {
              const categories = parseVendorCategories(vendor.vendorType);
              const isSelected = (vendor.name || "").toLowerCase() === (value || "").trim().toLowerCase();

              return (
                <div
                  key={vendor.id}
                  onClick={() => handleSelectVendor(vendor.name)}
                  style={{
                    padding: "0.5rem 0.65rem",
                    borderRadius: "0.35rem",
                    cursor: "pointer",
                    background: isSelected ? "var(--accent-blue-light)" : "transparent",
                    transition: "background 0.12s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "var(--bg-card-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
                    <Store size={14} style={{ color: "var(--accent-blue)", flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {vendor.name}
                    </span>
                  </div>

                  {categories.length > 0 && (
                    <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                      {categories.map((cat) => (
                        <span
                          key={cat}
                          style={{
                            fontSize: "0.68rem",
                            padding: "0.1rem 0.35rem",
                            borderRadius: "0.25rem",
                            background: "var(--accent-blue-light)",
                            color: "var(--accent-blue)",
                            border: "1px solid var(--accent-blue-light)",
                            fontWeight: "600",
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
