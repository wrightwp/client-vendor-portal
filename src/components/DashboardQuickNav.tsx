"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Building, Store, ArrowRight, ShieldAlert, Clock, Filter, X } from "lucide-react";

interface QuickNavGroup {
  id: string;
  name: string;
  npiNumber: string | null;
  specialty: string | null;
  status: string;
}

interface QuickNavVendor {
  id: string;
  name: string;
  vendorType: string;
  status: string;
}

interface DashboardQuickNavProps {
  groups: QuickNavGroup[];
  vendors: QuickNavVendor[];
  hasPendingTerm?: boolean;
  pendingTermCount?: number;
  hasLaseredPlans?: boolean;
}

export default function DashboardQuickNav({
  groups,
  vendors,
  hasPendingTerm = false,
  pendingTermCount = 0,
  hasLaseredPlans = false,
}: DashboardQuickNavProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "groups" | "vendors">("all");

  const normalizedQuery = query.toLowerCase().trim();

  const filteredGroups = normalizedQuery
    ? groups.filter(
        (g) =>
          g.name.toLowerCase().includes(normalizedQuery) ||
          (g.npiNumber && g.npiNumber.toLowerCase().includes(normalizedQuery)) ||
          (g.specialty && g.specialty.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const filteredVendors = normalizedQuery
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(normalizedQuery) ||
          v.vendorType.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const showDropdown = normalizedQuery.length > 0;
  const totalResults =
    (activeTab !== "vendors" ? filteredGroups.length : 0) +
    (activeTab !== "groups" ? filteredVendors.length : 0);

  return (
    <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", position: "relative" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Search Input Box */}
        <div style={{ position: "relative", flex: "1 1 340px", minWidth: "260px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quick search by Group name, Group # / NPI, or Vendor..."
            style={{
              width: "100%",
              padding: "0.75rem 2.5rem 0.75rem 2.75rem",
              background: "var(--bg-input)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Action Navigation Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600" }}>
            Quick Links:
          </span>
          <Link
            href="/groups?status=ACTIVE"
            className="btn btn-outline btn-sm"
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
          >
            <Building size={14} style={{ color: "var(--accent-pink)" }} />
            <span>Active Groups ({groups.filter((g) => g.status === "ACTIVE").length})</span>
          </Link>
          {(hasPendingTerm || pendingTermCount > 0) && (
            <Link
              href="/groups?status=PENDING_TERM"
              className="btn btn-outline btn-sm"
              style={{
                fontSize: "0.8rem",
                padding: "0.4rem 0.8rem",
                borderColor: "var(--accent-yellow)",
                color: "var(--accent-yellow)",
              }}
            >
              <Clock size={14} />
              <span>Pending Term ({pendingTermCount})</span>
            </Link>
          )}
          <Link
            href="/vendors"
            className="btn btn-outline btn-sm"
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
          >
            <Store size={14} style={{ color: "var(--accent-blue)" }} />
            <span>Vendors Directory ({vendors.length})</span>
          </Link>
        </div>
      </div>

      {/* Live Search Results Dropdown Overlay */}
      {showDropdown && (
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 40,
            padding: "1rem",
            maxHeight: "360px",
            overflowY: "auto",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)" }}>
              Found {totalResults} result{totalResults !== 1 ? "s" : ""}
            </span>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button
                onClick={() => setActiveTab("all")}
                style={{
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "all" ? "var(--accent-pink)" : "rgba(255,255,255,0.06)",
                  color: "#fff",
                }}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("groups")}
                style={{
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "groups" ? "var(--accent-pink)" : "rgba(255,255,255,0.06)",
                  color: "#fff",
                }}
              >
                Groups ({filteredGroups.length})
              </button>
              <button
                onClick={() => setActiveTab("vendors")}
                style={{
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "vendors" ? "var(--accent-blue)" : "rgba(255,255,255,0.06)",
                  color: "#fff",
                }}
              >
                Vendors ({filteredVendors.length})
              </button>
            </div>
          </div>

          {totalResults === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
              No matching groups or vendors found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {activeTab !== "vendors" &&
                filteredGroups.map((g) => (
                  <Link
                    key={g.id}
                    href={`/groups/${g.id}`}
                    onClick={() => setQuery("")}
                    className="glass-card"
                    style={{
                      padding: "0.6rem 0.85rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <Building size={16} style={{ color: "var(--accent-pink)" }} />
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                          {g.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {g.npiNumber ? `NPI: ${g.npiNumber} • ` : ""}
                          {g.specialty || "Healthcare Group"}
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-pink" style={{ fontSize: "0.7rem" }}>
                      Group
                    </span>
                  </Link>
                ))}

              {activeTab !== "groups" &&
                filteredVendors.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vendors/${v.id}`}
                    onClick={() => setQuery("")}
                    className="glass-card"
                    style={{
                      padding: "0.6rem 0.85rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <Store size={16} style={{ color: "var(--accent-blue)" }} />
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                          {v.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Type: {v.vendorType}
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-blue" style={{ fontSize: "0.7rem" }}>
                      Vendor
                    </span>
                  </Link>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
