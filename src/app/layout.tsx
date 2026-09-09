import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Healthcare Client & Vendor Portal",
  description: "Enterprise management system for healthcare groups, vendor repositories, and associations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: "1.75rem 2.5rem", maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
