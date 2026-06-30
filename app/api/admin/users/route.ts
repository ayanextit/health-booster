import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function adminOnly(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await adminOnly(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  if (!(await adminOnly(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "নাম, ইমেইল ও পাসওয়ার্ড আবশ্যক" }, { status: 400 });
  }

  const exists = await prisma.adminUser.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "এই ইমেইল ইতিমধ্যে ব্যবহৃত হচ্ছে" }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.adminUser.create({
    data: { name, email, password: hash, role: role || "staff" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  if (!(await adminOnly(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, name, role, password } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const updateData: { name?: string; role?: string; password?: string } = {};
  if (name) updateData.name = name;
  if (role) updateData.role = role;
  if (password) {
    if (password.length < 6) return NextResponse.json({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর" }, { status: 400 });
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest) {
  const session = await adminOnly(req);
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (id === session.userId) {
    return NextResponse.json({ error: "নিজেকে ডিলিট করা যাবে না" }, { status: 400 });
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
