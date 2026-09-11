import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSnapshot } from "@/lib/history";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let record = await db.clientBillingEnrollment.findUnique({
      where: { clientId: id },
    });

    if (!record) {
      // Create a blank B&E summary record if it doesn't exist yet
      record = await db.clientBillingEnrollment.create({
        data: { clientId: id },
      });
    }

    return NextResponse.json({ success: true, billingEnrollment: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    let record = await db.clientBillingEnrollment.findUnique({
      where: { clientId: id },
    });

    if (!record) {
      record = await db.clientBillingEnrollment.create({
        data: { clientId: id, ...body },
      });
    } else {
      record = await db.clientBillingEnrollment.update({
        where: { clientId: id },
        data: body,
      });
    }

    // Log history update for client profile
    const client = await db.client.findUnique({
      where: { id },
      include: { billingEnrollment: true },
    });

    if (client) {
      await db.changeHistory.create({
        data: {
          entityType: "CLIENT",
          entityId: id,
          clientId: id,
          action: "UPDATE",
          summary: "Updated Billing & Enrollment Summary (B&E)",
          snapshot: createSnapshot(client),
        },
      });
    }

    return NextResponse.json({ success: true, billingEnrollment: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
