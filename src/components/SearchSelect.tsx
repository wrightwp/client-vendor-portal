"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Check, Building2, Store } from "lucide-react";

interface SearchSelectProps {
  items: any[];
  selectedId: string;
  onSelect: (item: any | null) => void;
  placeholder?: string;
  type: "vendor" | "client";
}

export default function SearchSelect({
  items,
  selectedId,
  onSelect,
  placeholder = "Search to select...",
  type,
}: SearchSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((i) => i.id === selectedId);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const nameMatch = item.name?.toLowerCase().includes(q);
    const taxMatch = item.taxId?.toLowerCase().includes(q);
    const typeMatch = (item.vendorType || item.specialty)?.toLowerCase().includes(q);
    const cityMatch = item.city?.toLowerCase().includes(q);
    return nameMatch || taxMatch || typeMatch || cityMatch;
  });

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {selectedItem ? (
        <div
          className="glass-card"
          style={{
            padding: "0.6rem 0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderColor: type === "vendor" ? "var(--accent-blue)" : "var(--accent-pink)",
            background: type === "vendor" ? "var(--accent-blue-light)" : "var(--accent-pink-light)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {type === "vendor" ? (
              <Store size={18} style={{ color: "var(--accent-blue)" }} />
            ) : (
              <Building2 size={18} style={{ color: "var(--accent-pink)" }} />
            )}
            <div>
              <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>{selectedItem.name}</div>
              <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                Tax ID: <span className="text-mono">{selectedItem.taxId}</span>
                {(selectedItem.vendorType || selectedItem.specialty) && ` • ${selectedItem.vendorType || selectedItem.specialty}`}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.2rem",
            }}
            title="Clear Selection"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "0.875rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder={placeholder}
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
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
                zIndex: 60,
                maxHeight: "240px",
                overflowY: "auto",
                boxShadow: "var(--shadow-lg)",
                background: "var(--bg-card)",
              }}
            >
              {filteredItems.length === 0 ? (
                <div style={{ padding: "0.875rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  No matching {type === "vendor" ? "vendors" : "clients"} found.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    style={{
                      padding: "0.65rem 0.875rem",
                      cursor: "pointer",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "0.875rem" }}>{item.name}</div>
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                        Tax ID: <span className="text-mono">{item.taxId}</span>
                        {(item.vendorType || item.specialty) && ` • ${item.vendorType || item.specialty}`}
                        {item.city && ` • ${item.city}, ${item.state}`}
                      </div>
                    </div>
                    <span className={`badge ${type === "vendor" ? "badge-blue" : "badge-pink"}`}>
                      Select
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
