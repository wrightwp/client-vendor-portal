import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ groupNumber: string }> }
) {
  try {
    const { groupNumber } = await params;
    if (!groupNumber) {
      return NextResponse.json(
        { success: false, error: "Group Number parameter is required" },
        { status: 400 }
      );
    }

    const rawNumber = decodeURIComponent(groupNumber).trim();
    const cleanNumber = rawNumber.toLowerCase().replace(/[^a-z0-9]/g, "");

    const allClients = await db.client.findMany({
      include: {
        vendors: {
          include: {
            vendor: true,
          },
        },
        contacts: true,
        history: {
          orderBy: { createdAt: "desc" },
        },
        billingEnrollments: {
          orderBy: { planYear: "desc" },
        },
      },
    });

    const matchedClient = allClients.find((c) => {
      if (!c.npiNumber) return false;
      const cNpiClean = c.npiNumber.toLowerCase().replace(/[^a-z0-9]/g, "");
      return c.npiNumber.trim() === rawNumber || (cNpiClean && cNpiClean === cleanNumber);
    });

    if (!matchedClient) {
      return NextResponse.json(
        { success: false, error: `No group found with Group # '${rawNumber}'` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, client: matchedClient });
  } catch (error: any) {
    console.error("Error looking up client by Group #:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to lookup group by Group Number" },
      { status: 500 }
    );
  }
}
