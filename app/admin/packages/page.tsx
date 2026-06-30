export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PackagesClient from "./PackagesClient";

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    include: { product: true },
    orderBy: { price: "asc" },
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <PackagesClient initialPackages={packages} />
      </main>
    </div>
  );
}
