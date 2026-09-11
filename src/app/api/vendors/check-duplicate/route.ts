import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { evaluateFuzzyMatch } from "@/lib/similarity";

export async function POST(request: Request) {
  try {
    const { name, taxId } = await request.json();

    const inputData = { name, taxId };

    // Query existing vendors
    const allVendors = await db.vendor.findMany();

    const matches: any[] = [];

    for (const vendor of allVendors) {
      const result = evaluateFuzzyMatch(inputData, {
        name: vendor.name,
        taxId: vendor.taxId,
      });

      if (result.isMatch) {
        matches.push({
          ...vendor,
          matchReason: result.reason,
          matchScore: Math.round(result.score * 100),
          isExactTaxId: result.isExactTaxId || false,
          isExactGroupNumber: false,
          isExactMatch: result.isExactMatch || false,
        });
      }
    }

    // Sort by highest match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    const hasExactMatch = matches.some((m) => m.isExactMatch);

    return NextResponse.json({
      success: true,
      isDuplicate: matches.length > 0,
      hasExactMatch,
      matches,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check duplicates" },
      { status: 500 }
    );
  }
}
