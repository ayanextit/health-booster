import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.size) {
    return NextResponse.json({ error: "ফাইল নির্বাচন করুন" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "শুধুমাত্র JPG, PNG, WebP বা ICO ফাইল আপলোড করুন" },
      { status: 400 }
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "ফাইলের আকার সর্বোচ্চ ২ MB হতে পারে" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const filename = `favicon-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const faviconUrl = `/uploads/${filename}`;

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettings.update({
      where: { id: existing.id },
      data: { faviconUrl },
    });
  } else {
    await prisma.siteSettings.create({ data: { faviconUrl } });
  }

  return NextResponse.json({ url: faviconUrl });
}
