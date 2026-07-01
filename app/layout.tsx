import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await prisma.siteSettings.findFirst();
  const faviconUrl = site?.faviconUrl || "";

  return {
    title: "Health Booster Supplement | হেলদি Weight Gain Support",
    description:
      "Natural Ingredients দিয়ে তৈরি Health Booster Supplement রুচি, হজমশক্তি ও হেলদি weight gain journey support করতে সহায়ক।",
    openGraph: {
      title: "Health Booster Supplement | হেলদি Weight Gain Support",
      description:
        "Natural Ingredients দিয়ে তৈরি Health Booster Supplement রুচি, হজমশক্তি ও হেলদি weight gain journey support করতে সহায়ক।",
      type: "website",
      locale: "bn_BD",
    },
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
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
