import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function ensureDefaultAdmin() {
  const count = await prisma.adminUser.count();
  if (count === 0) {
    const email = process.env.ADMIN_EMAIL || "admin@healthbooster.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@12345";
    const hash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: { name: "Super Admin", email, password: hash, role: "admin" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    await ensureDefaultAdmin();

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await signToken({
      email: user.email,
      role: user.role,
      userId: user.id,
      name: user.name,
    });

    const response = NextResponse.json({ success: true, role: user.role });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
