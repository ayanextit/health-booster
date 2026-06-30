import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [siteSettings, paymentSettings, packages] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.paymentSettings.findFirst(),
      prisma.package.findMany({
        where: { status: "active" },
        orderBy: { price: "asc" },
      }),
    ]);

    return NextResponse.json({ siteSettings, paymentSettings, packages });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
