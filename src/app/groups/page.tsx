"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import DuplicateAlertModal from "@/components/DuplicateAlertModal";
import {
  Users,
  Search,
  Plus,
  Filter,
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

function GroupsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State for Add Client
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
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
    notes: "",
    status: "ACTIVE",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Duplicate Check Modal State
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const url = `/api/clients?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchQuery, statusFilter]);

  const executeCreateClient = async () => {
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewClient({
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
          notes: "",
          status: "ACTIVE",
        });
        fetchClients();
        router.push(`/groups/${data.client.id}`);
      } else {
        setFormError(data.error || "Failed to create client.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name.trim() || !newClient.taxId.trim() || !newClient.npiNumber.trim()) {
      setFormError("Group Name, Tax ID, and Group Number are required.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      // Step 1: Run Duplicate Detection Check
      const dupRes = await fetch("/api/clients/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClient.name,
          taxId: newClient.taxId,
          npiNumber: newClient.npiNumber,
        }),
      });

      const dupData = await dupRes.json();
      setSubmitting(false);

      if (dupData.success && dupData.isDuplicate) {
        setDuplicateMatches(dupData.matches);
        return;
      }

      // Step 2: If no duplicates, proceed with creation
      await executeCreateClient();
    } catch (err: any) {
      setSubmitting(false);
      setFormError(err.message || "Failed to check duplicates.");
    }
  };

  return (
    <div className="theme-clients-page" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span className="badge badge-pink">GROUPS PORTAL</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Users size={30} style={{ color: "var(--accent-pink)" }} />
            <span>Groups</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Manage groups and networks. Click any row to view & edit details.
          </p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Group</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: "1rem 1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search by Name, Tax ID, Group #, Specialty, Phone, City, State..."
            className="form-input"
            style={{ paddingLeft: "2.5rem" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={16} style={{ color: "var(--text-muted)" }} />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "160px" }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="TERMINATED">Terminated</option>
          </select>

          <span className="badge badge-pink" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
            {clients.length} Groups {clients.length > 15 ? "(Scroll to view all)" : ""}
          </span>
        </div>
      </div>

      {/* Clients Data Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ minWidth: "220px" }}>Group Name</th>
              <th className="nowrap">Group Number</th>
              <th style={{ minWidth: "180px" }}>Location &amp; Contact</th>
              <th>SIC Code</th>
              <th className="nowrap">Status</th>
              <th className="nowrap">Linked Vendors</th>
              <th style={{ textAlign: "right" }} className="nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  Loading groups...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                  No groups match your search criteria.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => router.push(`/groups/${client.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <Link href={`/groups/${client.id}`} style={{ fontWeight: "700", color: "#f472b6" }}>
                      {client.name}
                    </Link>
                    {client.email && (
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{client.email}</div>
                    )}
                  </td>
                  <td className="text-mono nowrap" onClick={(e) => e.stopPropagation()}>
                    {client.npiNumber ? (
                      <Link
                        href={`/groups/group/${encodeURIComponent(client.npiNumber)}`}
                        style={{ color: "#f472b6", textDecoration: "none", fontWeight: "700" }}
                        title={`Go directly to Group #${client.npiNumber}`}
                      >
                        {client.npiNumber}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="nowrap">
                    <div style={{ fontSize: "0.85rem" }}>
                      {client.city && client.state ? `${client.city}, ${client.state}` : client.city || client.state || "—"}
                    </div>
                    {client.phone && (
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{client.phone}</div>
                    )}
                  </td>
                  <td>{client.specialty || "General"}</td>
                  <td className="nowrap">
                    <span
                      className={`badge ${client.status === "ACTIVE"
                        ? "badge-active"
                        : "badge-inactive"
                        }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="nowrap" onClick={(e) => e.stopPropagation()}>
                    <span className="badge badge-pink">
                      {client.vendors?.length || 0} Vendors
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }} className="nowrap" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/groups/${client.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>View & Edit</span>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: Add Group */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Building2 size={22} style={{ color: "var(--accent-pink)" }} />
                <h2 className="modal-title">Add Group</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {formError}
                  </div>
                )}

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Group Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Apex Health Network"
                      required
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tax ID / EIN *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 12-3456789"
                      required
                      value={newClient.taxId}
                      onChange={(e) => setNewClient({ ...newClient, taxId: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Group Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="G-1234"
                      required
                      value={newClient.npiNumber}
                      onChange={(e) => setNewClient({ ...newClient, npiNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SIC Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="1234"
                      value={newClient.specialty}
                      onChange={(e) => setNewClient({ ...newClient, specialty: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="100 Medical Center Blvd"
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.75rem" }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Boston"
                      value={newClient.city}
                      onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MA"
                      value={newClient.state}
                      onChange={(e) => setNewClient({ ...newClient, state: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="02115"
                      value={newClient.zipCode}
                      onChange={(e) => setNewClient({ ...newClient, zipCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="(555) 000-0000"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newClient.status}
                    onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="TERMINATED">TERMINATED</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes & Operational Details</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Internal notes regarding this group..."
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? "Checking..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DUPLICATE WARNING MODAL */}
      {duplicateMatches.length > 0 && (
        <DuplicateAlertModal
          type="client"
          matches={duplicateMatches}
          onClose={() => setDuplicateMatches([])}
          onConfirmCreate={() => {
            setDuplicateMatches([]);
            executeCreateClient();
          }}
        />
      )}
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={<div style={{ color: "var(--text-muted)", padding: "2rem" }}>Loading groups...</div>}>
      <GroupsContent />
    </Suspense>
  );
}
