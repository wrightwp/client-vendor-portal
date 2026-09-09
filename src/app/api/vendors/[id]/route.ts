import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    const vendor = await db.vendor.update({
      where: { id },
      data: body,
      include: {
        clients: {
          include: {
            client: true,
          },
        },
      },
    });

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
