"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, ShoppingCart, MapPin } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { orderSchema, OrderFormData } from "@/lib/validations";

// Districts where inside_dhaka charge applies
const DHAKA_DISTRICTS = new Set(["ঢাকা"]);

const DISTRICTS_BY_DIVISION: Record<string, string[]> = {
  "ঢাকা বিভাগ": ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "মানিকগঞ্জ", "মুন্সিগঞ্জ", "নরসিংদী", "কিশোরগঞ্জ", "টাঙ্গাইল", "ফরিদপুর", "গোপালগঞ্জ", "মাদারীপুর", "রাজবাড়ী", "শরীয়তপুর"],
  "চট্টগ্রাম বিভাগ": ["চট্টগ্রাম", "কক্সবাজার", "ফেনী", "লক্ষ্মীপুর", "নোয়াখালী", "কুমিল্লা", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "বান্দরবান", "রাঙামাটি", "খাগড়াছড়ি"],
  "রাজশাহী বিভাগ": ["রাজশাহী", "চাঁপাইনবাবগঞ্জ", "নাটোর", "নওগাঁ", "বগুড়া", "জয়পুরহাট", "সিরাজগঞ্জ", "পাবনা"],
  "খুলনা বিভাগ": ["খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "নড়াইল", "মাগুরা", "ঝিনাইদহ", "কুষ্টিয়া", "মেহেরপুর", "চুয়াডাঙ্গা"],
  "সিলেট বিভাগ": ["সিলেট", "সুনামগঞ্জ", "হবিগঞ্জ", "মৌলভীবাজার"],
  "বরিশাল বিভাগ": ["বরিশাল", "ঝালকাঠি", "পিরোজপুর", "ভোলা", "পটুয়াখালী", "বরগুনা"],
  "রংপুর বিভাগ": ["রংপুর", "কুড়িগ্রাম", "গাইবান্ধা", "নীলফামারী", "লালমনিরহাট", "দিনাজপুর", "ঠাকুরগাঁও", "পঞ্চগড়"],
  "ময়মনসিংহ বিভাগ": ["ময়মনসিংহ", "নেত্রকোনা", "জামালপুর", "শেরপুর"],
};

interface Package {
  id: string;
  title: string;
  price: number;
  salePrice?: number | null;
  capsuleCount: number;
}

interface OrderFormProps {
  packages: Package[];
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
}

