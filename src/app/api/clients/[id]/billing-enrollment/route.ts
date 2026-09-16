import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createSnapshot,
  computeBillingEnrollmentDiff,
  generateBillingEnrollmentDiffSummary,
} from "@/lib/history";

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
      const compositeTemplate = await db.bEMasterTemplate.findUnique({
        where: { type: "COMPOSITE" },
      });

      // Create a default B&E record with latest COMPOSITE master template from database
      const newRecord = await db.clientBillingEnrollment.create({
        data: {
          clientId: id,
          planYear: "2026",
          isCurrent: true,
          adminMasterType: "COMPOSITE",
          adminSections: compositeTemplate?.sections || null,
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

    const { id: recordId, planYear, isCurrent, createdAt, updatedAt, client: bodyClient, clientId: bodyClientId, ...updateData } = body;

    let targetPlanYear = planYear || "2026";

    // Find existing record for diff comparison
    let existingRecord = null;
    if (recordId) {
      existingRecord = await db.clientBillingEnrollment.findUnique({
        where: { id: recordId },
      });
    } else {
      existingRecord = await db.clientBillingEnrollment.findFirst({
        where: { clientId, planYear: targetPlanYear },
      });
    }

    const isNewPlanYear = !existingRecord;

    // Compute field-level diffs
    const diffs = computeBillingEnrollmentDiff(existingRecord, {
      ...updateData,
      planYear: targetPlanYear,
      ...(isCurrent !== undefined ? { isCurrent } : {}),
    });

    const summary = generateBillingEnrollmentDiffSummary(diffs, targetPlanYear, isNewPlanYear);

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
      if (existingRecord) {
        record = await db.clientBillingEnrollment.update({
          where: { id: existingRecord.id },
          data: {
            isCurrent: isCurrent ?? existingRecord.isCurrent,
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

    // Log history update for client profile if there are changes or new plan year
    const client = await db.client.findUnique({
      where: { id: clientId },
      include: {
        billingEnrollments: {
          orderBy: { planYear: "desc" },
        },
      },
    });

    if (client && (diffs.length > 0 || isNewPlanYear)) {
      await db.changeHistory.create({
        data: {
          entityType: "CLIENT",
          entityId: clientId,
          clientId: clientId,
          action: isNewPlanYear ? "CREATE" : "UPDATE",
          summary,
          changes: JSON.stringify(diffs),
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
