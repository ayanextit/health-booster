import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { paymentSettingsSchema, siteSettingsSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [siteSettings, paymentSettings] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.paymentSettings.findFirst(),
  ]);

  return NextResponse.json({ siteSettings, paymentSettings });
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, data } = body;

  if (type === "payment") {
    const parsed = paymentSettingsSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const existing = await prisma.paymentSettings.findFirst();
    const settings = existing
      ? await prisma.paymentSettings.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.paymentSettings.create({ data: parsed.data });

    return NextResponse.json(settings);
  }

  if (type === "site") {
    const parsed = siteSettingsSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const existing = await prisma.siteSettings.findFirst();
    const settings = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.siteSettings.create({ data: parsed.data });

    return NextResponse.json(settings);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
