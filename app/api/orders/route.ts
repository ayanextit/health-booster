import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/server-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const pkg = await prisma.package.findUnique({
      where: { id: data.packageId },
      include: { product: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const siteSettings = await prisma.siteSettings.findFirst();
    const deliveryCharge =
      data.deliveryArea === "inside_dhaka"
        ? (siteSettings?.insideDhakaCharge ?? 80)
        : (siteSettings?.outsideDhakaCharge ?? 130);

    const productPrice = pkg.salePrice ?? pkg.price;
    const totalAmount = productPrice + deliveryCharge;
    const orderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail || null,
        phone: data.phone,
        address: data.address,
        area: "",
        district: "",
        productName: pkg.product.name,
        packageId: pkg.id,
        packageTitle: pkg.title,
        quantity: 1,
        productPrice,
        deliveryArea: data.deliveryArea,
        deliveryCharge,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId || null,
        totalAmount,
        note: data.note || null,
        status: "Pending",
      },
    });

    return NextResponse.json(
      { success: true, orderNumber: order.orderNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
