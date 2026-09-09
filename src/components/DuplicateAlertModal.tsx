"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ExternalLink, Plus, X } from "lucide-react";

interface DuplicateAlertModalProps {
  type: "client" | "vendor";
  matches: any[];
  onClose: () => void;
  onConfirmCreate: () => void;
}

export default function DuplicateAlertModal({
  type,
  matches,
  onClose,
  onConfirmCreate,
}: DuplicateAlertModalProps) {
  const router = useRouter();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "620px", border: "1px solid var(--accent-yellow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ borderBottom: "1px solid rgba(255, 194, 14, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <AlertTriangle size={24} style={{ color: "var(--accent-yellow)" }} />
            <h2 className="modal-title" style={{ color: "var(--accent-yellow)" }}>
              Potential Duplicate {type === "client" ? "Healthcare Group" : "Vendor"} Detected
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Our duplicate detection algorithm found existing record(s) matching your entry by <strong>80% or more</strong>. Would you like to view the existing record or create a new entry anyway?
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.5rem" }}>
            {matches.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid rgba(255, 194, 14, 0.35)",
                  background: "rgba(255, 194, 14, 0.04)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span className="badge badge-yellow" style={{ fontSize: "0.7rem" }}>
                      {item.matchScore}% Match
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#ffc20e", fontWeight: "600" }}>
                      {item.matchReason}
                    </span>
                  </div>

                  <div style={{ fontWeight: "800", fontSize: "1rem", color: "var(--text-primary)" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Tax ID: <span className="text-mono">{item.taxId}</span>
                    {item.npiNumber && ` • NPI: ${item.npiNumber}`}
                    {(item.specialty || item.vendorType) && ` • ${item.specialty || item.vendorType}`}
                    {item.city && ` • ${item.city}, ${item.state}`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/${type === "client" ? "clients" : "vendors"}/${item.id}`);
                  }}
                  className="btn btn-yellow btn-sm"
                >
                  <span>View Existing</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel & Edit Entry
          </button>
          <button
            type="button"
            onClick={onConfirmCreate}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Create New Record Anyway</span>
          </button>
        </div>
      </div>
    </div>
  );
}
