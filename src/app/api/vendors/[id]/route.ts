import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeDiff, generateDiffSummary, createSnapshot } from "@/lib/history";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vendor = await db.vendor.findUnique({
      where: { id },
      include: {
        clients: {
          include: {
            client: true,
          },
        },
        contacts: {
          orderBy: { createdAt: "asc" },
        },
        history: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vendor });
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

    const existingVendor = await db.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });
    }

    const diffs = computeDiff(existingVendor, body);

    const vendor = await db.vendor.update({
      where: { id },
      data: body,
      include: {
        clients: {
          include: {
            client: true,
          },
        },
        contacts: {
          orderBy: { createdAt: "asc" },
        },
        history: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (diffs.length > 0) {
      const isStatusChange = diffs.some((d) => d.field === "status");
      const action = isStatusChange && diffs.length === 1 ? "STATUS_CHANGE" : "UPDATE";
      const summary = generateDiffSummary(diffs, action);

      await db.changeHistory.create({
        data: {
          entityType: "VENDOR",
          entityId: id,
          vendorId: id,
          action,
          summary,
          changes: JSON.stringify(diffs),
          snapshot: createSnapshot(vendor),
        },
      });

      // Refetch vendor to get updated history list
      const updatedVendor = await db.vendor.findUnique({
        where: { id },
        include: {
          clients: {
            include: {
              client: true,
            },
          },
          history: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return NextResponse.json({ success: true, vendor: updatedVendor });
    }

    return NextResponse.json({ success: true, vendor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.vendor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Vendor deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
