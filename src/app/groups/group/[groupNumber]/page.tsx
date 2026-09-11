import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default async function GroupByGroupNumberPage({
  params,
}: {
  params: Promise<{ groupNumber: string }>;
}) {
  const { groupNumber } = await params;

  if (!groupNumber) {
    redirect("/groups");
  }

  const rawNumber = decodeURIComponent(groupNumber).trim();
  const cleanNumber = rawNumber.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Find exact or normalized match for Group Number (npiNumber)
  const allClients = await db.client.findMany({
    select: { id: true, npiNumber: true, name: true },
  });

  const matchedClient = allClients.find((c) => {
    if (!c.npiNumber) return false;
    const cNpiClean = c.npiNumber.toLowerCase().replace(/[^a-z0-9]/g, "");
    return c.npiNumber.trim() === rawNumber || (cNpiClean && cNpiClean === cleanNumber);
  });

  if (matchedClient) {
    redirect(`/groups/${matchedClient.id}`);
  }

  return (
    <div style={{ padding: "3rem 1.5rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <div
        className="glass-panel"
        style={{
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          border: "1px solid rgba(239, 68, 68, 0.3)",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertCircle size={28} />
        </div>

        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>
            Group Not Found
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            No group was found matching Group # <strong className="text-mono" style={{ color: "var(--text-primary)" }}>{rawNumber}</strong>.
          </p>
        </div>

        <Link href="/groups" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
          <ArrowLeft size={16} />
          <span>Back to Groups Directory</span>
        </Link>
      </div>
    </div>
  );
}
