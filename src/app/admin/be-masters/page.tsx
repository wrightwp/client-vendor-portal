import React from "react";
import AdminHeader from "@/components/AdminHeader";
import BEMastersView from "@/components/BEMastersView";

export const metadata = {
  title: "B&E Masters | Admin Workspace | Client Vendor Portal",
  description: "Master records management for Group Billing and Enrollment data across all client accounts.",
};

export default function BEMastersPage() {
  return (
    <main className="container" style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}>
      <AdminHeader
        title="Admin Workspace"
        subtitle="Global administrative controls and master record management"
      />
      <BEMastersView />
    </main>
  );
}