export default function OrderForm({ packages, insideDhakaCharge, outsideDhakaCharge }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<OrderFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(orderSchema) as any,
    defaultValues: { deliveryArea: "outside_dhaka", paymentMethod: "cod" },
  });

  const selectedPackageId = watch("packageId");
  const selectedDeliveryArea = watch("deliveryArea");
  const selectedPaymentMethod = watch("paymentMethod");
  const selectedDistrict = watch("district");

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);
  const productPrice = selectedPackage ? (selectedPackage.salePrice ?? selectedPackage.price) : 0;
  const deliveryCharge = selectedDeliveryArea === "inside_dhaka" ? insideDhakaCharge : outsideDhakaCharge;
  const totalAmount = productPrice + deliveryCharge;

  // Auto-set delivery area based on district
  useEffect(() => {
    if (!selectedDistrict) return;
    setValue("deliveryArea", DHAKA_DISTRICTS.has(selectedDistrict) ? "inside_dhaka" : "outside_dhaka");
  }, [selectedDistrict, setValue]);

  // Scroll to success message
  useEffect(() => {
    if (successOrder && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [successOrder]);

  // Listen for package selection from pricing section
  useEffect(() => {
    const handler = (e: CustomEvent<{ packageId: string }>) => {
      setValue("packageId", e.detail.packageId);
    };
    window.addEventListener("selectPackage", handler as EventListener);
    return () => window.removeEventListener("selectPackage", handler as EventListener);
  }, [setValue]);

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "অর্ডার প্রক্রিয়া ব্যর্থ হয়েছে।");
      setSuccessOrder(result.orderNumber);
      reset();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-16 bg-gradient-to-br from-green-50 to-emerald-50" ref={ref}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Success Message */}
        {successOrder && (
          <div ref={successRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-3xl p-10 shadow-xl text-center border-2 border-green-200"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={48} className="text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
              </h2>
              <p className="text-gray-600 mb-6">
                আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।<br />
                আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবে।
              </p>
              <div className="bg-green-50 rounded-2xl p-5 mb-6 inline-block min-w-48">
                <p className="text-sm text-gray-500 mb-1">অর্ডার নম্বর</p>
                <p className="text-3xl font-bold text-green-700">{successOrder}</p>
              </div>
              <div>
                <button
                  onClick={() => setSuccessOrder(null)}
                  className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  নতুন অর্ডার করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Order Form */}
        {!successOrder && (
          <>
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-3">অর্ডার করতে নিচের তথ্যগুলো পূরণ করুন</h2>
              <p className="text-gray-500">সব তারকা (*) চিহ্নিত তথ্য বাধ্যতামূলক</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-5"
            >
              {/* Customer Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">পূর্ণ নাম *</label>
                  <input
                    {...register("customerName")}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">মোবাইল নম্বর *</label>
                  <input
                    {...register("phone")}
                    placeholder="01XXXXXXXXX"
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  ইমেইল <span className="text-gray-400 font-normal">(ঐচ্ছিক — invoice পেতে)</span>
                </label>
                <input
                  {...register("customerEmail")}
                  placeholder="your@email.com"
                  type="email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">পূর্ণ ঠিকানা *</label>
                <textarea
                  {...register("address")}
                  placeholder="বাড়ির নম্বর, রাস্তা/মহল্লা, এলাকা বা থানার নাম"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              {/* District + Auto Delivery */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">জেলা *</label>
                  <select
                    {...register("district")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  >
                    <option value="">— জেলা সিলেক্ট করুন —</option>
                    {Object.entries(DISTRICTS_BY_DIVISION).map(([division, districts]) => (
                      <optgroup key={division} label={division}>
                        {districts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                </div>

                {/* Auto delivery area display */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ডেলিভারি চার্জ</label>
                  <div className={`w-full rounded-xl px-4 py-3 text-sm border-2 flex items-center gap-2 ${
                    selectedDistrict
                      ? "border-green-400 bg-green-50 text-green-800"
                      : "border-gray-200 bg-gray-50 text-gray-400"
                  }`}>
                    <MapPin size={16} className={selectedDistrict ? "text-green-600" : "text-gray-300"} />
                    {selectedDistrict ? (
                      <span className="font-semibold">
                        {selectedDeliveryArea === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"}
                        {" — "}৳{deliveryCharge}
                      </span>
                    ) : (
                      <span>জেলা সিলেক্ট করলে স্বয়ংক্রিয় হবে</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">প্যাকেজ সিলেক্ট করুন *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${
                        selectedPackageId === pkg.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <input {...register("packageId")} type="radio" value={pkg.id} className="sr-only" />
                      <p className="font-bold text-gray-900 text-sm">{pkg.title}</p>
                      <p className="text-green-700 font-black text-lg">৳{(pkg.salePrice ?? pkg.price).toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">{pkg.capsuleCount}টি ক্যাপসুল</p>
                    </label>
                  ))}
                </div>
                {errors.packageId && <p className="text-red-500 text-xs mt-1">{errors.packageId.message}</p>}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">পেমেন্ট পদ্ধতি *</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: "cod", label: "Cash on Delivery" },
                    { value: "bkash", label: "Bkash" },
                    { value: "nagad", label: "Nagad" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer border-2 rounded-xl p-2 sm:p-3 text-center transition-all ${
                        selectedPaymentMethod === opt.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <input {...register("paymentMethod")} type="radio" value={opt.value} className="sr-only" />
                      <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>}
              </div>

              {/* Transaction ID */}
              {(selectedPaymentMethod === "bkash" || selectedPaymentMethod === "nagad") && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Transaction ID *</label>
                  <input
                    {...register("transactionId")}
                    placeholder="পেমেন্টের Transaction ID লিখুন"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId.message}</p>}
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">বিশেষ নোট (ঐচ্ছিক)</label>
                <input
                  {...register("note")}
                  placeholder="কোনো বিশেষ নির্দেশনা থাকলে লিখুন"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Price Summary */}
              {selectedPackage && (
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <h4 className="font-bold text-gray-900 mb-3">মূল্য সারসংক্ষেপ</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>পণ্যের মূল্য</span>
                      <span>৳{productPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>ডেলিভারি চার্জ {selectedDistrict ? `(${selectedDistrict})` : ""}</span>
                      <span>৳{deliveryCharge}</span>
                    </div>
                    <div className="border-t border-green-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span className="text-gray-900">মোট পরিমাণ</span>
                      <span className="text-green-700">৳{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-full font-bold text-lg transition-colors shadow-lg active:scale-95"
              >
                {isSubmitting ? (
                  <><Loader2 size={20} className="animate-spin" />প্রক্রিয়াকরণ হচ্ছে...</>
                ) : (
                  <><ShoppingCart size={20} />অর্ডার কনফার্ম করুন</>
                )}
              </button>
            </motion.form>
          </>
        )}
      </div>
    </section>
  );
}
