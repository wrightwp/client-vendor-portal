"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchSelect from "@/components/SearchSelect";
import ChangeHistoryTimeline from "@/components/ChangeHistoryTimeline";
import HistoryWalkthroughModal from "@/components/HistoryWalkthroughModal";
import ContactsList from "@/components/ContactsList";
import BillingEnrollmentSection from "@/components/BillingEnrollmentSection";
import EditAssociationNoteModal from "@/components/EditAssociationNoteModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { MarkdownNoteRenderer } from "@/components/MarkdownNotes";
import {
  ArrowLeft,
  Building2,
  Users,
  Store,
  Edit3,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  FileText,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Calendar,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [client, setClient] = useState<any | null>(null);
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Audit Trail Expander State (starts closed by default)
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Group Details & Notes Expandable State (defaults to closed)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Associated Vendors Expandable State (defaults to closed)
  const [isVendorsExpanded, setIsVendorsExpanded] = useState(false);

  // Walkthrough Modal State
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [walkthroughIndex, setWalkthroughIndex] = useState(0);

  // Vendor Association Note Modal State
  const [activeNoteVendor, setActiveNoteVendor] = useState<{
    vendorId: string;
    name: string;
    notes: string;
  } | null>(null);

  // Confirm Delete Vendor Association Modal State
  const [deleteVendorTarget, setDeleteVendorTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Edit Form State
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    npiNumber: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialty: "",
    status: "ACTIVE",
    notes: "",
  });

  // Association Form State
  const [newAssociation, setNewAssociation] = useState({ vendorId: "", notes: "" });
  const [associating, setAssociating] = useState(false);

  const fetchClientDetails = async () => {
    try {
      const res = await fetch(`/api/clients/${id}`);
      const data = await res.json();
      if (data.success && data.client) {
        setClient(data.client);
        setFormData({
          name: data.client.name || "",
          taxId: data.client.taxId || "",
          npiNumber: data.client.npiNumber || "",
          phone: data.client.phone || "",
          email: data.client.email || "",
          address: data.client.address || "",
          city: data.client.city || "",
          state: data.client.state || "",
          zipCode: data.client.zipCode || "",
          specialty: data.client.specialty || "",
          status: data.client.status || "ACTIVE",
          notes: data.client.notes || "",
        });
      } else {
        setMessage({ text: "Client not found.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to fetch client", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorsList = async () => {
    try {
      const res = await fetch("/api/vendors");
      const data = await res.json();
      if (data.success) {
        setVendorsList(data.vendors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClientDetails();
    fetchVendorsList();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setClient(data.client);
        setIsEditing(false);
        setMessage({ text: "Client details updated successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to update client", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to save", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAssociation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssociation.vendorId) return;

    setAssociating(true);
    try {
      const res = await fetch("/api/associations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: id,
          vendorId: newAssociation.vendorId,
          notes: newAssociation.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewAssociation({ vendorId: "", notes: "" });
        await fetchClientDetails();
        setMessage({ text: "Vendor associated successfully!", type: "success" });
      } else {
        alert(data.error || "Failed to associate vendor");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssociating(false);
    }
  };

  const handleRemoveAssociation = async (vendorId: string) => {
    try {
      const res = await fetch(`/api/associations?clientId=${id}&vendorId=${vendorId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchClientDetails();
        setMessage({ text: "Vendor association removed.", type: "success" });
      } else {
        alert(data.error || "Failed to remove association");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)", padding: "3rem", textAlign: "center" }}>Loading group profile...</div>;
  }

  if (!client) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem" }}>Group Not Found</h2>
        <Link href="/clients" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Groups Directory</span>
        </Link>
      </div>
    );
  }

  const unlinkedVendors = vendorsList.filter(
    (v) => !client.vendors?.some((cv: any) => cv.vendorId === v.id)
  );

  return (
    <div className="theme-clients-page" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Top Action Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <Link href="/clients" className="btn btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <ArrowLeft size={16} />
          <span>Back to Groups</span>
        </Link>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            <Edit3 size={16} />
            <span>Edit Group Information</span>
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary">
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          style={{
            padding: "0.875rem 1.25rem",
            borderRadius: "var(--radius-md)",
            background: message.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: `1px solid ${message.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            color: message.type === "success" ? "#10b981" : "#ef4444",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Profile Header */}
      <div
        className="glass-panel client-profile-header"
        style={{
          padding: "2rem",
          border: "1px solid rgba(184, 28, 102, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span className="badge badge-pink">Group Profile</span>
              <span
                className={`badge ${
                  client.status === "ACTIVE"
                    ? "badge-active"
                    : client.status === "INACTIVE"
                    ? "badge-inactive"
                    : "badge-pending"
                }`}
              >
                {client.status}
              </span>
            </div>

            <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
              {client.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              <div>
                Tax ID (EIN): <strong className="text-mono" style={{ color: "var(--text-primary)" }}>{client.taxId}</strong>
              </div>
              {client.npiNumber && (
                <div>
                  Group Number: <strong className="text-mono" style={{ color: "var(--text-primary)" }}>{client.npiNumber}</strong>
                </div>
              )}
              {client.specialty && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Tag size={15} style={{ color: "var(--accent-pink)" }} />
                  <span>{client.specialty}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#f472b6" }}>
              {client.vendors?.length || 0}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Associated Vendors</div>
          </div>
        </div>
      </div>

      {/* VIEW or EDIT Section */}
      {!isEditing ? (
        /* View Mode: Combined Contact, Location & Operational Notes */
        <div className="glass-panel" style={{ padding: "1.75rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: isDetailsExpanded ? "1.5rem" : "0",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Building2 size={22} style={{ color: "var(--accent-pink)" }} />
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "800" }}>
                  Contact, Location & Operational Notes
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.1rem" }}>
                  Primary phone, email, physical location, and internal notes for {client.name}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.4rem 0.6rem" }}
              title={isDetailsExpanded ? "Collapse Section" : "Expand Section"}
            >
              {isDetailsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {isDetailsExpanded && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem", paddingTop: "0.5rem" }}>
              {/* Left Column: Contact & Location Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--accent-pink)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <MapPin size={16} />
                  <span>Contact & Physical Address</span>
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Phone size={18} style={{ color: "var(--text-muted)" }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Phone Number</div>
                    <div style={{ fontWeight: "600" }}>{client.phone || "Not provided"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Mail size={18} style={{ color: "var(--text-muted)" }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Email Address</div>
                    <div style={{ fontWeight: "600", color: "#f472b6" }}>{client.email || "Not provided"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <MapPin size={18} style={{ color: "var(--text-muted)", marginTop: "0.2rem" }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Physical Address</div>
                    <div style={{ fontWeight: "600" }}>{client.address || "No street address"}</div>
                    <div style={{ color: "var(--text-secondary)" }}>
                      {client.city && client.state
                        ? `${client.city}, ${client.state} ${client.zipCode || ""}`
                        : client.city || client.state || "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Operational Notes & Record Info */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--accent-pink)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FileText size={16} />
                    <span>Operational Notes</span>
                  </h3>

                  <div style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    {client.notes ? (
                      <p style={{ whiteSpace: "pre-wrap" }}>{client.notes}</p>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>No internal notes recorded for this group.</span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Calendar size={14} />
                    <span>Created: {new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Calendar size={14} />
                    <span>Last Updated: {new Date(client.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compact View when Collapsed */}
          {!isDetailsExpanded && (
            <div
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                flexWrap: "wrap",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              {client.phone && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <Phone size={14} style={{ color: "var(--text-muted)" }} />
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{client.phone}</span>
                </span>
              )}
              {client.email && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <Mail size={14} style={{ color: "var(--text-muted)" }} />
                  <span style={{ color: "#f472b6", fontWeight: "600" }}>{client.email}</span>
                </span>
              )}
              {(client.city || client.state) && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <MapPin size={14} style={{ color: "var(--text-muted)" }} />
                  <span>{[client.address, client.city, client.state].filter(Boolean).join(", ")}</span>
                </span>
              )}
              {client.notes && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: "var(--text-muted)",
                    maxWidth: "350px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={client.notes}
                >
                  <FileText size={14} />
                  <span>{client.notes}</span>
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Edit Mode Form */
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Edit3 size={20} style={{ color: "var(--accent-pink)" }} />
            <span>Edit Group Record</span>
          </h2>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Group Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tax ID (EIN) *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Group Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.npiNumber}
                onChange={(e) => setFormData({ ...formData, npiNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specialty / Type</label>
              <input
                type="text"
                className="form-input"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "0.75rem" }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Zip Code</label>
              <input
                type="text"
                className="form-input"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Operational Details</label>
            <textarea
              rows={4}
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* 1. Key Contacts List Section */}
      <ContactsList
        contacts={client.contacts || []}
        entityId={id}
        entityType="CLIENT"
        onRefresh={fetchClientDetails}
        accentColor="pink"
        collapsible={true}
        defaultOpen={false}
      />

      {/* 2. Associated Vendors Section */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isVendorsExpanded ? "1.25rem" : "0", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Store size={22} style={{ color: "var(--accent-blue)" }} />
              <span>Associated Vendors ({client.vendors?.length || 0})</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Vendors linked to this group with specific operational notes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsVendorsExpanded(!isVendorsExpanded)}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.4rem 0.6rem" }}
            title={isVendorsExpanded ? "Collapse Section" : "Expand Section"}
          >
            {isVendorsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Compact View when Collapsed */}
        {!isVendorsExpanded && (
          <div
            style={{
              marginTop: "0.75rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
            }}
          >
            {client.vendors && client.vendors.length > 0 ? (
              <>
                <span style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "0.8rem" }}>Linked:</span>
                {client.vendors.slice(0, 4).map((item: any) => (
                  <span
                    key={item.vendorId}
                    className="badge badge-purple"
                    style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                  >
                    <span>{item.vendor.name}</span>
                    <span style={{ opacity: 0.7, fontSize: "0.7rem" }}>({item.vendor.vendorType})</span>
                  </span>
                ))}
                {client.vendors.length > 4 && (
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600" }}>
                    +{client.vendors.length - 4} more
                  </span>
                )}
              </>
            ) : (
              <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No vendors linked to this group</span>
            )}
          </div>
        )}

        {isVendorsExpanded && (
          <>
            {/* Interactive Search-Based Vendor Linking Form */}
            <form onSubmit={handleAddAssociation} className="glass-panel" style={{ padding: "1.25rem", marginBottom: "1.5rem", border: "1px dashed var(--accent-blue)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: "800", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <LinkIcon size={16} style={{ color: "var(--accent-blue)" }} />
                <span>Search & Link a Vendor</span>
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", alignItems: "center" }}>
                <SearchSelect
                  items={unlinkedVendors}
                  selectedId={newAssociation.vendorId}
                  onSelect={(item) => setNewAssociation({ ...newAssociation, vendorId: item ? item.id : "" })}
                  placeholder="Search vendor by name, category, tax ID, city..."
                  type="vendor"
                />

                <input
                  type="text"
                  className="form-input"
                  placeholder="Association notes (e.g. Primary PPE Supplier, Contract #998)"
                  value={newAssociation.notes}
                  onChange={(e) => setNewAssociation({ ...newAssociation, notes: e.target.value })}
                />

                <button type="submit" disabled={associating || !newAssociation.vendorId} className="btn btn-blue btn-sm">
                  {associating ? "Linking..." : "Link Vendor"}
                </button>
              </div>
            </form>

            {/* Vendors Table / Cards */}
            {client.vendors?.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                No vendors are currently associated with this group.
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Vendor Name</th>
                      <th className="nowrap">Category</th>
                      <th className="nowrap">Location</th>
                      <th>Association Notes</th>
                      <th style={{ textAlign: "right" }} className="nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.vendors?.map((item: any) => (
                      <tr key={item.vendorId}>
                        <td>
                          <Link
                            href={`/vendors/${item.vendor.id}`}
                            style={{ fontWeight: "700", color: "#38bdf8" }}
                          >
                            {item.vendor.name}
                          </Link>
                        </td>
                        <td className="nowrap">
                          <span className="badge badge-purple">{item.vendor.vendorType}</span>
                        </td>
                        <td className="nowrap">
                          {item.vendor.city && item.vendor.state
                            ? `${item.vendor.city}, ${item.vendor.state}`
                            : "—"}
                        </td>
                        <td style={{ color: "var(--text-secondary)", fontStyle: item.notes ? "normal" : "italic", minWidth: "260px" }}>
                          {item.notes ? (
                            <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid var(--border)", padding: "0.4rem 0.75rem", borderRadius: "8px" }}>
                              <MarkdownNoteRenderer content={item.notes} />
                            </div>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>No group-specific notes</span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }} className="nowrap">
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => setActiveNoteVendor({ vendorId: item.vendorId, name: item.vendor.name, notes: item.notes || "" })}
                              className="btn btn-secondary btn-sm"
                              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                              title="Edit Group-Specific Vendor Notes"
                            >
                              <FileText size={14} style={{ color: "var(--accent-blue)" }} />
                              <span>{item.notes ? "Edit Note" : "+ Add Note"}</span>
                            </button>
                            <Link href={`/vendors/${item.vendor.id}`} className="btn btn-secondary btn-sm">
                              View Vendor
                            </Link>
                            <button
                              onClick={() => setDeleteVendorTarget({ id: item.vendorId, name: item.vendor.name })}
                              className="btn btn-danger btn-sm"
                              title="Unlink Vendor"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* 3. B&E (Billing & Enrollment Summary) Specification Section */}
      <BillingEnrollmentSection
        clientId={id}
        clientName={client.name}
        data={client.billingEnrollment}
        onRefresh={fetchClientDetails}
      />

      {/* Change History & Audit Trail Expander Card (At bottom, starts closed) */}
      <ChangeHistoryTimeline
        history={client.history || []}
        onSelectVersion={(stepIdx) => {
          setWalkthroughIndex(stepIdx);
          setIsWalkthroughOpen(true);
        }}
        accentColor="pink"
        collapsible={true}
        defaultOpen={false}
      />

      {/* Interactive History Walkthrough Modal */}
      <HistoryWalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        history={client.history || []}
        entityType="CLIENT"
        entityName={client.name}
        initialStepIndex={walkthroughIndex}
        accentColor="pink"
      />

      {/* Edit Client-Specific Vendor Note Modal */}
      {activeNoteVendor && (
        <EditAssociationNoteModal
          isOpen={!!activeNoteVendor}
          onClose={() => setActiveNoteVendor(null)}
          clientId={id}
          vendorId={activeNoteVendor.vendorId}
          vendorName={activeNoteVendor.name}
          currentNotes={activeNoteVendor.notes}
          onSaveSuccess={fetchClientDetails}
        />
      )}

      {/* Confirm Delete Vendor Association Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteVendorTarget}
        onClose={() => setDeleteVendorTarget(null)}
        onConfirm={() => deleteVendorTarget && handleRemoveAssociation(deleteVendorTarget.id)}
        itemType="vendor"
        itemName={deleteVendorTarget?.name}
        parentName={client.name}
        confirmText="Remove Vendor"
      />
    </div>
  );
}
