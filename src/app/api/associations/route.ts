import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSnapshot } from "@/lib/history";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, vendorId, notes } = body;

    if (!clientId || !vendorId) {
      return NextResponse.json(
        { success: false, error: "Both Client ID and Vendor ID are required." },
        { status: 400 }
      );
    }

    const association = await db.clientVendor.create({
      data: {
        clientId,
        vendorId,
        notes: notes || null,
      },
      include: {
        client: true,
        vendor: true,
      },
    });

    // Create history records for both Client and Vendor
    await Promise.all([
      db.changeHistory.create({
        data: {
          entityType: "CLIENT",
          entityId: clientId,
          clientId: clientId,
          action: "ASSOCIATION_ADDED",
          summary: `Linked Vendor: ${association.vendor.name}`,
          changes: JSON.stringify([
            { field: "association", label: "Vendor Association", oldValue: null, newValue: association.vendor.name },
          ]),
          snapshot: createSnapshot(association.client),
        },
      }),
      db.changeHistory.create({
        data: {
          entityType: "VENDOR",
          entityId: vendorId,
          vendorId: vendorId,
          action: "ASSOCIATION_ADDED",
          summary: `Linked Client: ${association.client.name}`,
          changes: JSON.stringify([
            { field: "association", label: "Client Association", oldValue: null, newValue: association.client.name },
          ]),
          snapshot: createSnapshot(association.vendor),
        },
      }),
    ]);

    return NextResponse.json({ success: true, association }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating association:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "This Vendor is already associated with this Client." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to link client and vendor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const vendorId = searchParams.get("vendorId");

    if (!clientId || !vendorId) {
      return NextResponse.json(
        { success: false, error: "clientId and vendorId query params are required." },
        { status: 400 }
      );
    }

    const association = await db.clientVendor.findUnique({
      where: {
        clientId_vendorId: {
          clientId,
          vendorId,
        },
      },
      include: {
        client: true,
        vendor: true,
      },
    });

    if (association) {
      await db.clientVendor.delete({
        where: {
          clientId_vendorId: {
            clientId,
            vendorId,
          },
        },
      });

      await Promise.all([
        db.changeHistory.create({
          data: {
            entityType: "CLIENT",
            entityId: clientId,
            clientId: clientId,
            action: "ASSOCIATION_REMOVED",
            summary: `Unlinked Vendor: ${association.vendor.name}`,
            changes: JSON.stringify([
              { field: "association", label: "Vendor Association", oldValue: association.vendor.name, newValue: null },
            ]),
            snapshot: createSnapshot(association.client),
          },
        }),
        db.changeHistory.create({
          data: {
            entityType: "VENDOR",
            entityId: vendorId,
            vendorId: vendorId,
            action: "ASSOCIATION_REMOVED",
            summary: `Unlinked Client: ${association.client.name}`,
            changes: JSON.stringify([
              { field: "association", label: "Client Association", oldValue: association.client.name, newValue: null },
            ]),
            snapshot: createSnapshot(association.vendor),
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true, message: "Association removed successfully." });
  } catch (error: any) {
    console.error("Error removing association:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove association" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { clientId, vendorId, notes } = body;

    if (!clientId || !vendorId) {
      return NextResponse.json(
        { success: false, error: "Both clientId and vendorId are required." },
        { status: 400 }
      );
    }

    const existingAssociation = await db.clientVendor.findUnique({
      where: {
        clientId_vendorId: {
          clientId,
          vendorId,
        },
      },
      include: {
        client: true,
        vendor: true,
      },
    });

    if (!existingAssociation) {
      return NextResponse.json(
        { success: false, error: "Association not found." },
        { status: 404 }
      );
    }

    const oldNotes = existingAssociation.notes || null;
    const newNotes = notes !== undefined ? (notes ? notes.trim() : null) : oldNotes;

    const updatedAssociation = await db.clientVendor.update({
      where: {
        clientId_vendorId: {
          clientId,
          vendorId,
        },
      },
      data: {
        notes: newNotes,
      },
      include: {
        client: true,
        vendor: true,
      },
    });

    if (oldNotes !== newNotes) {
      await db.changeHistory.create({
        data: {
          entityType: "CLIENT",
          entityId: clientId,
          clientId: clientId,
          action: "ASSOCIATION_NOTES_UPDATED",
          summary: `Updated Notes for Vendor: ${existingAssociation.vendor.name}`,
          changes: JSON.stringify([
            {
              field: "associationNotes",
              label: `Vendor Note (${existingAssociation.vendor.name})`,
              oldValue: oldNotes,
              newValue: newNotes,
            },
          ]),
          snapshot: createSnapshot(existingAssociation.client),
        },
      });
    }

    return NextResponse.json({ success: true, association: updatedAssociation });
  } catch (error: any) {
    console.error("Error updating association notes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update association notes" },
      { status: 500 }
    );
  }
}

