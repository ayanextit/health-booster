export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import InvoiceListClient from "./InvoiceListClient";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function InvoicesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const search = q?.trim() || "";

  const invoices = await prisma.order.findMany({
    where: {
      status: { not: "Pending" },
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" } },
              { customerName: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  const totalAmount = invoices.reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">ইনভয়েস তালিকা</h1>
          <p className="text-gray-500 text-sm mt-1">
            পেন্ডিং বাদে সব অর্ডারের ইনভয়েস
          </p>
        </div>

        <InvoiceListClient
          invoices={invoices.map((inv) => ({
            id: inv.id,
            orderNumber: inv.orderNumber,
            customerName: inv.customerName,
            phone: inv.phone,
            customerEmail: inv.customerEmail,
            packageTitle: inv.packageTitle,
            productName: inv.productName,
            totalAmount: inv.totalAmount,
            status: inv.status,
            updatedAt: inv.updatedAt.toISOString(),
          }))}
          totalAmount={totalAmount}
          searchQuery={search}
        />
      </main>
    </div>
  );
}
