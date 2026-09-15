import Link from "next/link";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import DashboardQuickNav from "@/components/DashboardQuickNav";
import DashboardKpis from "@/components/DashboardKpis";
import DashboardBenefitsAnalytics from "@/components/DashboardBenefitsAnalytics";
import DashboardDirectoryInsights from "@/components/DashboardDirectoryInsights";

export const revalidate = 0; // Dynamic fetch

export default async function DashboardPage() {
  // Fetch clients, vendors, and associations in parallel
  const [clients, vendors, associationCount] = await Promise.all([
    db.client.findMany({
      include: {
        vendors: {
          include: {
            vendor: {
              select: { id: true, name: true, vendorType: true, city: true, state: true },
            },
          },
        },
        billingEnrollments: {
          where: { isCurrent: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    db.vendor.findMany({
      include: {
        clients: true,
      },
      orderBy: { name: "asc" },
    }),
    db.clientVendor.count(),
  ]);

  // Aggregate Metrics & Domain Data
  let totalCensus = 0;
  let singleCensus = 0;
  let emp1Census = 0;
  let familyCensus = 0;
  let pbmAsrContractCount = 0;

  const carrierFrequency: Record<string, number> = {};
  const pbmFrequency: Record<string, number> = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let activeGroupCount = 0;
  let pendingTermCount = 0;

  for (const client of clients) {
    const be = client.billingEnrollments[0];

    // Status / Term date calculations
    if (client.status === "PENDING_TERM") {
      pendingTermCount++;
    } else if (client.status === "TERMINATED") {
      // Past term / terminated
    } else {
      activeGroupCount++;
    }

    if (be) {
      const tot = parseInt(be.figuresTotal || "0", 10) || 0;
      const sgl = parseInt(be.figuresSingle || "0", 10) || 0;
      const e1 = parseInt(be.figuresEmployeePlusOne || "0", 10) || 0;
      const fam = parseInt(be.figuresFamily || "0", 10) || 0;

      totalCensus += tot;
      singleCensus += sgl;
      emp1Census += e1;
      familyCensus += fam;

      if (be.currentStopLossCarrier) {
        carrierFrequency[be.currentStopLossCarrier] =
          (carrierFrequency[be.currentStopLossCarrier] || 0) + 1;
      }

      if (be.pbmRx) {
        pbmFrequency[be.pbmRx] = (pbmFrequency[be.pbmRx] || 0) + 1;
        if (be.isRxAsrContract === "Yes") {
          pbmAsrContractCount++;
        }
      }
    }
  }

  // Sorted Carrier list with percentages
  const activePlanCount = clients.reduce((acc, c) => acc + (c.billingEnrollments.length > 0 ? 1 : 0), 0);
  const carrierCounts = Object.entries(carrierFrequency)
    .map(([name, count]) => ({
      name,
      count,
      percentage: activePlanCount > 0 ? Math.round((count / activePlanCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Sorted PBM list with percentages
  const pbmCounts = Object.entries(pbmFrequency)
    .map(([name, count]) => ({
      name,
      count,
      percentage: activePlanCount > 0 ? Math.round((count / activePlanCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Top Utilized Vendors
  const topVendors = [...vendors]
    .map((v) => ({
      id: v.id,
      name: v.name,
      vendorType: v.vendorType,
      city: v.city,
      state: v.state,
      clientCount: v.clients.length,
    }))
    .sort((a, b) => b.clientCount - a.clientCount)
    .slice(0, 5);

  // Top Groups by Census
  const topGroups = clients
    .map((c) => {
      const be = c.billingEnrollments[0];
      return {
        id: c.id,
        name: c.name,
        npiNumber: c.npiNumber,
        specialty: c.specialty,
        census: be ? parseInt(be.figuresTotal || "0", 10) || 0 : 0,
        carrier: be?.currentStopLossCarrier || "N/A",
        vendorCount: c.vendors.length,
      };
    })
    .sort((a, b) => b.census - a.census)
    .slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* 1. Header Banner */}
      <div
        className="glass-panel hero-dashboard-banner"
        style={{
          padding: "2.25rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderLeft: "6px solid var(--accent-pink)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ zIndex: 2 }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
            Client Information Dashboard
          </h1>
        </div>

        <div style={{ display: "flex", gap: "1rem", zIndex: 2 }}>
          <Link href="/groups?action=new" className="btn btn-primary">
            <Plus size={18} />
            <span>Add Group</span>
          </Link>
          <Link href="/vendors?action=new" className="btn btn-blue">
            <Plus size={18} />
            <span>Add Vendor</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick Search & Direct Jump Navigation */}
      <DashboardQuickNav
        groups={clients.map((c) => ({
          id: c.id,
          name: c.name,
          npiNumber: c.npiNumber,
          specialty: c.specialty,
          status: c.status,
        }))}
        vendors={vendors.map((v) => ({
          id: v.id,
          name: v.name,
          vendorType: v.vendorType,
          status: v.status,
        }))}
        hasPendingTerm={pendingTermCount > 0}
        pendingTermCount={pendingTermCount}
      />

      {/* 3. Executive KPI Metric Cards */}
      <DashboardKpis
        totalCensus={totalCensus}
        singleCensus={singleCensus}
        emp1Census={emp1Census}
        familyCensus={familyCensus}
        activeGroupCount={activeGroupCount}
        pendingTermCount={pendingTermCount}
        totalGroupCount={clients.length}
        totalVendors={vendors.length}
        totalAssociations={associationCount}
      />

      {/* 4. Benefits & Stop-Loss Portfolio Analytics */}
      <DashboardBenefitsAnalytics
        carrierCounts={carrierCounts}
        pbmCounts={pbmCounts}
        pbmAsrContractCount={pbmAsrContractCount}
        totalCensus={totalCensus}
        singleCensus={singleCensus}
        emp1Census={emp1Census}
        familyCensus={familyCensus}
        totalCurrentPlans={activePlanCount}
      />

      {/* 5. Strategic Directory Insights (Top Utilized Vendors & Largest Groups) */}
      <DashboardDirectoryInsights topVendors={topVendors} topGroups={topGroups} />
    </div>
  );
}
