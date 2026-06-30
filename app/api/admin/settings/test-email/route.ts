import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cfg = await prisma.emailSettings.findFirst();
  if (!cfg || !cfg.smtpHost || !cfg.smtpUser || !cfg.smtpPass) {
    return NextResponse.json({ error: "SMTP সেটিংস কনফিগার করা হয়নি" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.smtpHost,
      port: cfg.smtpPort,
      secure: cfg.smtpSecure,
      auth: { user: cfg.smtpUser, pass: cfg.smtpPass },
    });

    await transporter.sendMail({
      from: `"${cfg.fromName}" <${cfg.fromEmail || cfg.smtpUser}>`,
      to: session.email as string,
      subject: "Health Booster — SMTP টেস্ট ইমেইল",
      html: `<p>SMTP সংযোগ সফল! এই ইমেইলটি Health Booster Admin থেকে পাঠানো হয়েছে।</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
