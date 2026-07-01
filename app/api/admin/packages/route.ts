import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { packageSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const packages = await prisma.package.findMany({
    include: { product: true },
    orderBy: { price: "asc" },
  });

  return NextResponse.json(packages);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = packageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const productId = body.productId as string | undefined;
  const resolvedProductId = productId || (await prisma.product.findFirst())?.id;
  if (!resolvedProductId) {
    return NextResponse.json({ error: "No product found" }, { status: 404 });
  }

  const pkg = await prisma.package.create({
    data: { ...parsed.data, productId: resolvedProductId },
  });

  return NextResponse.json(pkg, { status: 201 });
}
