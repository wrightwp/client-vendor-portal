import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, taxId } = await request.json();

    const cleanTaxId = (taxId || "").replace(/[^a-zA-Z0-9]/g, "");
    const cleanName = (name || "").trim().toLowerCase();

    // Query existing vendors
    const allVendors = await db.vendor.findMany();

    const matches = allVendors.filter((v) => {
      const dbTaxId = (v.taxId || "").replace(/[^a-zA-Z0-9]/g, "");
      const dbName = (v.name || "").trim().toLowerCase();

      // Check for exact Tax ID match
      if (cleanTaxId && dbTaxId && cleanTaxId === dbTaxId) return true;
      // Check for exact Name match
      if (cleanName && dbName && cleanName === dbName) return true;

      return false;
    });

    return NextResponse.json({
      success: true,
      isDuplicate: matches.length > 0,
      matches,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check duplicates" },
      { status: 500 }
    );
  }
}
