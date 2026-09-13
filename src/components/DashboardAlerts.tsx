import Link from "next/link";
import { AlertTriangle, Clock, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";

interface PendingGroup {
  id: string;
  name: string;
  npiNumber: string | null;
  specialty: string | null;
  city: string | null;
  state: string | null;
}

interface LaseredGroup {
  id: string;
  name: string;
  npiNumber: string | null;
  laser: string;
  deductible: string | null;
}

interface CoverageGapGroup {
  id: string;
  name: string;
  npiNumber: string | null;
  vendorCount: number;
}

interface DashboardAlertsProps {
  pendingGroups: PendingGroup[];
  laseredGroups: LaseredGroup[];
  coverageGapGroups: CoverageGapGroup[];
}

export default function DashboardAlerts({
  pendingGroups,
  laseredGroups,
  coverageGapGroups,
}: DashboardAlertsProps) {
  const hasAlerts = pendingGroups.length > 0 || laseredGroups.length > 0 || coverageGapGroups.length > 0;
  const totalNotices = pendingGroups.length + laseredGroups.length + coverageGapGroups.length;

  if (!hasAlerts) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          borderLeft: "6px solid var(--status-active)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "var(--status-active-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={22} style={{ color: "var(--status-active)" }} />
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "1rem", color: "var(--text-primary)" }}>
            All Operations Normal
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
            All 28 groups are active, stop-loss contracts are standard with zero laser riders, and vendor coverage is fully established.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1.5rem 1.75rem",
        borderLeft: "6px solid var(--accent-yellow)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          paddingBottom: "0.85rem",
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--accent-yellow-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={18} style={{ color: "var(--accent-yellow)" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-primary)" }}>
                Operations &amp; Risk Alert Center
              </h2>
              <span className="badge badge-yellow" style={{ fontSize: "0.72rem" }}>
                Action Required
              </span>
            </div>
          </div>
        </div>
        <span
          className="badge"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
            fontSize: "0.75rem",
          }}
        >
          {totalNotices} Active Notice{totalNotices !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid of Alert Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {/* 1. Pending Onboarding Groups */}
        {pendingGroups.length > 0 && (
          <div
            className="glass-card"
            style={{
              padding: "1.25rem",
              borderTop: "3px solid var(--accent-yellow)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock size={16} style={{ color: "var(--accent-yellow)" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Pending Onboarding
                </span>
              </div>
              <span className="badge badge-yellow" style={{ fontSize: "0.7rem" }}>
                {pendingGroups.length} Group{pendingGroups.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {pendingGroups.map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                      {g.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      {g.specialty || "Practice"} • {g.city}, {g.state}
                    </div>
                  </div>
                  <Link
                    href={`/groups/${g.id}`}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: "0.3rem 0.65rem",
                      fontSize: "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    <span>Review</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Stop-Loss Laser Risk Watchlist */}
        {laseredGroups.length > 0 && (
          <div
            className="glass-card"
            style={{
              padding: "1.25rem",
              borderTop: "3px solid var(--accent-pink)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldAlert size={16} style={{ color: "var(--accent-pink)" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Stop-Loss Laser Watchlist
                </span>
              </div>
              <span className="badge badge-pink" style={{ fontSize: "0.7rem" }}>
                {laseredGroups.length} Plan{laseredGroups.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "220px", overflowY: "auto" }}>
              {laseredGroups.map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                      {g.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem", flexWrap: "wrap" }}>
                      <span className="badge badge-pink" style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem" }}>
                        Laser: {g.laser}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Ded: {g.deductible?.split(" ")[0] || "Standard"}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/groups/${g.id}`}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: "0.3rem 0.65rem",
                      fontSize: "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    <span>B&amp;E Plan</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Vendor Coverage Gaps */}
        {coverageGapGroups.length > 0 && (
          <div
            className="glass-card"
            style={{
              padding: "1.25rem",
              borderTop: "3px solid var(--accent-blue)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertTriangle size={16} style={{ color: "var(--accent-blue)" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Vendor Coverage Gaps
                </span>
              </div>
              <span className="badge badge-blue" style={{ fontSize: "0.7rem" }}>
                {coverageGapGroups.length} Group{coverageGapGroups.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {coverageGapGroups.map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                      {g.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      Only {g.vendorCount} assigned vendor{g.vendorCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <Link
                    href={`/groups/${g.id}`}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: "0.3rem 0.65rem",
                      fontSize: "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    <span>Assign</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
