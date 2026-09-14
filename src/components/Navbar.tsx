"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Store,
  Search,
  Plus,
  ShieldCheck,
  X,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ clients: any[]; vendors: any[] }>({
    clients: [],
    vendors: [],
  });
  const [loading, setLoading] = useState(false);

  // Set Light Theme permanently on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ clients: [], vendors: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults({ clients: data.clients, vendors: data.vendors });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="nav-header">
        <Link href="/" className="nav-logo">
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #b81c66 0%, #00aedb 60%, #ffc20e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 2px 10px rgba(184, 28, 102, 0.4)",
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <span>Client Information Portal</span>
        </Link>

        <nav className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "active" : ""}`}
          >
            <Building2 size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/groups"
            className={`nav-link ${pathname.startsWith("/groups") ? "active" : ""}`}
          >
            <Users size={18} />
            <span>Groups</span>
          </Link>
          <Link
            href="/vendors"
            className={`nav-link ${pathname.startsWith("/vendors") ? "active" : ""}`}
            style={pathname.startsWith("/vendors") ? { background: "var(--accent-blue)", color: "#fff" } : {}}
          >
            <Store size={18} />
            <span>Vendors</span>
          </Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setSearchOpen(true)}
            className="btn btn-secondary"
            style={{ padding: "0.5rem 0.875rem", fontSize: "0.825rem", color: "var(--text-muted)" }}
          >
            <Search size={16} />
            <span>Search portal...</span>
            <kbd
              style={{
                marginLeft: "0.5rem",
                padding: "0.15rem 0.4rem",
                background: "rgba(0, 0, 0, 0.08)",
                borderRadius: "4px",
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
              }}
            >
              Ctrl K
            </kbd>
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="modal-overlay" onClick={() => setSearchOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: "720px", marginTop: "-5vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ borderBottom: "none", paddingBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
                <Search size={20} style={{ color: "var(--accent-pink)" }} />
                <input
                  type="text"
                  placeholder="Search Groups or Vendors by Name, Tax ID, Group #, City, Phone..."
                  className="form-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  style={{ border: "none", fontSize: "1.05rem", background: "transparent" }}
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body search-grid-scroll" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", maxHeight: "450px", overflowY: "auto" }}>
              {loading && <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Searching database...</div>}

              {!loading && query.trim() && results.clients.length === 0 && results.vendors.length === 0 && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  No matching Groups or Vendors found for "{query}".
                </div>
              )}

              {/* Client Results */}
              {results.clients.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", color: "var(--accent-pink)", marginBottom: "0.5rem" }}>
                    Groups ({results.clients.length} match{results.clients.length > 1 ? "es" : ""})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {results.clients.slice(0, 15).map((c) => (
                      <Link
                        key={c.id}
                        href={`/groups/${c.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="glass-card"
                        style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <div>
                          <div style={{ fontWeight: "700" }}>{c.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Tax ID: {c.taxId} {c.npiNumber && `• Group #: ${c.npiNumber}`} {c.city && `• ${c.city}, ${c.state}`}
                          </div>
                        </div>
                        <span className="badge badge-pink">
                          {c.vendors?.length || 0} Vendors
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendor Results */}
              {results.vendors.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", color: "var(--accent-blue)", marginBottom: "0.5rem" }}>
                    Vendors ({results.vendors.length} match{results.vendors.length > 1 ? "es" : ""})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {results.vendors.slice(0, 15).map((v) => (
                      <Link
                        key={v.id}
                        href={`/vendors/${v.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="glass-card"
                        style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <div>
                          <div style={{ fontWeight: "700" }}>{v.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Tax ID: {v.taxId} • Category: {v.vendorType} {v.city && `• ${v.city}, ${v.state}`}
                          </div>
                        </div>
                        <span className="badge badge-blue">
                          {v.clients?.length || 0} Groups
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
