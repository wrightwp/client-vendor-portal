"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  FileText,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  Building2,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface ContactItem {
  id: string;
  name: string;
  title?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

interface ContactsListProps {
  contacts: ContactItem[];
  entityId: string;
  entityType: "CLIENT" | "VENDOR";
  onRefresh: () => void;
  accentColor?: "pink" | "blue";
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export default function ContactsList({
  contacts,
  entityId,
  entityType,
  onRefresh,
  accentColor = "pink",
  collapsible = true,
  defaultOpen = false,
}: ContactsListProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);
  const [deleteContactTarget, setDeleteContactTarget] = useState<{ id: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    phone: "",
    email: "",
    notes: "",
  });

  const handleOpenAddModal = () => {
    setEditingContact(null);
    setFormData({ name: "", title: "", phone: "", email: "", notes: "" });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact: ContactItem) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name || "",
      title: contact.title || "",
      phone: contact.phone || "",
      email: contact.email || "",
      notes: contact.notes || "",
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Contact Name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingContact) {
        // PATCH update contact
        const res = await fetch(`/api/contacts/${editingContact.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          onRefresh();
        } else {
          setError(data.error || "Failed to update contact");
        }
      } else {
        // POST new contact
        const payload = {
          ...formData,
          clientId: entityType === "CLIENT" ? entityId : undefined,
          vendorId: entityType === "VENDOR" ? entityId : undefined,
        };
        const res = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          onRefresh();
        } else {
          setError(data.error || "Failed to create contact");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.error || "Failed to delete contact");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isPink = accentColor === "pink";
  const themeAccentColor = isPink ? "var(--accent-pink)" : "var(--accent-blue)";
  const btnClass = isPink ? "btn-primary" : "btn-blue";
  const badgeClass = isPink ? "badge-pink" : "badge-blue";

  return (
    <div className="glass-panel" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={22} style={{ color: themeAccentColor }} />
            <span>Contacts ({contacts?.length || 0})</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.1rem" }}>
            Designated personnel, medical directors, procurement leads, and administrative contacts.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={handleOpenAddModal}
            className={`btn ${btnClass}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={16} />
            <span>Add New Contact</span>
          </button>

          {collapsible && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.4rem 0.6rem" }}
              title={isExpanded ? "Collapse Section" : "Expand Section"}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Contacts List / Grid */}
      {isExpanded && (
        <>
      {!contacts || contacts.length === 0 ? (
        <div
          style={{
            padding: "2rem",
            borderRadius: "var(--radius-md)",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px dashed var(--border)",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <User size={32} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
          <p style={{ fontSize: "0.9rem", fontWeight: "600" }}>No Key Contacts Recorded</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.2rem" }}>
            Click "Add New Contact" to add primary representatives, directors, or account leads.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "1rem" }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="glass-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isPink ? "rgba(184, 28, 102, 0.15)" : "rgba(0, 174, 219, 0.15)",
                        color: themeAccentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        flexShrink: 0,
                      }}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1.2" }}>
                        {contact.name}
                      </h3>
                      {contact.title && (
                        <span className={`badge ${badgeClass}`} style={{ fontSize: "0.725rem", marginTop: "0.2rem", display: "inline-block" }}>
                          {contact.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button
                      onClick={() => handleOpenEditModal(contact)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "0.3rem",
                        borderRadius: "4px",
                      }}
                      title="Edit Contact"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteContactTarget({ id: contact.id, name: contact.name })}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "0.3rem",
                        borderRadius: "4px",
                        opacity: 0.8,
                      }}
                      title="Remove Contact"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", marginTop: "0.75rem" }}>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "var(--text-secondary)" }}
                    >
                      <Phone size={14} style={{ color: "var(--text-muted)" }} />
                      <span>{contact.phone}</span>
                    </a>
                  )}

                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: themeAccentColor, textDecoration: "underline" }}
                    >
                      <Mail size={14} style={{ color: "var(--text-muted)" }} />
                      <span>{contact.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {contact.notes && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    paddingTop: "0.6rem",
                    borderTop: "1px solid var(--border)",
                    fontSize: "0.825rem",
                    color: "var(--text-secondary)",
                    lineHeight: "1.45",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "var(--text-muted)" }}>Note: </span>
                  {contact.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "1.75rem",
              background: "var(--bg-elevated)",
              border: `1px solid ${themeAccentColor}`,
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: isPink ? "var(--accent-pink-light)" : "var(--accent-blue-light)",
                    color: themeAccentColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                    {editingContact ? "Edit Contact" : "Add New Contact"}
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)" }}>
                    {editingContact ? editingContact.name : "Contact Details"}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: "0.65rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSaveContact} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Job Title / Role</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Medical Director"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. (555) 234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. s.jenkins@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes / Preferences</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="e.g. Preferred point of contact for billing & contract renewals..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`btn ${btnClass}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Save size={16} />
                  <span>{saving ? "Saving..." : editingContact ? "Save Changes" : "Create Contact"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Contact Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteContactTarget}
        onClose={() => setDeleteContactTarget(null)}
        onConfirm={() => deleteContactTarget && handleDeleteContact(deleteContactTarget.id)}
        itemType="contact"
        title="Delete Contact"
        itemName={deleteContactTarget?.name}
        description={`Are you sure you want to delete contact "${deleteContactTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Contact"
      />
    </div>
  );
}
