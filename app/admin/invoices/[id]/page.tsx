export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { invoiceHtml } from "@/lib/email";
import InvoicePrintClient from "./InvoicePrintClient";

export default async function InvoicePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();

  const html = invoiceHtml({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail ?? "",
    phone: order.phone,
    address: order.address,
    area: order.area,
    district: order.district,
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
  });

  return <InvoicePrintClient html={html} orderNumber={order.orderNumber} />;
}
