import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSnapshot } from "@/lib/history";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search.trim()) {
      const query = search.trim();
      where.OR = [
        { name: { contains: query } },
        { taxId: { contains: query } },
        { npiNumber: { contains: query } },
        { phone: { contains: query } },
        { email: { contains: query } },
        { city: { contains: query } },
        { state: { contains: query } },
        { specialty: { contains: query } },
      ];
    }

    const clients = await db.client.findMany({
      where,
      include: {
        vendors: {
          include: {
            vendor: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, clients });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, taxId, npiNumber, phone, email, address, city, state, zipCode, specialty, notes, status } = body;

    if (!name || !taxId || !npiNumber) {
      return NextResponse.json(
        { success: false, error: "Group Name, Tax ID, and Group Number are required." },
        { status: 400 }
      );
    }

    const cleanInputTaxId = taxId.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanInputNpi = npiNumber.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    const existingClients = await db.client.findMany();
    const exactDuplicate = existingClients.find((c) => {
      const cTax = (c.taxId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const cNpi = (c.npiNumber || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        (cleanInputTaxId && cTax && cleanInputTaxId === cTax) ||
        (cleanInputNpi && cNpi && cleanInputNpi === cNpi)
      );
    });

    if (exactDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: "A Group with this exact Tax ID or Group Number already exists. Duplicate creation is not allowed.",
          existingId: exactDuplicate.id,
        },
        { status: 400 }
      );
    }

    const client = await db.client.create({
      data: {
        name,
        taxId,
        npiNumber: npiNumber || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        specialty: specialty || null,
        notes: notes || null,
        status: status || "ACTIVE",
      },
    });

    await db.changeHistory.create({
      data: {
        entityType: "CLIENT",
        entityId: client.id,
        clientId: client.id,
        action: "CREATE",
        summary: "Initial client profile created",
        snapshot: createSnapshot(client),
      },
    });

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create client" },
      { status: 500 }
    );
  }
}
