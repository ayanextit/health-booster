export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import type { Order } from "@/app/generated/prisma/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ShoppingCart, Clock, CheckCircle2, Truck, TrendingUp } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, OrderStatus } from "@/lib/utils";

async function getDashboardData() {
  const [totalOrders, pendingOrders, confirmedOrders, deliveredOrders, orders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "Pending" } }),
      prisma.order.count({ where: { status: "Confirmed" } }),
      prisma.order.count({ where: { status: "Delivered" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  const salesResult = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: { notIn: ["Cancelled"] } },
  });

  return {
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    totalSales: salesResult._sum.totalAmount ?? 0,
    recentOrders: orders,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      label: "মোট অর্ডার",
      value: data.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      label: "পেন্ডিং",
      value: data.pendingOrders,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "কনফার্ম",
      value: data.confirmedOrders,
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      label: "ডেলিভারড",
      value: data.deliveredOrders,
      icon: Truck,
      color: "bg-purple-500",
    },
    {
      label: "মোট বিক্রয়",
      value: `৳${data.totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড</h1>
          <p className="text-gray-500 text-sm mt-1">Health Booster Admin Overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">সাম্প্রতিক অর্ডার</h2>
            <Link
              href="/admin/orders"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              সব দেখুন →
            </Link>
          </div>

          {data.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
              <p>এখনো কোনো অর্ডার নেই</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3">অর্ডার নং</th>
                    <th className="px-5 py-3">গ্রাহক</th>
                    <th className="px-5 py-3">প্যাকেজ</th>
                    <th className="px-5 py-3">মোট</th>
                    <th className="px-5 py-3">স্ট্যাটাস</th>
                    <th className="px-5 py-3">তারিখ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentOrders.map((order: Order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.phone}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{order.packageTitle}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        ৳{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status as OrderStatus] || "bg-gray-100 text-gray-800"}`}
                        >
                          {STATUS_LABELS[order.status as OrderStatus] || order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
