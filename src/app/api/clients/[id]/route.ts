import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    const client = await db.client.update({
      where: { id },
      data: body,
      include: {
        vendors: {
          include: {
            vendor: true,
          },
        },
      },
    });

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
