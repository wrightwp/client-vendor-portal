import Link from "next/link";
import { Users, Building, ShieldAlert, Link as LinkIcon, AlertTriangle, TrendingUp } from "lucide-react";

interface DashboardKpisProps {
  totalCensus: number;
  singleCensus: number;
  emp1Census: number;
  familyCensus: number;
  activeGroupCount: number;
  pendingGroupCount: number;
  totalGroupCount: number;
  totalVendors: number;
  totalAssociations: number;
  totalAttachmentPoint: number;
  laserCount: number;
  coverageGapCount: number;
}

export default function DashboardKpis({
  totalCensus,
  singleCensus,
  emp1Census,
  familyCensus,
  activeGroupCount,
  pendingGroupCount,
  totalGroupCount,
  totalVendors,
  totalAssociations,
  totalAttachmentPoint,
  laserCount,
  coverageGapCount,
}: DashboardKpisProps) {
  const avgVendorsPerGroup = totalGroupCount > 0 ? (totalAssociations / totalGroupCount).toFixed(1) : "0";
  const attentionCount = pendingGroupCount + laserCount + coverageGapCount;

  const formattedAttachmentPoint =
    totalAttachmentPoint >= 1_000_000
      ? `$${(totalAttachmentPoint / 1_000_000).toFixed(1)}M`
      : `$${(totalAttachmentPoint / 1_000).toFixed(0)}K`;

  const avgAttachmentPoint =
    totalGroupCount > 0 && totalAttachmentPoint > 0
      ? `$${(totalAttachmentPoint / totalGroupCount / 1_000_000).toFixed(2)}M`
      : "$0";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.25rem",
      }}
    >
      {/* 1. Total Covered Lives / Census */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          borderTop: "4px solid var(--accent-pink)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
            Total Covered Lives (Census)
          </span>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--accent-pink-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={19} style={{ color: "var(--accent-pink)" }} />
          </div>
        </div>
        <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#f472b6", lineHeight: 1.1 }}>
          {totalCensus.toLocaleString()}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
          <span className="badge badge-pink" style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem" }}>
            Single: {singleCensus}
          </span>
          <span className="badge badge-pink" style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem" }}>
            EE+1: {emp1Census}
          </span>
          <span className="badge badge-pink" style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem" }}>
            Family: {familyCensus}
          </span>
        </div>
      </div>

      {/* 2. Managed Employer Groups */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          borderTop: "4px solid var(--accent-blue)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
            Managed Groups
          </span>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--accent-blue-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building size={19} style={{ color: "var(--accent-blue)" }} />
          </div>
        </div>
        <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#38bdf8", lineHeight: 1.1 }}>
          {totalGroupCount}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
          <span style={{ color: "var(--status-active)", fontWeight: "700" }}>{activeGroupCount} Active</span>
          {pendingGroupCount > 0 && (
            <span>
              {" "}• <span style={{ color: "var(--accent-yellow)", fontWeight: "700" }}>{pendingGroupCount} Pending Onboarding</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Stop-Loss Portfolio Exposure */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          borderTop: "4px solid var(--accent-yellow)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
            Stop-Loss Protection
          </span>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--accent-yellow-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldAlert size={19} style={{ color: "var(--accent-yellow)" }} />
          </div>
        </div>
        <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#ffc20e", lineHeight: 1.1 }}>
          {formattedAttachmentPoint}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
          Min attachment volume • Avg {avgAttachmentPoint} / group
        </div>
      </div>

      {/* 4. Active Vendor Network */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          borderTop: "4px solid #10b981",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
            Vendor Partnerships
          </span>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LinkIcon size={19} style={{ color: "#10b981" }} />
          </div>
        </div>
        <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#34d399", lineHeight: 1.1 }}>
          {totalAssociations}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
          {avgVendorsPerGroup} avg / group across {totalVendors} vendor partners
        </div>
      </div>

      {/* 5. Operational Risk / Attention Needed */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          borderTop: `4px solid ${attentionCount > 0 ? "var(--accent-yellow)" : "var(--border)"}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
            Attention Required
          </span>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: attentionCount > 0 ? "var(--accent-yellow-light)" : "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={19} style={{ color: attentionCount > 0 ? "var(--accent-yellow)" : "var(--text-muted)" }} />
          </div>
        </div>
        <div
          style={{
            fontSize: "2.25rem",
            fontWeight: "800",
            color: attentionCount > 0 ? "#ffc20e" : "var(--text-muted)",
            lineHeight: 1.1,
          }}
        >
          {attentionCount}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
          {pendingGroupCount} pending • {laserCount} lasered plans
        </div>
      </div>
    </div>
  );
}
