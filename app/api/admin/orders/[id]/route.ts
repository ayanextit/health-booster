import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/utils";
import { sendInvoiceEmail } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  if (status === "Confirmed" && order.customerEmail) {
    sendInvoiceEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      phone: order.phone,
      address: order.address,
      packageTitle: order.packageTitle,
      productName: order.productName,
      quantity: order.quantity,
      productPrice: order.productPrice,
      deliveryArea: order.deliveryArea,
      deliveryCharge: order.deliveryCharge,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId,
      createdAt: order.createdAt,
    }).catch((err) => console.error("Invoice email failed:", err));
  }

  return NextResponse.json(order);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.order.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
