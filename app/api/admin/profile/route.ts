import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function auth(req: NextRequest) {
  return await getAdminSessionFromRequest(req);
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId as string },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, currentPassword, newPassword } = await req.json();
    const userId = session.userId as string;

    const user = await prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updateData: { name?: string; password?: string } = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "বর্তমান পাসওয়ার্ড দিন" }, { status: 400 });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: "বর্তমান পাসওয়ার্ড সঠিক নয়" }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে" }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "কোনো পরিবর্তন নেই" }, { status: 400 });
    }

    await prisma.adminUser.update({ where: { id: userId }, data: updateData });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
