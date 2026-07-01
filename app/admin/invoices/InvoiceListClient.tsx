"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Mail, CheckCircle2, Search, X } from "lucide-react";

interface Invoice {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  customerEmail: string | null;
  packageTitle: string;
  productName: string;
  totalAmount: number;
  status: string;
  updatedAt: string;
}

interface Props {
  invoices: Invoice[];
  totalAmount: number;
  searchQuery: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  Confirmed: { label: "কনফার্ম", className: "bg-green-100 text-green-700" },
  Processing: { label: "প্রসেসিং", className: "bg-blue-100 text-blue-700" },
  Delivered: { label: "ডেলিভারড", className: "bg-purple-100 text-purple-700" },
  Cancelled: { label: "বাতিল", className: "bg-red-100 text-red-700" },
};

export default function InvoiceListClient({ invoices, totalAmount, searchQuery }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchQuery);

  const handleSearch = (value: string) => {
    setSearch(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.replace(`/admin/invoices?${params.toString()}`);
    });
  };

  const clearSearch = () => handleSearch("");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="অর্ডার নং, নাম বা ফোন দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {isPending && (
        <div className="h-1 bg-green-500 animate-pulse" />
      )}

      {invoices.length === 0 ? (
        <div className="py-20 text-center">
          <FileText size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {search ? `"${search}" এর জন্য কোনো ইনভয়েস পাওয়া যায়নি` : "কোনো ইনভয়েস নেই"}
          </p>
          {search && (
            <button onClick={clearSearch} className="mt-2 text-sm text-green-600 hover:underline">
              সব দেখুন
            </button>
          )}
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
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">স্ট্যাটাস</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">মোট</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">তারিখ</th>
                <th className="text-center px-5 py-3.5 font-semibold text-gray-600">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const statusCfg = STATUS_CONFIG[inv.status] ?? {
                  label: inv.status,
                  className: "bg-gray-100 text-gray-600",
                };
                return (
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
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-gray-900">
                      ৳{inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(inv.updatedAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {invoices.length > 0 && (
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            মোট <span className="font-semibold text-gray-700">{invoices.length}</span>টি ইনভয়েস
            {search && <span className="text-gray-400"> (ফিল্টার করা)</span>}
          </p>
          <p className="text-sm text-gray-500">
            মোট বিক্রয়:{" "}
            <span className="font-bold text-green-700">
              ৳{totalAmount.toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
