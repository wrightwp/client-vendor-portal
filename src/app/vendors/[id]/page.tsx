"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchSelect from "@/components/SearchSelect";
import ChangeHistoryTimeline from "@/components/ChangeHistoryTimeline";
import HistoryWalkthroughModal from "@/components/HistoryWalkthroughModal";
import ContactsList from "@/components/ContactsList";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditAssociationNoteModal from "@/components/EditAssociationNoteModal";
import { MarkdownNoteRenderer } from "@/components/MarkdownNotes";
import {
  ArrowLeft,
  Store,
  Users,
  Edit3,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  FileText,
  Link as LinkIcon,
  Trash2,
  Tag,
  Calendar,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [vendor, setVendor] = useState<any | null>(null);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Audit Trail Expander State (starts closed by default)
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Walkthrough Modal State
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [walkthroughIndex, setWalkthroughIndex] = useState(0);

  // Confirm Delete Client Association Modal State
  const [deleteClientTarget, setDeleteClientTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Client Association Note Modal State
  const [activeNoteClient, setActiveNoteClient] = useState<{
    clientId: string;
    name: string;
    notes: string;
  } | null>(null);

  // Edit Form State
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    vendorType: "MEDICAL_SUPPLIES",
    status: "ACTIVE",
    notes: "",
  });

  // Association Form State
  const [newAssociation, setNewAssociation] = useState({ clientId: "", notes: "" });
  const [associating, setAssociating] = useState(false);

  const fetchVendorDetails = async () => {
    try {
      const res = await fetch(`/api/vendors/${id}`);
      const data = await res.json();
      if (data.success && data.vendor) {
        setVendor(data.vendor);
        setFormData({
          name: data.vendor.name || "",
          taxId: data.vendor.taxId || "",
          phone: data.vendor.phone || "",
          email: data.vendor.email || "",
          address: data.vendor.address || "",
          city: data.vendor.city || "",
          state: data.vendor.state || "",
          zipCode: data.vendor.zipCode || "",
          vendorType: data.vendor.vendorType || "MEDICAL_SUPPLIES",
          status: data.vendor.status || "ACTIVE",
          notes: data.vendor.notes || "",
        });
      } else {
        setMessage({ text: "Vendor not found.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to fetch vendor", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsList = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (data.success) {
        setClientsList(data.clients);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVendorDetails();
    fetchClientsList();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setVendor(data.vendor);
        setIsEditing(false);
        setMessage({ text: "Vendor details updated successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to update vendor", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to save", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAssociation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssociation.clientId) return;

    setAssociating(true);
    try {
      const res = await fetch("/api/associations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: newAssociation.clientId,
          vendorId: id,
          notes: newAssociation.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewAssociation({ clientId: "", notes: "" });
        await fetchVendorDetails();
        setMessage({ text: "Group associated successfully!", type: "success" });
      } else {
        alert(data.error || "Failed to associate group");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssociating(false);
    }
  };

  const handleRemoveAssociation = async (clientId: string) => {
    try {
      const res = await fetch(`/api/associations?clientId=${clientId}&vendorId=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchVendorDetails();
        setMessage({ text: "Client association removed.", type: "success" });
      } else {
        alert(data.error || "Failed to remove association");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)", padding: "3rem", textAlign: "center" }}>Loading vendor profile...</div>;
  }

  if (!vendor) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem" }}>Vendor Not Found</h2>
        <Link href="/vendors" className="btn btn-blue">
          <ArrowLeft size={16} />
          <span>Back to Vendor Directory</span>
        </Link>
      </div>
    );
  }

  const unlinkedClients = clientsList.filter(
    (c) => !vendor.clients?.some((cv: any) => cv.clientId === c.id)
  );

  return (
    <div className="theme-vendors-page" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Top Action Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <Link href="/vendors" className="btn btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <ArrowLeft size={16} />
          <span>Back to Vendors</span>
        </Link>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-blue">
            <Edit3 size={16} />
            <span>Edit Vendor Information</span>
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button onClick={handleSave} disabled={saving} className="btn btn-blue">
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
        className="glass-panel vendor-profile-header"
        style={{
          padding: "2rem",
          border: "1px solid rgba(0, 174, 219, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span className="badge badge-blue">Vendor Profile</span>
              <span className="badge badge-purple">{vendor.vendorType}</span>
              <span
                className={`badge ${
                  vendor.status === "ACTIVE"
                    ? "badge-active"
                    : vendor.status === "INACTIVE"
                    ? "badge-inactive"
                    : "badge-pending"
                }`}
              >
                {vendor.status}
              </span>
            </div>

            <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
              {vendor.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              <div>
                Tax ID (EIN): <strong className="text-mono" style={{ color: "var(--text-primary)" }}>{vendor.taxId}</strong>
              </div>
              {vendor.city && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <MapPin size={15} style={{ color: "var(--accent-blue)" }} />
                  <span>{vendor.city}, {vendor.state}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#38bdf8" }}>
              {vendor.clients?.length || 0}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Associated Groups</div>
          </div>
        </div>
      </div>

      {/* VIEW or EDIT Section */}
      {!isEditing ? (
        /* View Mode */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Contact & Location Info */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Store size={20} style={{ color: "var(--accent-blue)" }} />
              <span>Contact & Location Details</span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Phone size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Phone Number</div>
                  <div>{vendor.phone || "Not provided"}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Mail size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Email Address</div>
                  <div>{vendor.email || "Not provided"}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <MapPin size={18} style={{ color: "var(--text-muted)", marginTop: "0.2rem" }} />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Physical Address</div>
                  <div>{vendor.address || "No street address"}</div>
                  <div>
                    {vendor.city && vendor.state
                      ? `${vendor.city}, ${vendor.state} ${vendor.zipCode || ""}`
                      : vendor.city || vendor.state || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Notes & Metadata */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={20} style={{ color: "var(--accent-blue)" }} />
              <span>Vendor Capabilities & Notes</span>
            </h2>

            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              {vendor.notes ? (
                <p style={{ whiteSpace: "pre-wrap" }}>{vendor.notes}</p>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>No notes recorded for this vendor.</span>
              )}
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={14} />
                <span>Created: {new Date(vendor.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={14} />
                <span>Last Updated: {new Date(vendor.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode Form */
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Edit3 size={20} style={{ color: "var(--accent-blue)" }} />
            <span>Edit Vendor Record</span>
          </h2>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Vendor Company Name *</label>
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
              <label className="form-label">Vendor Category</label>
              <select
                className="form-select"
                value={formData.vendorType}
                onChange={(e) => setFormData({ ...formData, vendorType: e.target.value })}
              >
                <option value="MEDICAL_SUPPLIES">Medical Supplies & Equipment</option>
                <option value="IT_SERVICES">IT & EHR Telehealth</option>
                <option value="LAB_SERVICES">Lab & Pathology Services</option>
                <option value="BILLING">Medical Billing & Revenue Cycle</option>
                <option value="PHARMACY">Pharmaceutical Distribution</option>
                <option value="GENERAL">General Services</option>
              </select>
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

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.75rem" }}>
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
          </div>

          <div className="form-group">
            <label className="form-label">Capabilities & Notes</label>
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
            <button type="submit" disabled={saving} className="btn btn-blue">
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Key Contacts List Section */}
      <ContactsList
        contacts={vendor.contacts || []}
        entityId={id}
        entityType="VENDOR"
        onRefresh={fetchVendorDetails}
        accentColor="blue"
      />

      {/* Associated Groups Section */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={22} style={{ color: "var(--accent-pink)" }} />
              <span>Associated Groups ({vendor.clients?.length || 0})</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Groups and practices associated with this vendor.
            </p>
          </div>
        </div>

        {/* Interactive Search-Based Client Linking Form */}
        <form onSubmit={handleAddAssociation} className="glass-panel" style={{ padding: "1.25rem", marginBottom: "1.5rem", border: "1px dashed var(--accent-pink)" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: "800", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <LinkIcon size={16} style={{ color: "var(--accent-pink)" }} />
            <span>Search & Link a Group</span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", alignItems: "center" }}>
            <SearchSelect
              items={unlinkedClients}
              selectedId={newAssociation.clientId}
              onSelect={(item) => setNewAssociation({ ...newAssociation, clientId: item ? item.id : "" })}
              placeholder="Search group by name, specialty, tax ID..."
              type="client"
            />

            <input
              type="text"
              className="form-input"
              placeholder="Association notes (e.g. Primary PPE contract)"
              value={newAssociation.notes}
              onChange={(e) => setNewAssociation({ ...newAssociation, notes: e.target.value })}
            />

            <button type="submit" disabled={associating || !newAssociation.clientId} className="btn btn-primary btn-sm">
              {associating ? "Linking..." : "Link Group"}
            </button>
          </div>
        </form>

        {/* Clients Table */}
        {vendor.clients?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            No groups are currently associated with this vendor.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th className="nowrap">NPI</th>
                  <th className="nowrap">Location</th>
                  <th>Association Notes</th>
                  <th style={{ textAlign: "right" }} className="nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendor.clients?.map((item: any) => (
                  <tr key={item.clientId}>
                    <td>
                      <Link
                        href={`/clients/${item.client.id}`}
                        style={{ fontWeight: "700", color: "#f472b6" }}
                      >
                        {item.client.name}
                      </Link>
                    </td>
                    <td className="text-mono nowrap">{item.client.npiNumber || "—"}</td>
                    <td className="nowrap">
                      {item.client.city && item.client.state
                        ? `${item.client.city}, ${item.client.state}`
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
                          onClick={() => setActiveNoteClient({ clientId: item.clientId, name: item.client.name, notes: item.notes || "" })}
                          className="btn btn-secondary btn-sm"
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                          title="Edit Group-Specific Vendor Notes"
                        >
                          <FileText size={14} style={{ color: "var(--accent-blue)" }} />
                          <span>{item.notes ? "Edit Note" : "+ Add Note"}</span>
                        </button>
                        <Link href={`/clients/${item.client.id}`} className="btn btn-secondary btn-sm">
                          View Group
                        </Link>
                        <button
                          onClick={() => setDeleteClientTarget({ id: item.clientId, name: item.client.name })}
                          className="btn btn-danger btn-sm"
                          title="Unlink Group"
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
      </div>

      {/* Change History & Audit Trail Expander Card (At bottom, starts closed) */}
      <ChangeHistoryTimeline
        history={vendor.history || []}
        onSelectVersion={(stepIdx) => {
          setWalkthroughIndex(stepIdx);
          setIsWalkthroughOpen(true);
        }}
        accentColor="blue"
        collapsible={true}
        defaultOpen={false}
      />

      {/* Interactive History Walkthrough Modal */}
      <HistoryWalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        history={vendor.history || []}
        entityType="VENDOR"
        entityName={vendor.name}
        initialStepIndex={walkthroughIndex}
        accentColor="blue"
      />

      {/* Edit Client-Specific Vendor Note Modal */}
      {activeNoteClient && (
        <EditAssociationNoteModal
          isOpen={!!activeNoteClient}
          onClose={() => setActiveNoteClient(null)}
          clientId={activeNoteClient.clientId}
          vendorId={id}
          clientName={activeNoteClient.name}
          vendorName={vendor.name}
          currentNotes={activeNoteClient.notes}
          onSaveSuccess={fetchVendorDetails}
        />
      )}

      {/* Confirm Delete Client Association Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteClientTarget}
        onClose={() => setDeleteClientTarget(null)}
        onConfirm={() => deleteClientTarget && handleRemoveAssociation(deleteClientTarget.id)}
        itemType="client"
        itemName={deleteClientTarget?.name}
        parentName={vendor.name}
        confirmText="Remove Group"
      />
    </div>
  );
}
