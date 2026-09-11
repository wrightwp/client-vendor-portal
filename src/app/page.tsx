import Link from "next/link";
import { db } from "@/lib/db";
import {
  Users,
  Store,
  Link as LinkIcon,
  Search,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle2,
  Building,
} from "lucide-react";

export const revalidate = 0; // Dynamic fetch

export default async function DashboardPage() {
  const [clientCount, vendorCount, associationCount, recentClients, recentVendors] =
    await Promise.all([
      db.client.count(),
      db.vendor.count(),
      db.clientVendor.count(),
      db.client.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { vendors: true },
      }),
      db.vendor.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { clients: true },
      }),
    ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Banner with ASR Color Accents */}
      <div
        className="glass-panel hero-dashboard-banner"
        style={{
          padding: "2.25rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderLeft: "6px solid var(--accent-pink)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Activity size={20} style={{ color: "var(--accent-yellow)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", color: "var(--accent-yellow)", letterSpacing: "0.05em" }}>
              Administration Portal
            </span>
          </div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Group & Vendor Management System
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "680px", fontSize: "0.95rem" }}>
            Directory for providers, clinical networks, and vendor partners. Track group numbers, service locations, and many-to-many associations.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", zIndex: 2 }}>
          <Link href="/groups?action=new" className="btn btn-primary">
            <Plus size={18} />
            <span>Add Group</span>
          </Link>
          <Link href="/vendors?action=new" className="btn btn-blue">
            <Plus size={18} />
            <span>Add Vendor</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row using Magenta, Blue, and Yellow */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
        {/* Clients Card (Magenta Accent) */}
        <div className="glass-card" style={{ padding: "1.5rem", borderTop: "4px solid var(--accent-pink)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
              Total Groups
            </span>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--accent-pink-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={20} style={{ color: "var(--accent-pink)" }} />
            </div>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#f472b6" }}>{clientCount}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Active groups & practices
          </div>
        </div>

        {/* Vendors Card (Cyan-Blue Accent) */}
        <div className="glass-card" style={{ padding: "1.5rem", borderTop: "4px solid var(--accent-blue)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
              Registered Vendors
            </span>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--accent-blue-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Store size={20} style={{ color: "var(--accent-blue)" }} />
            </div>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#38bdf8" }}>{vendorCount}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Suppliers, EHR, Labs & Billing partners
          </div>
        </div>

        {/* Associations Card (Yellow Accent) */}
        <div className="glass-card" style={{ padding: "1.5rem", borderTop: "4px solid var(--accent-yellow)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
              Active Associations
            </span>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--accent-yellow-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LinkIcon size={20} style={{ color: "var(--accent-yellow)" }} />
            </div>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#ffc20e" }}>{associationCount}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Many-to-many Group ↔ Vendor links
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Groups & Vendors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent Groups */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={20} style={{ color: "var(--accent-pink)" }} />
              <h2 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Recent Groups</h2>
            </div>
            <Link href="/groups" className="btn btn-outline btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentClients.map((client) => (
              <Link
                key={client.id}
                href={`/groups/${client.id}`}
                className="glass-card"
                style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ fontWeight: "700", marginBottom: "0.2rem", color: "#f472b6" }}>{client.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {client.specialty || "Group"}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge badge-pink">{client.vendors.length} Vendors</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Vendors */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Store size={20} style={{ color: "var(--accent-blue)" }} />
              <h2 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Recent Vendors</h2>
            </div>
            <Link href="/vendors" className="btn btn-outline btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentVendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.id}`}
                className="glass-card"
                style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ fontWeight: "700", marginBottom: "0.2rem", color: "#38bdf8" }}>{vendor.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Type: {vendor.vendorType}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge badge-blue">{vendor.clients.length} Groups</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
