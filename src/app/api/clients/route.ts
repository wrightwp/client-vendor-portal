import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    if (!name || !taxId) {
      return NextResponse.json(
        { success: false, error: "Client Name and Tax ID are required." },
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

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create client" },
      { status: 500 }
    );
  }
}
