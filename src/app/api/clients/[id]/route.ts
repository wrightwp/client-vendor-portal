import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeDiff, generateDiffSummary, createSnapshot } from "@/lib/history";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await db.client.findUnique({
      where: { id },
      include: {
        vendors: {
          include: {
            vendor: true,
          },
        },
        contacts: {
          orderBy: { createdAt: "asc" },
        },
        history: {
          orderBy: { createdAt: "desc" },
        },
        billingEnrollments: {
          orderBy: { planYear: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, client });
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

    const existingClient = await db.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    const diffs = computeDiff(existingClient, body);

    const client = await db.client.update({
      where: { id },
      data: body,
      include: {
        vendors: {
          include: {
            vendor: true,
          },
        },
        contacts: {
          orderBy: { createdAt: "asc" },
        },
        history: {
          orderBy: { createdAt: "desc" },
        },
        billingEnrollments: {
          orderBy: { planYear: "desc" },
        },
      },
    });

    if (diffs.length > 0) {
      const isStatusChange = diffs.some((d) => d.field === "status");
      const action = isStatusChange && diffs.length === 1 ? "STATUS_CHANGE" : "UPDATE";
      const summary = generateDiffSummary(diffs, action);

      await db.changeHistory.create({
        data: {
          entityType: "CLIENT",
          entityId: id,
          clientId: id,
          action,
          summary,
          changes: JSON.stringify(diffs),
          snapshot: createSnapshot(client),
        },
      });

      // Refetch client to get updated history list
      const updatedClient = await db.client.findUnique({
        where: { id },
        include: {
          vendors: {
            include: {
              vendor: true,
            },
          },
          history: {
            orderBy: { createdAt: "desc" },
          },
          billingEnrollments: {
          orderBy: { planYear: "desc" },
        },
        },
      });

      return NextResponse.json({ success: true, client: updatedClient });
    }

    return NextResponse.json({ success: true, client });
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
    await db.client.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Client deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
