import Link from "next/link";
import { Store, Building, ArrowRight, ExternalLink, Users, Link as LinkIcon } from "lucide-react";

interface TopVendor {
  id: string;
  name: string;
  vendorType: string;
  city: string | null;
  state: string | null;
  clientCount: number;
}

interface TopGroup {
  id: string;
  name: string;
  npiNumber: string | null;
  specialty: string | null;
  census: number;
  carrier: string;
  vendorCount: number;
}

interface DashboardDirectoryInsightsProps {
  topVendors: TopVendor[];
  topGroups: TopGroup[];
}

export default function DashboardDirectoryInsights({
  topVendors,
  topGroups,
}: DashboardDirectoryInsightsProps) {
  const formatCategoryBadge = (type: string) => {
    switch (type) {
      case "IT_SERVICES":
        return <span className="badge badge-blue">IT / EHR</span>;
      case "BILLING":
        return <span className="badge badge-pink">Billing &amp; RCM</span>;
      case "LAB_SERVICES":
        return <span className="badge badge-yellow">Lab Services</span>;
      case "PHARMACY":
        return <span className="badge badge-blue">Pharmacy</span>;
      case "MEDICAL_SUPPLIES":
        return <span className="badge badge-pink">Supplies</span>;
      default:
        return <span className="badge">General</span>;
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "1.5rem" }}>
      {/* 1. Top Utilized Vendor Partners */}
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
            <Store size={20} style={{ color: "var(--accent-blue)" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Top Utilized Vendor Partners</h2>
          </div>
          <Link href="/vendors" className="btn btn-outline btn-sm">
            <span>View All Vendors</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {topVendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.id}`}
              className="glass-card"
              style={{
                padding: "0.85rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "var(--accent-blue-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Store size={18} style={{ color: "var(--accent-blue)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    {vendor.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    {vendor.city && vendor.state ? `${vendor.city}, ${vendor.state} • ` : ""}
                    Partner Vendor
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {formatCategoryBadge(vendor.vendorType)}
                <span
                  style={{
                    fontSize: "0.825rem",
                    fontWeight: "700",
                    color: "var(--accent-yellow)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {vendor.clientCount} Groups
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Largest Groups by Census */}
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
            <Users size={20} style={{ color: "var(--accent-pink)" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Largest Groups by Covered Lives</h2>
          </div>
          <Link href="/groups" className="btn btn-outline btn-sm">
            <span>View All Groups</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {topGroups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="glass-card"
              style={{
                padding: "0.85rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "var(--accent-pink-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Building size={18} style={{ color: "var(--accent-pink)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    {group.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    {group.npiNumber ? `NPI: ${group.npiNumber} • ` : ""}
                    Carrier: {group.carrier}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="badge badge-blue" style={{ fontSize: "0.72rem" }}>
                  {group.vendorCount} Vendors
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "800",
                    color: "#f472b6",
                    whiteSpace: "nowrap",
                  }}
                >
                  {group.census.toLocaleString()} Lives
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
