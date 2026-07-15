"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, CheckCircle2, Copy, Check } from "lucide-react";
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}

export default function OrderDetailClient({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [selected, setSelected] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const paymentLabel =
    order.paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি" : order.paymentMethod === "bkash" ? "বিকাশ" : "নগদ";
  const deliveryZoneLabel = order.deliveryArea === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে";

  const copyText = `নাম: ${order.customerName}
মোবাইল: ${order.phone}
ঠিকানা: ${order.address}, ${order.area}, ${order.district} (${deliveryZoneLabel})
পণ্য: ${order.productName} (${order.packageTitle})
পরিমাণ: ${order.quantity}
পণ্যের মূল্য: ৳${order.productPrice.toLocaleString()}
ডেলিভারি চার্জ: ৳${order.deliveryCharge}
মোট: ৳${order.totalAmount.toLocaleString()}
পেমেন্ট: ${paymentLabel}
স্ট্যাটাস: ${STATUS_LABELS[status as OrderStatus] || status}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusUpdate = async () => {
    if (selected === status) return;
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selected }),
    });
    if (res.ok) {
      setStatus(selected);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
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
    <div className="max-w-5xl mx-auto pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">অর্ডার #{order.orderNumber}</h1>
            <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleString("bn-BD")}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
        >
          <Trash2 size={15} />
          {deleting ? "মুছছে..." : "মুছুন"}
        </button>
      </div>

      {/* Copy Box for Delivery Team */}
      <div className="mb-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-900 text-sm">ডেলিভারি তথ্য (কপি বক্স)</p>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              copied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "কপি হয়েছে" : "কপি করুন"}
          </button>
        </div>
        <pre className="whitespace-pre-wrap break-words text-sm text-gray-700 bg-gray-50 rounded-xl p-4 font-sans">
          {copyText}
        </pre>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: All order info in one card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Customer */}
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">গ্রাহকের তথ্য</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="নাম" value={order.customerName} />
              <Field label="মোবাইল" value={order.phone} />
            </div>
          </div>

          {/* Address */}
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">ডেলিভারি ঠিকানা</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="ঠিকানা" value={order.address} />
              </div>
              <Field label="এলাকা/থানা" value={order.area} />
              <Field label="জেলা" value={order.district} />
              <Field
                label="ডেলিভারি জোন"
                value={order.deliveryArea === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"}
              />
            </div>
          </div>

          {/* Product */}
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">পণ্যের তথ্য</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="পণ্যের নাম" value={order.productName} />
              <Field label="প্যাকেজ" value={order.packageTitle} />
            </div>
          </div>

          {/* Payment */}
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">পেমেন্ট তথ্য</p>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="পেমেন্ট পদ্ধতি"
                value={order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "bkash" ? "Bkash" : "Nagad"}
              />
              {order.transactionId && <Field label="Transaction ID" value={order.transactionId} />}
            </div>
            {order.note && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <Field label="নোট" value={order.note} />
              </div>
            )}
          </div>
        </div>

        {/* Right: Status + Summary */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} className="text-green-600" />
              <p className="font-semibold text-gray-900 text-sm">অর্ডার স্ট্যাটাস</p>
            </div>

            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${STATUS_COLORS[status as OrderStatus] || "bg-gray-100 text-gray-800"}`}>
              {STATUS_LABELS[status as OrderStatus] || status}
            </span>

            <div className="space-y-2">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  className={`w-full py-2 px-4 rounded-xl text-sm font-medium transition-colors text-left ${
                    selected === s
                      ? "bg-green-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {STATUS_LABELS[s as OrderStatus]}
                </button>
              ))}
            </div>

            <button
              onClick={handleStatusUpdate}
              disabled={loading || selected === status}
              className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                saved
                  ? "bg-green-100 text-green-700"
                  : selected === status
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {saved ? "✓ আপডেট হয়েছে" : loading ? "সেভ হচ্ছে..." : "স্ট্যাটাস আপডেট করুন"}
            </button>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="font-semibold text-gray-900 text-sm mb-4">মূল্য সারসংক্ষেপ</p>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>পণ্যের মূল্য</span>
                <span>৳{order.productPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>ডেলিভারি চার্জ</span>
                <span>৳{order.deliveryCharge}</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold">
                <span>মোট</span>
                <span className="text-green-700">৳{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
