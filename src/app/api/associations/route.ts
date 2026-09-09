import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    await db.clientVendor.delete({
      where: {
        clientId_vendorId: {
          clientId,
          vendorId,
        },
      },
    });

    return NextResponse.json({ success: true, message: "Association removed successfully." });
  } catch (error: any) {
    console.error("Error removing association:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove association" },
      { status: 500 }
    );
  }
}
