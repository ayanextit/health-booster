"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  MapPin,
  Phone,
  CreditCard,
  Package,
} from "lucide-react";
import { ORDER_STATUSES, STATUS_COLORS, STATUS_LABELS, OrderStatus } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  district: string;
  productName: string;
  packageTitle: string;
  quantity: number;
  productPrice: number;
  deliveryArea: string;
  deliveryCharge: number;
  paymentMethod: string;
  transactionId: string | null;
  totalAmount: number;
  note: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function OrderDetailClient({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setStatus(newStatus);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("এই অর্ডারটি মুছে ফেলতে চান?")) return;
    setDeleting(true);
    await fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" });
    router.push("/admin/orders");
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              অর্ডার #{order.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              {new Date(order.createdAt).toLocaleString("bn-BD")}
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors"
        >
          <Trash2 size={16} />
          {deleting ? "মুছছে..." : "মুছুন"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone size={18} className="text-green-600" />
              গ্রাহকের তথ্য
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">নাম</p>
                <p className="font-semibold text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">মোবাইল</p>
                <p className="font-semibold text-gray-900">{order.phone}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-green-600" />
              ডেলিভারি ঠিকানা
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <p className="text-xs text-gray-500 mb-1">ঠিকানা</p>
                <p className="font-semibold text-gray-900">{order.address}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">এলাকা/থানা</p>
                <p className="font-semibold text-gray-900">{order.area}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">জেলা</p>
                <p className="font-semibold text-gray-900">{order.district}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">এলাকা</p>
                <p className="font-semibold text-gray-900">
                  {order.deliveryArea === "inside_dhaka"
                    ? "ঢাকার ভিতরে"
                    : "ঢাকার বাইরে"}
                </p>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-green-600" />
              পণ্যের তথ্য
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">পণ্যের নাম</p>
                <p className="font-semibold text-gray-900">{order.productName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">প্যাকেজ</p>
                <p className="font-semibold text-gray-900">{order.packageTitle}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-green-600" />
              পেমেন্ট তথ্য
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">পেমেন্ট পদ্ধতি</p>
                <p className="font-semibold text-gray-900 uppercase">
                  {order.paymentMethod}
                </p>
              </div>
              {order.transactionId && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-semibold text-gray-900 font-mono">
                    {order.transactionId}
                  </p>
                </div>
              )}
            </div>

            {order.note && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">নোট</p>
                <p className="text-gray-700">{order.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" />
              অর্ডার স্ট্যাটাস
            </h2>
            <div className="mb-4">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  STATUS_COLORS[status as OrderStatus] || "bg-gray-100 text-gray-800"
                }`}
              >
                {STATUS_LABELS[status as OrderStatus] || status}
              </span>
            </div>
            <div className="space-y-2">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  disabled={loading || status === s}
                  className={`w-full py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                    status === s
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {STATUS_LABELS[s as OrderStatus]}
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">মূল্য সারসংক্ষেপ</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>পণ্যের মূল্য</span>
                <span>৳{order.productPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>ডেলিভারি চার্জ</span>
                <span>৳{order.deliveryCharge}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-base">
                <span>মোট</span>
                <span className="text-green-700">
                  ৳{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
