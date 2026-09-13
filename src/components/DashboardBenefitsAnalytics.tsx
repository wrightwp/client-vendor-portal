import { Shield, Pill, PieChart, TrendingUp, Layers } from "lucide-react";

interface CarrierCount {
  name: string;
  count: number;
  percentage: number;
}

interface PbmCount {
  name: string;
  count: number;
  percentage: number;
}

interface DashboardBenefitsAnalyticsProps {
  carrierCounts: CarrierCount[];
  pbmCounts: PbmCount[];
  pbmAsrContractCount: number;
  totalCensus: number;
  singleCensus: number;
  emp1Census: number;
  familyCensus: number;
  totalCurrentPlans: number;
}

export default function DashboardBenefitsAnalytics({
  carrierCounts,
  pbmCounts,
  pbmAsrContractCount,
  totalCensus,
  singleCensus,
  emp1Census,
  familyCensus,
  totalCurrentPlans,
}: DashboardBenefitsAnalyticsProps) {
  const singlePct = totalCensus > 0 ? ((singleCensus / totalCensus) * 100).toFixed(1) : "0";
  const emp1Pct = totalCensus > 0 ? ((emp1Census / totalCensus) * 100).toFixed(1) : "0";
  const famPct = totalCensus > 0 ? ((familyCensus / totalCensus) * 100).toFixed(1) : "0";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "1.5rem" }}>
      {/* 1. Stop-Loss Carrier Market Share */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={20} style={{ color: "var(--accent-pink)" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Stop-Loss Carrier Portfolio</h2>
          </div>
          <span className="badge badge-pink" style={{ fontSize: "0.75rem" }}>
            {totalCurrentPlans} Active Plans
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {carrierCounts.slice(0, 5).map((carrier, idx) => (
            <div key={carrier.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.825rem",
                  marginBottom: "0.3rem",
                }}
              >
                <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                  {carrier.name}
                </span>
                <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
                  {carrier.count} group{carrier.count !== 1 ? "s" : ""} ({carrier.percentage}%)
                </span>
              </div>
              {/* Progress bar */}
              <div
                style={{
                  height: "7px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "9999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.max(carrier.percentage, 8)}%`,
                    background:
                      idx === 0
                        ? "var(--accent-pink)"
                        : idx === 1
                        ? "#ec4899"
                        : idx === 2
                        ? "#f472b6"
                        : "#fb7185",
                    borderRadius: "9999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. PBM Distribution & Census Tier Breakdown */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Pill size={20} style={{ color: "var(--accent-blue)" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Pharmacy Benefit Manager (PBM)</h2>
          </div>
          <span className="badge badge-blue" style={{ fontSize: "0.75rem" }}>
            {pbmAsrContractCount} ASR Contracted
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
          {pbmCounts.slice(0, 4).map((pbm, idx) => (
            <div key={pbm.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.825rem",
                  marginBottom: "0.3rem",
                }}
              >
                <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{pbm.name}</span>
                <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
                  {pbm.count} group{pbm.count !== 1 ? "s" : ""} ({pbm.percentage}%)
                </span>
              </div>
              <div
                style={{
                  height: "7px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "9999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.max(pbm.percentage, 8)}%`,
                    background:
                      idx === 0
                        ? "var(--accent-blue)"
                        : idx === 1
                        ? "#38bdf8"
                        : idx === 2
                        ? "#7dd3fc"
                        : "#bae6fd",
                    borderRadius: "9999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Census Composition Bar */}
        <div
          style={{
            padding: "0.875rem",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Census Enrollment Tier Composition
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-yellow)" }}>
              {totalCensus.toLocaleString()} Enrolled Lives
            </span>
          </div>

          {/* Segmented Bar */}
          <div
            style={{
              height: "10px",
              display: "flex",
              borderRadius: "9999px",
              overflow: "hidden",
              marginBottom: "0.6rem",
            }}
          >
            <div style={{ width: `${singlePct}%`, background: "#b81c66" }} title={`Single: ${singlePct}%`} />
            <div style={{ width: `${emp1Pct}%`, background: "#00aedb" }} title={`EE+1: ${emp1Pct}%`} />
            <div style={{ width: `${famPct}%`, background: "#ffc20e" }} title={`Family: ${famPct}%`} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#b81c66", display: "inline-block" }} />
              Single: {singleCensus} ({singlePct}%)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00aedb", display: "inline-block" }} />
              EE+1: {emp1Census} ({emp1Pct}%)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffc20e", display: "inline-block" }} />
              Family: {familyCensus} ({famPct}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
