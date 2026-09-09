import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || "").trim();

    if (!query) {
      return NextResponse.json({ success: true, clients: [], vendors: [] });
    }

    const [clients, vendors] = await Promise.all([
      db.client.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { taxId: { contains: query } },
            { npiNumber: { contains: query } },
            { phone: { contains: query } },
            { email: { contains: query } },
            { city: { contains: query } },
            { state: { contains: query } },
            { specialty: { contains: query } },
          ],
        },
        include: {
          vendors: {
            include: {
              vendor: true,
            },
          },
        },
        take: 10,
      }),
      db.vendor.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { taxId: { contains: query } },
            { phone: { contains: query } },
            { email: { contains: query } },
            { city: { contains: query } },
            { state: { contains: query } },
            { vendorType: { contains: query } },
          ],
        },
        include: {
          clients: {
            include: {
              client: true,
            },
          },
        },
        take: 10,
      }),
    ]);

    return NextResponse.json({ success: true, clients, vendors });
  } catch (error: any) {
    console.error("Global search error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
