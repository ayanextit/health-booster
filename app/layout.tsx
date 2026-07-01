import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import fs from "fs";
import path from "path";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const BASE_META = {
  title: "Health Booster Supplement | হেলদি Weight Gain Support",
  description:
    "Natural Ingredients দিয়ে তৈরি Health Booster Supplement রুচি, হজমশক্তি ও হেলদি weight gain journey support করতে সহায়ক।",
  openGraph: {
    title: "Health Booster Supplement | হেলদি Weight Gain Support",
    description:
      "Natural Ingredients দিয়ে তৈরি Health Booster Supplement রুচি, হজমশক্তি ও হেলদি weight gain journey support করতে সহায়ক।",
    type: "website" as const,
    locale: "bn_BD",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  let faviconHref = "/uploads/site-favicon.png";
  try {
    const filePath = path.join(process.cwd(), "public", "uploads", "site-favicon.png");
    const stat = fs.statSync(filePath);
    faviconHref = `/uploads/site-favicon.png?v=${Math.floor(stat.mtimeMs)}`;
  } catch {
    // file not uploaded yet — use plain path (browser will 404 gracefully)
  }

  return {
    ...BASE_META,
    icons: { icon: faviconHref },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
