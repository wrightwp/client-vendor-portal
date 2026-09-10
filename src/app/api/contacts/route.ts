import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSnapshot } from "@/lib/history";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, title, phone, email, notes, clientId, vendorId } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Contact Name is required." },
        { status: 400 }
      );
    }

    if (!clientId && !vendorId) {
      return NextResponse.json(
        { success: false, error: "Either clientId or vendorId is required." },
        { status: 400 }
      );
    }

    const contact = await db.contact.create({
      data: {
        name: name.trim(),
        title: title ? title.trim() : null,
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        notes: notes ? notes.trim() : null,
        clientId: clientId || null,
        vendorId: vendorId || null,
      },
    });

    // Record Change History
    if (clientId) {
      const client = await db.client.findUnique({ where: { id: clientId } });
      if (client) {
        await db.changeHistory.create({
          data: {
            entityType: "CLIENT",
            entityId: clientId,
            clientId,
            action: "CONTACT_ADDED",
            summary: `Added Contact: ${contact.name}${contact.title ? ` (${contact.title})` : ""}`,
            changes: JSON.stringify([
              {
                field: "contact",
                label: "Key Contact Added",
                oldValue: null,
                newValue: `${contact.name}${contact.title ? ` - ${contact.title}` : ""}`,
              },
            ]),
            snapshot: createSnapshot(client),
          },
        });
      }
    } else if (vendorId) {
      const vendor = await db.vendor.findUnique({ where: { id: vendorId } });
      if (vendor) {
        await db.changeHistory.create({
          data: {
            entityType: "VENDOR",
            entityId: vendorId,
            vendorId,
            action: "CONTACT_ADDED",
            summary: `Added Contact: ${contact.name}${contact.title ? ` (${contact.title})` : ""}`,
            changes: JSON.stringify([
              {
                field: "contact",
                label: "Key Contact Added",
                oldValue: null,
                newValue: `${contact.name}${contact.title ? ` - ${contact.title}` : ""}`,
              },
            ]),
            snapshot: createSnapshot(vendor),
          },
        });
      }
    }

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create contact" },
      { status: 500 }
    );
  }
}
