import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSnapshot } from "@/lib/history";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, title, phone, email, notes } = body;

    const existingContact = await db.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
    }

    const updatedContact = await db.contact.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existingContact.name,
        title: title !== undefined ? (title ? title.trim() : null) : existingContact.title,
        phone: phone !== undefined ? (phone ? phone.trim() : null) : existingContact.phone,
        email: email !== undefined ? (email ? email.trim() : null) : existingContact.email,
        notes: notes !== undefined ? (notes ? notes.trim() : null) : existingContact.notes,
      },
    });

    // Record Change History
    if (existingContact.clientId) {
      const client = await db.client.findUnique({ where: { id: existingContact.clientId } });
      if (client) {
        await db.changeHistory.create({
          data: {
            entityType: "CLIENT",
            entityId: existingContact.clientId,
            clientId: existingContact.clientId,
            action: "CONTACT_UPDATED",
            summary: `Updated Contact: ${updatedContact.name}`,
            changes: JSON.stringify([
              {
                field: "contact",
                label: "Key Contact Updated",
                oldValue: `${existingContact.name}${existingContact.title ? ` (${existingContact.title})` : ""}`,
                newValue: `${updatedContact.name}${updatedContact.title ? ` (${updatedContact.title})` : ""}`,
              },
            ]),
            snapshot: createSnapshot(client),
          },
        });
      }
    } else if (existingContact.vendorId) {
      const vendor = await db.vendor.findUnique({ where: { id: existingContact.vendorId } });
      if (vendor) {
        await db.changeHistory.create({
          data: {
            entityType: "VENDOR",
            entityId: existingContact.vendorId,
            vendorId: existingContact.vendorId,
            action: "CONTACT_UPDATED",
            summary: `Updated Contact: ${updatedContact.name}`,
            changes: JSON.stringify([
              {
                field: "contact",
                label: "Key Contact Updated",
                oldValue: `${existingContact.name}${existingContact.title ? ` (${existingContact.title})` : ""}`,
                newValue: `${updatedContact.name}${updatedContact.title ? ` (${updatedContact.title})` : ""}`,
              },
            ]),
            snapshot: createSnapshot(vendor),
          },
        });
      }
    }

    return NextResponse.json({ success: true, contact: updatedContact });
  } catch (error: any) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contact = await db.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
    }

    await db.contact.delete({
      where: { id },
    });

    // Record Change History
    if (contact.clientId) {
      const client = await db.client.findUnique({ where: { id: contact.clientId } });
      if (client) {
        await db.changeHistory.create({
          data: {
            entityType: "CLIENT",
            entityId: contact.clientId,
            clientId: contact.clientId,
            action: "CONTACT_REMOVED",
            summary: `Removed Contact: ${contact.name}`,
            changes: JSON.stringify([
              {
                field: "contact",
                label: "Key Contact Removed",
                oldValue: `${contact.name}${contact.title ? ` (${contact.title})` : ""}`,
                newValue: null,
              },
            ]),
            snapshot: createSnapshot(client),
          },
        });
      }
    } else if (contact.vendorId) {
      const vendor = await db.vendor.findUnique({ where: { id: contact.vendorId } });
      if (vendor) {
        await db.changeHistory.create({
          data: {
            entityType: "VENDOR",
            entityId: contact.vendorId,
            vendorId: contact.vendorId,
            action: "CONTACT_REMOVED",
            summary: `Removed Contact: ${contact.name}`,
            changes: JSON.stringify([
              {
                field: "contact",
                label: "Key Contact Removed",
                oldValue: `${contact.name}${contact.title ? ` (${contact.title})` : ""}`,
                newValue: null,
              },
            ]),
            snapshot: createSnapshot(vendor),
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Contact deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete contact" },
      { status: 500 }
    );
  }
}
