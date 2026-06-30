import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const images = await prisma.reviewImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ images });
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const image = await prisma.reviewImage.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (image.imageUrl.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", image.imageUrl);
    await unlink(filePath).catch(() => {});
  }

  await prisma.reviewImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
