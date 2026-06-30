export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, OrderStatus, ORDER_STATUSES } from "@/lib/utils";
import type { Order } from "@/app/generated/prisma/client";

interface SearchParams {
  status?: string;
  page?: string;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = params.status || "";
  const page = parseInt(params.page || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-gray-500 text-sm mt-1">মোট {total}টি অর্ডার</p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/admin/orders"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !status
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            সব
          </Link>
          {ORDER_STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/orders?status=${s}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                status === s
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {STATUS_LABELS[s as OrderStatus]}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">কোনো অর্ডার পাওয়া যায়নি</p>
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
                          <span className="font-mono text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.phone}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{order.packageTitle}</td>
                        <td className="px-5 py-4">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {order.paymentMethod === "cod"
                              ? "COD"
                              : order.paymentMethod === "bkash"
                              ? "Bkash"
                              : "Nagad"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                          ৳{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              STATUS_COLORS[order.status as OrderStatus] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {STATUS_LABELS[order.status as OrderStatus] || order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            বিস্তারিত
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    পেজ {page} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Link
                        href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page - 1}`}
                        className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        আগের
                      </Link>
                    )}
                    {page < totalPages && (
                      <Link
                        href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page + 1}`}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700"
                      >
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
