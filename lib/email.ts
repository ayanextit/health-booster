import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

async function getSmtpConfig() {
  const db = await prisma.emailSettings.findFirst();
  if (db && db.smtpHost && db.smtpUser && db.smtpPass) {
    return { host: db.smtpHost, port: db.smtpPort, secure: db.smtpSecure, user: db.smtpUser, pass: db.smtpPass, fromName: db.fromName, fromEmail: db.fromEmail };
  }
  // fallback to env vars
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER, pass: process.env.SMTP_PASS,
      fromName: process.env.SMTP_FROM_NAME || "Health Booster",
      fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    };
  }
  return null;
}

interface InvoiceData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  packageTitle: string;
  productName: string;
  quantity: number;
  productPrice: number;
  deliveryArea: string;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  transactionId?: string | null;
  createdAt: Date;
}

function paymentLabel(method: string) {
  if (method === "bkash") return "বিকাশ";
  if (method === "nagad") return "নগদ";
  return "Cash on Delivery";
}

function deliveryLabel(area: string) {
  return area === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে";
}

function invoiceHtml(d: InvoiceData): string {
  const date = new Date(d.createdAt).toLocaleDateString("bn-BD", {
    year: "numeric", month: "long", day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Invoice - ${d.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px 40px;text-align:center;">
          <p style="margin:0 0 4px;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;">🌿 Health Booster</p>
          <p style="margin:0;font-size:13px;color:#bbf7d0;">Natural Health Supplement</p>
        </td>
      </tr>

      <!-- Invoice Title -->
      <tr>
        <td style="padding:28px 40px 0;border-bottom:2px solid #f0fdf4;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#111827;">অর্ডার নিশ্চিতকরণ</p>
                <p style="margin:0;font-size:13px;color:#6b7280;">আপনার অর্ডার কনফার্ম করা হয়েছে</p>
              </td>
              <td align="right">
                <p style="margin:0 0 2px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Invoice No.</p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#16a34a;">${d.orderNumber}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">${date}</p>
              </td>
            </tr>
          </table>
          <div style="height:20px;"></div>
        </td>
      </tr>

      <!-- Customer Info -->
      <tr>
        <td style="padding:24px 40px;">
          <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">গ্রাহকের তথ্য</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-bottom:8px;">
                <p style="margin:0 0 2px;font-size:12px;color:#9ca3af;">নাম</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${d.customerName}</p>
              </td>
              <td width="50%" style="padding-bottom:8px;">
                <p style="margin:0 0 2px;font-size:12px;color:#9ca3af;">মোবাইল</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${d.phone}</p>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <p style="margin:0 0 2px;font-size:12px;color:#9ca3af;">ডেলিভারি ঠিকানা</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${d.address}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Order Items -->
      <tr>
        <td style="padding:0 40px 24px;">
          <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">অর্ডার বিবরণ</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr style="background:#f9fafb;">
              <th align="left" style="padding:10px 16px;font-size:12px;color:#6b7280;font-weight:600;">পণ্য</th>
              <th align="center" style="padding:10px 16px;font-size:12px;color:#6b7280;font-weight:600;">পরিমাণ</th>
              <th align="right" style="padding:10px 16px;font-size:12px;color:#6b7280;font-weight:600;">মূল্য</th>
            </tr>
            <tr style="border-top:1px solid #e5e7eb;">
              <td style="padding:14px 16px;">
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${d.productName}</p>
                <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">${d.packageTitle}</p>
              </td>
              <td align="center" style="padding:14px 16px;font-size:14px;color:#374151;">${d.quantity}</td>
              <td align="right" style="padding:14px 16px;font-size:14px;font-weight:600;color:#374151;">৳${d.productPrice.toLocaleString()}</td>
            </tr>
            <tr style="border-top:1px solid #e5e7eb;background:#fafafa;">
              <td colspan="2" style="padding:10px 16px;font-size:13px;color:#6b7280;">ডেলিভারি চার্জ (${deliveryLabel(d.deliveryArea)})</td>
              <td align="right" style="padding:10px 16px;font-size:13px;color:#374151;">৳${d.deliveryCharge}</td>
            </tr>
            <tr style="border-top:2px solid #e5e7eb;background:#f0fdf4;">
              <td colspan="2" style="padding:14px 16px;font-size:15px;font-weight:700;color:#111827;">মোট পরিমাণ</td>
              <td align="right" style="padding:14px 16px;font-size:18px;font-weight:800;color:#16a34a;">৳${d.totalAmount.toLocaleString()}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Payment Info -->
      <tr>
        <td style="padding:0 40px 24px;">
          <table width="100%" cellpadding="12" cellspacing="0" style="background:#f9fafb;border-radius:12px;">
            <tr>
              <td>
                <p style="margin:0 0 2px;font-size:12px;color:#9ca3af;">পেমেন্ট পদ্ধতি</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${paymentLabel(d.paymentMethod)}</p>
              </td>
              ${d.transactionId ? `
              <td align="right">
                <p style="margin:0 0 2px;font-size:12px;color:#9ca3af;">Transaction ID</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${d.transactionId}</p>
              </td>` : ""}
            </tr>
          </table>
        </td>
      </tr>

      <!-- Status Badge -->
      <tr>
        <td style="padding:0 40px 32px;text-align:center;">
          <div style="display:inline-block;background:#dcfce7;border:1px solid #86efac;border-radius:999px;padding:8px 24px;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#15803d;">✅ অর্ডার কনফার্ম করা হয়েছে</p>
          </div>
          <p style="margin:16px 0 0;font-size:13px;color:#6b7280;">আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে।</p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে। ধন্যবাদ Health Booster বেছে নেওয়ার জন্য।</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function sendInvoiceEmail(data: InvoiceData): Promise<void> {
  const cfg = await getSmtpConfig();
  if (!cfg) {
    console.warn("SMTP not configured — skipping invoice email");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  await transporter.sendMail({
    from: `"${cfg.fromName}" <${cfg.fromEmail || cfg.user}>`,
    to: data.customerEmail,
    subject: `✅ অর্ডার কনফার্ম — ${data.orderNumber} | Health Booster`,
    html: invoiceHtml(data),
  });
}
