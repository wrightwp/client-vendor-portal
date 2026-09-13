"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  DollarSign,
  FileText,
  FileSpreadsheet,
  Link as LinkIcon,
  Trash2,
  Edit3,
  Check,
  X,
  Plus,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  LayoutGrid,
  List,
} from "lucide-react";
import SearchSelect from "./SearchSelect";
import { MarkdownNoteRenderer } from "./MarkdownNotes";
import EditAssociationNoteModal from "./EditAssociationNoteModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { exportGroupVendorsToExcel } from "@/lib/exportGroupVendorsExcel";

interface BEAssociatedVendorsTableProps {
  clientId: string;
  clientName: string;
  vendors: any[];
  allVendors?: any[];
  onRefresh: () => void;
}

export default function BEAssociatedVendorsTable({
  clientId,
  clientName,
  vendors = [],
  allVendors = [],
  onRefresh,
}: BEAssociatedVendorsTableProps) {
  // Display Mode: "CARDS" (2-col compact cards) | "ROWS" (streamlined compact table)
  const [displayMode, setDisplayMode] = useState<"CARDS" | "ROWS">("CARDS");

  // Inline Fee Editing State
  const [editingFeeVendorId, setEditingFeeVendorId] = useState<string | null>(null);
  const [tempFeeValue, setTempFeeValue] = useState("");
  const [savingFee, setSavingFee] = useState(false);

  // Link Vendor Form State
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [newAssociation, setNewAssociation] = useState({
    vendorId: "",
    fee: "",
    notes: "",
  });
  const [associating, setAssociating] = useState(false);

  // Modal States
  const [activeNoteVendor, setActiveNoteVendor] = useState<{
    vendorId: string;
    name: string;
    notes: string;
    fee: string;
  } | null>(null);

  const [deleteVendorTarget, setDeleteVendorTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Filter unlinked vendors for SearchSelect
  const linkedVendorIds = new Set(vendors.map((item) => item.vendorId || item.vendor?.id));
  const unlinkedVendors = allVendors.filter((v) => !linkedVendorIds.has(v.id));

  // Handle Quick Inline Fee Save
  const handleSaveInlineFee = async (vendorId: string) => {
    setSavingFee(true);
    try {
      const res = await fetch("/api/associations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          vendorId,
          fee: tempFeeValue.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingFeeVendorId(null);
        onRefresh();
      } else {
        alert(data.error || "Failed to update vendor fee.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save fee.");
    } finally {
      setSavingFee(false);
    }
  };

  // Handle Add Association
  const handleAddAssociation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssociation.vendorId) return;

    setAssociating(true);
    try {
      const res = await fetch("/api/associations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          vendorId: newAssociation.vendorId,
          fee: newAssociation.fee,
          notes: newAssociation.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewAssociation({ vendorId: "", fee: "", notes: "" });
        setShowLinkForm(false);
        onRefresh();
      } else {
        alert(data.error || "Failed to associate vendor");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssociating(false);
    }
  };

  // Handle Remove Association
  const handleRemoveAssociation = async (vendorId: string) => {
    try {
      const res = await fetch(`/api/associations?clientId=${clientId}&vendorId=${vendorId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.error || "Failed to remove association");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.25rem",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Store size={18} style={{ color: "var(--accent-blue)" }} />
          <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>
            Associated Vendors & Group Fees
          </h3>
          <span
            className="badge badge-blue"
            style={{
              fontSize: "0.7rem",
              padding: "0.15rem 0.5rem",
            }}
          >
            {vendors.length} {vendors.length === 1 ? "Vendor" : "Vendors"}
          </span>
        </div>

        {/* Right Actions & View Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {/* Compact View Switcher */}
          {vendors.length > 0 && (
            <div
              style={{
                display: "inline-flex",
                background: "rgba(0, 0, 0, 0.06)",
                borderRadius: "6px",
                padding: "2px",
                border: "1px solid var(--border)",
              }}
            >
              <button
                type="button"
                onClick={() => setDisplayMode("CARDS")}
                className="btn btn-sm"
                style={{
                  padding: "0.22rem 0.6rem",
                  fontSize: "0.75rem",
                  background: displayMode === "CARDS" ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" : "transparent",
                  color: displayMode === "CARDS" ? "#ffffff" : "var(--text-primary)",
                  border: displayMode === "CARDS" ? "1px solid #0284c7" : "1px solid transparent",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontWeight: displayMode === "CARDS" ? "700" : "600",
                  boxShadow: displayMode === "CARDS" ? "0 2px 6px rgba(2, 132, 199, 0.4)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                title="Compact Grid Cards View"
              >
                <LayoutGrid size={13} style={{ color: displayMode === "CARDS" ? "#ffffff" : "var(--text-secondary)" }} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode("ROWS")}
                className="btn btn-sm"
                style={{
                  padding: "0.22rem 0.6rem",
                  fontSize: "0.75rem",
                  background: displayMode === "ROWS" ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" : "transparent",
                  color: displayMode === "ROWS" ? "#ffffff" : "var(--text-primary)",
                  border: displayMode === "ROWS" ? "1px solid #0284c7" : "1px solid transparent",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontWeight: displayMode === "ROWS" ? "700" : "600",
                  boxShadow: displayMode === "ROWS" ? "0 2px 6px rgba(2, 132, 199, 0.4)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                title="Compact Row Strip View"
              >
                <List size={13} style={{ color: displayMode === "ROWS" ? "#ffffff" : "var(--text-secondary)" }} />
                <span>Rows</span>
              </button>
            </div>
          )}

          {vendors.length > 0 && (
            <button
              type="button"
              onClick={() => exportGroupVendorsToExcel(clientName, vendors)}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
              title="Export all associated vendors for this group to Excel"
            >
              <FileSpreadsheet size={13} style={{ color: "#10b981" }} />
              <span>Export</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowLinkForm(!showLinkForm)}
            className={showLinkForm ? "btn btn-secondary btn-sm" : "btn btn-blue btn-sm"}
            style={{
              padding: "0.25rem 0.55rem",
              fontSize: "0.75rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            {showLinkForm ? <X size={13} /> : <Plus size={13} />}
            <span>{showLinkForm ? "Cancel" : "Link Vendor"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Quick Linking Form */}
      {showLinkForm && (
        <form
          onSubmit={handleAddAssociation}
          className="glass-panel"
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "0.85rem",
            border: "1px dashed var(--accent-blue)",
            background: "rgba(0, 174, 219, 0.04)",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--accent-blue)", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <LinkIcon size={13} />
            <span>Search & Link Vendor with Group Fee</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr auto", gap: "0.5rem", alignItems: "center" }}>
            <SearchSelect
              items={unlinkedVendors}
              selectedId={newAssociation.vendorId}
              onSelect={(item) => setNewAssociation({ ...newAssociation, vendorId: item ? item.id : "" })}
              placeholder="Search vendor..."
              type="vendor"
            />

            <input
              type="text"
              className="form-input"
              style={{ fontSize: "0.78rem", padding: "0.35rem 0.55rem" }}
              placeholder="Fee (e.g. $2.50 PEPM)"
              value={newAssociation.fee}
              onChange={(e) => setNewAssociation({ ...newAssociation, fee: e.target.value })}
            />

            <input
              type="text"
              className="form-input"
              style={{ fontSize: "0.78rem", padding: "0.35rem 0.55rem" }}
              placeholder="Notes (e.g. Contract #)"
              value={newAssociation.notes}
              onChange={(e) => setNewAssociation({ ...newAssociation, notes: e.target.value })}
            />

            <button
              type="submit"
              disabled={associating || !newAssociation.vendorId}
              className="btn btn-blue btn-sm"
              style={{ whiteSpace: "nowrap", padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
            >
              {associating ? "Linking..." : "Link"}
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {vendors.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            background: "rgba(0, 174, 219, 0.02)",
            borderRadius: "6px",
            border: "1px dashed rgba(0, 174, 219, 0.25)",
          }}
        >
          No vendors are currently linked to this group. Click <strong>Link Vendor</strong> above to assign a vendor and fee schedule.
        </div>
      ) : displayMode === "CARDS" ? (
        /* UNIQUE COMPACT VIEW 1: High-Legibility Specification Cards Grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {vendors.map((item: any) => {
            const vendor = item.vendor || {};
            const isEditingThisFee = editingFeeVendorId === item.vendorId;

            return (
              <div
                key={item.vendorId || vendor.id}
                style={{
                  background: "rgba(0, 174, 219, 0.03)",
                  border: "1px solid rgba(0, 174, 219, 0.22)",
                  borderRadius: "8px",
                  padding: "0.75rem 0.85rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  transition: "border-color 0.15s ease",
                }}
              >
                {/* Card Top: Vendor Name, Badge & Actions */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                      <Link
                        href={`/vendors/${vendor.id}`}
                        style={{
                          fontWeight: "700",
                          color: "var(--accent-blue)",
                          textDecoration: "none",
                          fontSize: "0.88rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <span>{vendor.name}</span>
                        <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
                      </Link>
                      <span className="badge badge-blue" style={{ fontSize: "0.68rem", padding: "0.1rem 0.35rem" }}>
                        {vendor.vendorType || "General"}
                      </span>
                    </div>

                    {vendor.city && vendor.state && (
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        <MapPin size={11} />
                        {vendor.city}, {vendor.state}
                      </span>
                    )}
                  </div>

                  {/* Micro Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveNoteVendor({
                          vendorId: item.vendorId,
                          name: vendor.name,
                          notes: item.notes || "",
                          fee: item.fee || "",
                        })
                      }
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
                      title="Edit Group Fee & Notes"
                    >
                      <FileText size={12} style={{ color: "var(--accent-blue)" }} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteVendorTarget({ id: item.vendorId, name: vendor.name })}
                      className="btn btn-danger btn-sm"
                      style={{ fontSize: "0.7rem", padding: "0.2rem 0.35rem" }}
                      title="Unlink Vendor"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Card Middle: Unique Group Fee Highlight Box */}
                <div
                  style={{
                    background: item.fee ? "rgba(0, 174, 219, 0.12)" : "rgba(0, 174, 219, 0.03)",
                    border: item.fee ? "1px solid rgba(0, 174, 219, 0.4)" : "1px dashed rgba(0, 174, 219, 0.25)",
                    borderRadius: "6px",
                    padding: "0.4rem 0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <DollarSign size={14} style={{ color: "var(--accent-blue)" }} />
                    <span style={{ fontSize: "0.72rem", color: "var(--accent-blue)", fontWeight: "700" }}>
                      GROUP FEE:
                    </span>
                  </div>

                  {isEditingThisFee ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <input
                        type="text"
                        autoFocus
                        className="form-input"
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.15rem 0.4rem",
                          height: "24px",
                          width: "120px",
                          borderColor: "var(--accent-blue)",
                        }}
                        placeholder="e.g. $2.50 PEPM"
                        value={tempFeeValue}
                        onChange={(e) => setTempFeeValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveInlineFee(item.vendorId);
                          if (e.key === "Escape") setEditingFeeVendorId(null);
                        }}
                      />
                      <button
                        type="button"
                        disabled={savingFee}
                        onClick={() => handleSaveInlineFee(item.vendorId)}
                        className="btn btn-sm"
                        style={{
                          padding: "0.15rem 0.35rem",
                          background: "var(--accent-blue)",
                          color: "#fff",
                          border: "none",
                        }}
                        title="Save Fee"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFeeVendorId(null)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.15rem 0.35rem" }}
                        title="Cancel"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setEditingFeeVendorId(item.vendorId);
                        setTempFeeValue(item.fee || "");
                      }}
                      title="Click to edit group fee"
                    >
                      <strong
                        style={{
                          fontSize: "0.85rem",
                          color: item.fee ? "var(--accent-blue)" : "var(--text-muted)",
                          fontWeight: "800",
                        }}
                      >
                        {item.fee || "+ Set Fee"}
                      </strong>
                      <Edit3 size={11} style={{ opacity: 0.7, color: item.fee ? "var(--accent-blue)" : "var(--text-muted)" }} />
                    </div>
                  )}
                </div>

                {/* Card Bottom: Notes snippet if any */}
                {item.notes && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      background: "rgba(255, 255, 255, 0.015)",
                      padding: "0.3rem 0.5rem",
                      borderRadius: "5px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      lineHeight: "1.35",
                    }}
                  >
                    <MarkdownNoteRenderer content={item.notes} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* UNIQUE COMPACT VIEW 2: Ultra-Dense Streamlined Specification Rows */
        <div className="table-container theme-vendors-page" style={{ margin: 0 }}>
          <table className="custom-table vendor-table" style={{ fontSize: "0.8rem" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.45rem 0.75rem" }}>Vendor</th>
                <th style={{ padding: "0.45rem 0.75rem" }} className="nowrap">Category</th>
                <th style={{ padding: "0.45rem 0.75rem", minWidth: "150px" }} className="nowrap">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <DollarSign size={13} />
                    <span>Group Fee</span>
                  </div>
                </th>
                <th style={{ padding: "0.45rem 0.75rem" }}>Notes</th>
                <th style={{ padding: "0.45rem 0.75rem", textAlign: "right" }} className="nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((item: any) => {
                const vendor = item.vendor || {};
                const isEditingThisFee = editingFeeVendorId === item.vendorId;

                return (
                  <tr key={item.vendorId || vendor.id}>
                    <td style={{ padding: "0.45rem 0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Link
                          href={`/vendors/${vendor.id}`}
                          style={{
                            fontWeight: "700",
                            color: "var(--accent-blue)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                          }}
                        >
                          <span>{vendor.name}</span>
                          <ArrowUpRight size={11} style={{ opacity: 0.6 }} />
                        </Link>
                        {vendor.city && vendor.state && (
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            ({vendor.city}, {vendor.state})
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: "0.45rem 0.75rem" }} className="nowrap">
                      <span className="badge badge-blue" style={{ fontSize: "0.68rem", padding: "0.1rem 0.35rem" }}>
                        {vendor.vendorType || "General"}
                      </span>
                    </td>

                    <td style={{ padding: "0.45rem 0.75rem" }} className="nowrap">
                      {isEditingThisFee ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <input
                            type="text"
                            autoFocus
                            className="form-input"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.35rem",
                              height: "24px",
                              width: "110px",
                              borderColor: "var(--accent-blue)",
                            }}
                            placeholder="$2.50 PEPM"
                            value={tempFeeValue}
                            onChange={(e) => setTempFeeValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveInlineFee(item.vendorId);
                              if (e.key === "Escape") setEditingFeeVendorId(null);
                            }}
                          />
                          <button
                            type="button"
                            disabled={savingFee}
                            onClick={() => handleSaveInlineFee(item.vendorId)}
                            className="btn btn-sm"
                            style={{
                              padding: "0.15rem 0.35rem",
                              background: "var(--accent-blue)",
                              color: "#fff",
                            }}
                            title="Save"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingFeeVendorId(null)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "0.15rem 0.35rem" }}
                            title="Cancel"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            cursor: "pointer",
                            padding: "0.15rem 0.4rem",
                            borderRadius: "4px",
                            background: item.fee ? "rgba(0, 174, 219, 0.12)" : "transparent",
                            border: item.fee ? "1px solid rgba(0, 174, 219, 0.35)" : "1px dashed var(--border)",
                          }}
                          onClick={() => {
                            setEditingFeeVendorId(item.vendorId);
                            setTempFeeValue(item.fee || "");
                          }}
                          title="Click to edit group fee"
                        >
                          <span
                            style={{
                              fontWeight: item.fee ? "800" : "400",
                              color: item.fee ? "var(--accent-blue)" : "var(--text-muted)",
                              fontSize: "0.78rem",
                            }}
                          >
                            {item.fee || "+ Add Fee"}
                          </span>
                          <Edit3 size={10} style={{ opacity: 0.7, color: item.fee ? "var(--accent-blue)" : "var(--text-muted)" }} />
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "0.45rem 0.75rem", maxWidth: "260px" }}>
                      {item.notes ? (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.notes}
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontStyle: "italic" }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: "0.45rem 0.75rem", textAlign: "right" }} className="nowrap">
                      <div style={{ display: "flex", gap: "0.3rem", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveNoteVendor({
                              vendorId: item.vendorId,
                              name: vendor.name,
                              notes: item.notes || "",
                              fee: item.fee || "",
                            })
                          }
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: "0.7rem", padding: "0.15rem 0.4rem" }}
                          title="Edit Fee & Notes"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteVendorTarget({ id: item.vendorId, name: vendor.name })}
                          className="btn btn-danger btn-sm"
                          style={{ fontSize: "0.7rem", padding: "0.15rem 0.35rem" }}
                          title="Unlink"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Association Note & Fee Modal */}
      {activeNoteVendor && (
        <EditAssociationNoteModal
          isOpen={!!activeNoteVendor}
          onClose={() => setActiveNoteVendor(null)}
          clientId={clientId}
          vendorId={activeNoteVendor.vendorId}
          vendorName={activeNoteVendor.name}
          clientName={clientName}
          currentNotes={activeNoteVendor.notes}
          currentFee={activeNoteVendor.fee}
          onSaveSuccess={onRefresh}
        />
      )}

      {/* Confirm Delete Vendor Association Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteVendorTarget}
        onClose={() => setDeleteVendorTarget(null)}
        onConfirm={() => {
          if (deleteVendorTarget) {
            handleRemoveAssociation(deleteVendorTarget.id);
            setDeleteVendorTarget(null);
          }
        }}
        itemType="vendor"
        itemName={deleteVendorTarget?.name}
        parentName={clientName}
        confirmText="Remove Vendor"
      />
    </div>
  );
}
