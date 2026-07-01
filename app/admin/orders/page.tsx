export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, OrderStatus, ORDER_STATUSES } from "@/lib/utils";
import type { Order } from "@/app/generated/prisma/client";
import OrdersSearchBar from "@/components/admin/OrdersSearchBar";

interface SearchParams {
  status?: string;
  page?: string;
  q?: string;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = params.status || "";
  const q = params.q?.trim() || "";
  const page = parseInt(params.page || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const buildHref = (overrides: Partial<SearchParams>) => {
    const p: Record<string, string> = {};
    if (status) p.status = status;
    if (q) p.q = q;
    if (page > 1) p.page = String(page);
    Object.assign(p, overrides);
    Object.keys(p).forEach((k) => !p[k] && delete p[k]);
    const qs = new URLSearchParams(p).toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-gray-500 text-sm mt-1">মোট {total}টি অর্ডার{q ? ` — "${q}" এর ফলাফল` : ""}</p>
        </div>

        {/* Search + Status Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <OrdersSearchBar defaultValue={q} status={status} />
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref({ status: "", page: "1" })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !status ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              সব
            </Link>
            {ORDER_STATUSES.map((s) => (
              <Link
                key={s}
                href={buildHref({ status: s, page: "1" })}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  status === s ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {STATUS_LABELS[s as OrderStatus]}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">{q ? `"${q}" এর জন্য কোনো অর্ডার পাওয়া যায়নি` : "কোনো অর্ডার পাওয়া যায়নি"}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3">অর্ডার নং</th>
                      <th className="px-5 py-3">গ্রাহক</th>
                      <th className="px-5 py-3">প্যাকেজ</th>
                      <th className="px-5 py-3">পেমেন্ট</th>
                      <th className="px-5 py-3">মোট</th>
                      <th className="px-5 py-3">স্ট্যাটাস</th>
                      <th className="px-5 py-3">তারিখ</th>
                      <th className="px-5 py-3">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order: Order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-medium text-gray-900">{order.orderNumber}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.phone}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{order.packageTitle}</td>
                        <td className="px-5 py-4">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {order.paymentMethod === "cod" ? "COD" : order.paymentMethod === "bkash" ? "Bkash" : "Nagad"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">৳{order.totalAmount.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status as OrderStatus] || "bg-gray-100 text-gray-800"}`}>
                            {STATUS_LABELS[order.status as OrderStatus] || order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/admin/orders/${order.id}`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                            বিস্তারিত
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">পেজ {page} / {totalPages}</p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Link href={buildHref({ page: String(page - 1) })} className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                        আগের
                      </Link>
                    )}
                    {page < totalPages && (
                      <Link href={buildHref({ page: String(page + 1) })} className="px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700">
                        পরের
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
