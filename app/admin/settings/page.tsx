export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const [siteSettings, paymentSettings, emailSettings] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.paymentSettings.findFirst(),
    prisma.emailSettings.findFirst(),
  ]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <SettingsClient
          initialSite={siteSettings}
          initialPayment={paymentSettings}
          initialEmail={emailSettings}
          productImageUrl={siteSettings?.productImageUrl}
        />
      </main>
    </div>
  );
}
