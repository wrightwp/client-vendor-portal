import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { evaluateFuzzyMatch } from "@/lib/similarity";

export async function POST(request: Request) {
  try {
    const { name, taxId, npiNumber } = await request.json();

    const inputData = { name, taxId, npiNumber };

    // Query existing clients
    const allClients = await db.client.findMany();

    const matches: any[] = [];

    for (const client of allClients) {
      const result = evaluateFuzzyMatch(inputData, {
        name: client.name,
        taxId: client.taxId,
        npiNumber: client.npiNumber || undefined,
      });

      if (result.isMatch) {
        matches.push({
          ...client,
          matchReason: result.reason,
          matchScore: Math.round(result.score * 100),
        });
      }
    }

    // Sort by highest match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

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
