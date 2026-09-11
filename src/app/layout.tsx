import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Group & Vendor Portal",
  description: "Enterprise management system for groups, vendors, and associations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Navbar />
        <main style={{ padding: "1.75rem 2.5rem", maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
