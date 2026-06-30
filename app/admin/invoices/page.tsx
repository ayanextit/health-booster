export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { FileText, Mail, CheckCircle2 } from "lucide-react";

export default async function InvoicesPage() {
  const invoices = await prisma.order.findMany({
    where: { status: "Confirmed" },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">ইনভয়েস তালিকা</h1>
          <p className="text-gray-500 text-sm mt-1">কনফার্ম করা সব অর্ডারের ইনভয়েস</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="py-20 text-center">
              <FileText size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">এখনো কোনো কনফার্ম অর্ডার নেই</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">অর্ডার নং</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">গ্রাহক</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">ইমেইল</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">প্যাকেজ</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-600">মোট</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">তারিখ</th>
                    <th className="text-center px-5 py-3.5 font-semibold text-gray-600">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-bold text-green-700">{inv.orderNumber}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{inv.customerName}</p>
                        <p className="text-gray-400 text-xs">{inv.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        {inv.customerEmail ? (
                          <span className="text-gray-700">{inv.customerEmail}</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700">{inv.packageTitle}</p>
                        <p className="text-gray-400 text-xs">{inv.productName}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-gray-900">
                        ৳{inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {new Date(inv.updatedAt).toLocaleDateString("bn-BD", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {inv.customerEmail ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle2 size={13} />
                            পাঠানো
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-300 text-xs">
                            <Mail size={13} />
                            নেই
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {invoices.length > 0 && (
            <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                মোট <span className="font-semibold text-gray-700">{invoices.length}</span>টি ইনভয়েস
              </p>
              <p className="text-sm text-gray-500">
                মোট বিক্রয়:{" "}
                <span className="font-bold text-green-700">
                  ৳{invoices.reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
