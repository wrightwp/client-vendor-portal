"use client";

import React from "react";
import { FileSpreadsheet, Sparkles, Layers, Sliders } from "lucide-react";

export function BEMastersView() {
  return (
    <div className="glass-card" style={{ padding: "3rem 2rem", textAlign: "center", marginTop: "1rem" }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.22) 100%)",
          color: "#ea580c",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          boxShadow: "0 4px 14px rgba(249, 115, 22, 0.2)",
        }}
      >
        <FileSpreadsheet size={32} />
      </div>

      <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>
        B&E Masters Workspace
      </h2>

      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "540px", margin: "0 auto 1.5rem auto", lineHeight: "1.5" }}>
        This module will house master configuration and master records for Billing & Enrollment. Ready for upcoming feature specifications.
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          borderRadius: "20px",
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#9a3412",
        }}
      >
        <Sparkles size={15} style={{ color: "#f97316" }} />
        <span>B&E Masters module initial setup complete</span>
      </div>
    </div>
  );
}

export default BEMastersView;
