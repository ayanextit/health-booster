export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductsClient from "@/components/admin/ProductsClient";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { packages: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
        <ProductsClient initialProducts={products as any} />
      </main>
    </div>
  );
}
