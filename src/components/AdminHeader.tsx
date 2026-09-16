"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, FileSpreadsheet } from "lucide-react";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AdminHeader({
  title = "Admin Workspace",
  subtitle = "Global administrative controls and master record management",
}: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Top Banner - Light Theme with Orange Palette */}
      <div
        className="glass-card"
        style={{
          padding: "1.25rem 1.5rem",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
          color: "#0f172a",
          border: "1px solid #fed7aa",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 16px rgba(249, 115, 22, 0.08)",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.35)",
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: "800", margin: 0, color: "#7c2d12", letterSpacing: "-0.01em" }}>
              {title}
            </h1>
            <p style={{ fontSize: "0.825rem", color: "#c2410c", margin: "0.2rem 0 0 0", fontWeight: 500 }}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Subheader Tab Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderBottom: "2px solid var(--border, #e2e8f0)",
          paddingBottom: "0px",
        }}
      >
        <Link
          href="/admin/be-masters"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.6rem 1.1rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            textDecoration: "none",
            color: pathname === "/admin/be-masters" ? "#ea580c" : "var(--text-muted, #64748b)",
            borderBottom: pathname === "/admin/be-masters" ? "3px solid #f97316" : "3px solid transparent",
            marginBottom: "-2px",
            transition: "all 0.15s ease",
          }}
        >
          <FileSpreadsheet size={17} />
          <span>B&E Masters</span>
        </Link>
      </div>
    </div>
  );
}

export default AdminHeader;
