import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const records = await db.clientBillingEnrollment.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            npiNumber: true,
            taxId: true,
            city: true,
            state: true,
            status: true,
          },
        },
      },
      orderBy: [
        { client: { name: "asc" } },
        { planYear: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
