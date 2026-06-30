import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.reviewImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ images });
}
