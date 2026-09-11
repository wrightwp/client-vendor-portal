import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSnapshot } from "@/lib/history";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let records = await db.clientBillingEnrollment.findMany({
      where: { clientId: id },
      orderBy: { planYear: "desc" },
    });

    if (records.length === 0) {
      // Create a blank B&E summary record for current year 2026 if none exists yet
      const newRecord = await db.clientBillingEnrollment.create({
        data: {
          clientId: id,
          planYear: "2026",
          isCurrent: true,
        },
      });
      records = [newRecord];
    }

    const currentRecord = records.find((r) => r.isCurrent) || records[0];

    return NextResponse.json({
      success: true,
      billingEnrollments: records,
      billingEnrollment: currentRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await params;
    const body = await request.json();

    const { id: recordId, planYear, isCurrent, ...updateData } = body;

    let targetPlanYear = planYear || "2026";

    // If making this record current, set isCurrent = false for all other plan years of this client
    if (isCurrent) {
      await db.clientBillingEnrollment.updateMany({
        where: { clientId },
        data: { isCurrent: false },
      });
    }

    let record;
    if (recordId) {
      record = await db.clientBillingEnrollment.update({
        where: { id: recordId },
        data: {
          planYear: targetPlanYear,
          isCurrent: isCurrent ?? false,
          ...updateData,
        },
      });
    } else {
      // Check if record exists for clientId and targetPlanYear
      const existing = await db.clientBillingEnrollment.findFirst({
        where: { clientId, planYear: targetPlanYear },
      });

      if (existing) {
        record = await db.clientBillingEnrollment.update({
          where: { id: existing.id },
          data: {
            isCurrent: isCurrent ?? existing.isCurrent,
            ...updateData,
          },
        });
      } else {
        record = await db.clientBillingEnrollment.create({
          data: {
            clientId,
            planYear: targetPlanYear,
            isCurrent: isCurrent ?? true,
            ...updateData,
          },
        });
      }
    }

    // Refetch all records for this client sorted by planYear desc
    const allRecords = await db.clientBillingEnrollment.findMany({
      where: { clientId },
      orderBy: { planYear: "desc" },
    });

    // Log history update for client profile
    const client = await db.client.findUnique({
      where: { id: clientId },
      include: {
        billingEnrollments: {
          orderBy: { planYear: "desc" },
        },
      },
    });

    if (client) {
      await db.changeHistory.create({
        data: {
          entityType: "CLIENT",
          entityId: clientId,
          clientId: clientId,
          action: "UPDATE",
          summary: `Updated Billing & Enrollment Summary (Plan Year ${record.planYear})`,
          snapshot: createSnapshot(client),
        },
      });
    }

    return NextResponse.json({
      success: true,
      billingEnrollment: record,
      billingEnrollments: allRecords,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
