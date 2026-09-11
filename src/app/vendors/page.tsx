"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import DuplicateAlertModal from "@/components/DuplicateAlertModal";
import {
  Store,
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
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

function VendorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorTypeFilter, setVendorTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State for Add Vendor
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    taxId: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    vendorType: "MEDICAL_SUPPLIES",
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

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const url = `/api/vendors?search=${encodeURIComponent(searchQuery)}&vendorType=${vendorTypeFilter}&status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [searchQuery, vendorTypeFilter, statusFilter]);

  const executeCreateVendor = async () => {
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVendor),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewVendor({
          name: "",
          taxId: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          vendorType: "MEDICAL_SUPPLIES",
          notes: "",
          status: "ACTIVE",
        });
        fetchVendors();
        router.push(`/vendors/${data.vendor.id}`);
      } else {
        setFormError(data.error || "Failed to create vendor.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name.trim() || !newVendor.taxId.trim()) {
      setFormError("Vendor Name and Tax ID are required.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      // Step 1: Run Duplicate Detection Check
      const dupRes = await fetch("/api/vendors/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newVendor.name,
          taxId: newVendor.taxId,
        }),
      });

      const dupData = await dupRes.json();
      setSubmitting(false);

      if (dupData.success && dupData.isDuplicate) {
        setDuplicateMatches(dupData.matches);
        return;
      }

      // Step 2: If no duplicates, proceed with creation
      await executeCreateVendor();
    } catch (err: any) {
      setSubmitting(false);
      setFormError(err.message || "Failed to check duplicates.");
    }
  };

  return (
    <div className="theme-vendors-page" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span className="badge badge-blue">VENDOR PORTAL</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Store size={30} style={{ color: "var(--accent-blue)" }} />
            <span>Vendors</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Directory of vendors and service providers. Click any row to view & edit details.
          </p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-blue">
          <Plus size={18} />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: "1rem 1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search vendors by Name, Tax ID, Phone, City, State, Service Type..."
            className="form-input"
            style={{ paddingLeft: "2.5rem" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={16} style={{ color: "var(--text-muted)" }} />
            <select
              className="form-select"
              value={vendorTypeFilter}
              onChange={(e) => setVendorTypeFilter(e.target.value)}
              style={{ width: "180px" }}
            >
              <option value="ALL">All Categories</option>
              <option value="MEDICAL_SUPPLIES">Medical Supplies</option>
              <option value="IT_SERVICES">IT & EHR Systems</option>
              <option value="LAB_SERVICES">Lab & Pathology</option>
              <option value="BILLING">Billing & RCM</option>
              <option value="PHARMACY">Pharmacy</option>
              <option value="GENERAL">General Vendor</option>
            </select>
          </div>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "140px" }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Vendors Data Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ minWidth: "220px" }}>Vendor Name</th>
              <th className="nowrap">Category</th>
              <th style={{ minWidth: "180px" }}>Contact & Location</th>
              <th className="nowrap">Status</th>
              <th className="nowrap">Associated Groups</th>
              <th style={{ textAlign: "right" }} className="nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  Loading vendors...
                </td>
              </tr>
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                  No vendors match your search criteria.
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  onClick={() => router.push(`/vendors/${vendor.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <Link href={`/vendors/${vendor.id}`} style={{ fontWeight: "700", color: "#38bdf8" }}>
                      {vendor.name}
                    </Link>
                    {vendor.email && (
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{vendor.email}</div>
                    )}
                  </td>
                  <td className="nowrap">
                    <span className="badge badge-purple">{vendor.vendorType}</span>
                  </td>
                  <td className="nowrap">
                    <div style={{ fontSize: "0.85rem" }}>
                      {vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : vendor.city || vendor.state || "—"}
                    </div>
                    {vendor.phone && (
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{vendor.phone}</div>
                    )}
                  </td>
                  <td className="nowrap">
                    <span
                      className={`badge ${vendor.status === "ACTIVE"
                          ? "badge-active"
                          : vendor.status === "INACTIVE"
                            ? "badge-inactive"
                            : "badge-pending"
                        }`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="nowrap">
                    <span className="badge badge-blue">
                      {vendor.clients?.length || 0} Groups
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }} className="nowrap" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/vendors/${vendor.id}`}
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

      {/* MODAL: Add Vendor */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Store size={22} style={{ color: "var(--accent-blue)" }} />
                <h2 className="modal-title">Add New Vendor</h2>
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
                    <label className="form-label">Vendor Company Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. MedSupply Direct Inc."
                      required
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tax ID / EIN *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 55-1122334"
                      required
                      value={newVendor.taxId}
                      onChange={(e) => setNewVendor({ ...newVendor, taxId: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Vendor Category</label>
                    <select
                      className="form-select"
                      value={newVendor.vendorType}
                      onChange={(e) => setNewVendor({ ...newVendor, vendorType: e.target.value })}
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
                      value={newVendor.status}
                      onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value })}
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
                      placeholder="(800) 555-0000"
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="orders@vendor.com"
                      value={newVendor.email}
                      onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="500 Logistics Parkway"
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.75rem" }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Chicago"
                      value={newVendor.city}
                      onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="IL"
                      value={newVendor.state}
                      onChange={(e) => setNewVendor({ ...newVendor, state: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="60601"
                      value={newVendor.zipCode}
                      onChange={(e) => setNewVendor({ ...newVendor, zipCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Vendor Capabilities & Notes</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Description of supplies, service level agreements, or contracts..."
                    value={newVendor.notes}
                    onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
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
                <button type="submit" disabled={submitting} className="btn btn-blue">
                  {submitting ? "Checking..." : "Create Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DUPLICATE WARNING MODAL */}
      {duplicateMatches.length > 0 && (
        <DuplicateAlertModal
          type="vendor"
          matches={duplicateMatches}
          onClose={() => setDuplicateMatches([])}
          onConfirmCreate={() => {
            setDuplicateMatches([]);
            executeCreateVendor();
          }}
        />
      )}
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={<div style={{ color: "var(--text-muted)", padding: "2rem" }}>Loading vendors...</div>}>
      <VendorsContent />
    </Suspense>
  );
}
