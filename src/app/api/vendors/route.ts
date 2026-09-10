import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSnapshot } from "@/lib/history";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const vendorType = searchParams.get("vendorType");
    const status = searchParams.get("status");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (vendorType && vendorType !== "ALL") {
      where.vendorType = vendorType;
    }

    if (search.trim()) {
      const query = search.trim();
      where.OR = [
        { name: { contains: query } },
        { taxId: { contains: query } },
        { phone: { contains: query } },
        { email: { contains: query } },
        { city: { contains: query } },
        { state: { contains: query } },
        { vendorType: { contains: query } },
      ];
    }

    const vendors = await db.vendor.findMany({
      where,
      include: {
        clients: {
          include: {
            client: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, taxId, phone, email, address, city, state, zipCode, vendorType, notes, status } = body;

    if (!name || !taxId) {
      return NextResponse.json(
        { success: false, error: "Vendor Name and Tax ID are required." },
        { status: 400 }
      );
    }

    const vendor = await db.vendor.create({
      data: {
        name,
        taxId,
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        vendorType: vendorType || "GENERAL",
        notes: notes || null,
        status: status || "ACTIVE",
      },
    });

    await db.changeHistory.create({
      data: {
        entityType: "VENDOR",
        entityId: vendor.id,
        vendorId: vendor.id,
        action: "CREATE",
        summary: "Initial vendor profile created",
        snapshot: createSnapshot(vendor),
      },
    });

    return NextResponse.json({ success: true, vendor }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create vendor" },
      { status: 500 }
    );
  }
}
