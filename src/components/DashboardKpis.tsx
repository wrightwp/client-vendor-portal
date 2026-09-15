import Link from "next/link";
import { Users, Building, Link as LinkIcon, Clock } from "lucide-react";

interface DashboardKpisProps {
  totalCensus: number;
  singleCensus: number;
  emp1Census: number;
  familyCensus: number;
  activeGroupCount: number;
  pendingTermCount: number;
  totalGroupCount: number;
  totalVendors: number;
  totalAssociations: number;
}

export default function DashboardKpis({
  totalCensus,
  singleCensus,
  emp1Census,
  familyCensus,
  activeGroupCount,
  pendingTermCount,
  totalGroupCount,
  totalVendors,
  totalAssociations,
}: DashboardKpisProps) {
  const avgVendorsPerGroup = totalGroupCount > 0 ? (totalAssociations / totalGroupCount).toFixed(1) : "0";

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

      {/* 2. Active Employer Groups */}
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
            Active Groups
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
            <Building size={19} style={{ color: "#10b981" }} />
          </div>
        </div>
        <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#10b981", lineHeight: 1.1 }}>
          {activeGroupCount}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
          <Link
            href="/groups?status=ACTIVE"
            style={{ color: "var(--text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            <span>Active employer client groups</span>
            <span style={{ color: "#10b981", fontWeight: "600" }}>&rarr;</span>
          </Link>
        </div>
      </div>

      {/* 3. Pending Term Groups (Future Term Date) */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          borderTop: `4px solid ${pendingTermCount > 0 ? "var(--accent-yellow)" : "var(--border)"}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
            Pending Term Groups
          </span>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: pendingTermCount > 0 ? "var(--accent-yellow-light)" : "rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={19} style={{ color: pendingTermCount > 0 ? "var(--accent-yellow)" : "var(--text-muted)" }} />
          </div>
        </div>
        <div
          style={{
            fontSize: "2.25rem",
            fontWeight: "800",
            color: pendingTermCount > 0 ? "#ffc20e" : "var(--text-muted)",
            lineHeight: 1.1,
          }}
        >
          {pendingTermCount}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
          {pendingTermCount > 0 ? (
            <Link
              href="/groups?status=PENDING_TERM"
              style={{ color: "var(--accent-yellow)", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span>{pendingTermCount} group{pendingTermCount !== 1 ? "s" : ""} with future term date</span>
              <span>&rarr;</span>
            </Link>
          ) : (
            <span>No groups with future term date</span>
          )}
        </div>
      </div>

      {/* 4. Active Vendor Network */}
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
            Vendor Partnerships
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
            <LinkIcon size={19} style={{ color: "var(--accent-blue)" }} />
          </div>
        </div>
        <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#38bdf8", lineHeight: 1.1 }}>
          {totalAssociations}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
          <Link
            href="/vendors"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
          >
            {avgVendorsPerGroup} avg / group across {totalVendors} vendor partners &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
