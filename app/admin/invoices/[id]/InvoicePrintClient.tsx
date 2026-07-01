"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function InvoicePrintClient({
  html,
  orderNumber,
}: {
  html: string;
  orderNumber: string;
}) {
  return (
    <>
      {/* Top bar — hidden on print */}
      <div className="print:hidden fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <Link
          href="/admin/invoices"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          ইনভয়েস তালিকা
        </Link>
        <span className="text-sm font-semibold text-gray-700">
          Invoice — {orderNumber}
        </span>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Printer size={15} />
          Print / PDF সেভ করুন
        </button>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { margin: 0; }
          @page { margin: 0; size: A4; }
        }
      `}</style>

      {/* Invoice HTML (same as email) */}
      <div
        className="pt-14 print:pt-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
