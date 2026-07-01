"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Globe, CreditCard, ImageIcon, Upload, Trash2, MessageSquare, Mail, Star } from "lucide-react";
import { paymentSettingsSchema, siteSettingsSchema, emailSettingsSchema } from "@/lib/validations";
import { z } from "zod";

type SiteForm = z.infer<typeof siteSettingsSchema>;
type PaymentForm = z.infer<typeof paymentSettingsSchema>;
type EmailForm = z.infer<typeof emailSettingsSchema>;

interface ReviewImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

interface Props {
  initialSite: SiteForm | null;
  initialPayment: PaymentForm | null;
  initialEmail: EmailForm | null;
  productImageUrl?: string | null;
}

export default function SettingsClient({ initialSite, initialPayment, initialEmail, productImageUrl: initialImg }: Props) {
  const [siteSuccess, setSiteSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState("");
  const [imgUrl, setImgUrl] = useState(initialImg || "");
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState("");
  const [imgSuccess, setImgSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [faviconUrl, setFaviconUrl] = useState("/uploads/site-favicon.png");
  const [faviconLoading, setFaviconLoading] = useState(false);
  const [faviconError, setFaviconError] = useState("");
  const [faviconSuccess, setFaviconSuccess] = useState(false);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Review images state
  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [reviewUploading, setReviewUploading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const reviewInputRef = useRef<HTMLInputElement>(null);

  const loadReviewImages = useCallback(async () => {
    const res = await fetch("/api/admin/review-images");
    if (res.ok) {
      const data = await res.json();
      setReviewImages(data.images);
    }
  }, []);

  useEffect(() => {
    loadReviewImages();
  }, [loadReviewImages]);

  const siteForm = useForm<SiteForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(siteSettingsSchema) as any,
    defaultValues: initialSite ?? {
      siteName: "Health Booster",
      phone: "",
      address: "",
      facebookUrl: "",
      heroTitle:
        "হেলদি ভাবে ওজন বাড়াতে ও রুচি বাড়াতে সহায়ক Health Booster Supplement",
      heroSubtitle:
        "Natural Ingredients দিয়ে তৈরি Health Booster Supplement রুচি, হজমশক্তি ও দৈনন্দিন এনার্জি সাপোর্ট করতে সাহায্য করে।",
      announcementText: "ঢাকার ভিতরে ১–২ দিন, ঢাকার বাইরে ২–৩ দিনে ডেলিভারি",
      insideDhakaCharge: 80,
      outsideDhakaCharge: 130,
    },
  });

  const paymentForm = useForm<PaymentForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(paymentSettingsSchema) as any,
    defaultValues: initialPayment ?? {
      bkashNumber: "",
      nagadNumber: "",
      codEnabled: true,
      bkashEnabled: true,
      nagadEnabled: true,
    },
  });

  const emailForm = useForm<EmailForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(emailSettingsSchema) as any,
    defaultValues: initialEmail ?? {
      smtpHost: "",
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: "",
      smtpPass: "",
      fromName: "Health Booster",
      fromEmail: "",
    },
  });

  const onSiteSubmit = async (data: SiteForm) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "site", data }),
    });
    if (res.ok) {
      setSiteSuccess(true);
      setTimeout(() => setSiteSuccess(false), 3000);
    }
  };

  const onPaymentSubmit = async (data: PaymentForm) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "payment", data }),
    });
    if (res.ok) {
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 3000);
    }
  };

  const onEmailSubmit = async (data: EmailForm) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "email", data }),
    });
    if (res.ok) {
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 3000);
    }
  };

  const sendTestEmail = async () => {
    setTestingEmail(true);
    setTestEmailMsg("");
    const res = await fetch("/api/admin/settings/test-email", { method: "POST" });
    const json = await res.json();
    setTestingEmail(false);
    setTestEmailMsg(res.ok ? "✅ টেস্ট ইমেইল পাঠানো হয়েছে!" : `❌ ${json.error || "ব্যর্থ হয়েছে"}`);
    setTimeout(() => setTestEmailMsg(""), 5000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImgLoading(true);
    setImgError("");
    setImgSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setImgLoading(false);

    if (res.ok) {
      const data = await res.json();
      setImgUrl(data.url);
      setImgSuccess(true);
      setTimeout(() => setImgSuccess(false), 4000);
    } else {
      const data = await res.json();
      setImgError(data.error || "আপলোড ব্যর্থ হয়েছে");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFaviconLoading(true);
    setFaviconError("");
    setFaviconSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload-favicon", { method: "POST", body: formData });
    setFaviconLoading(false);

    if (res.ok) {
      setFaviconUrl(`/uploads/site-favicon.png?v=${Date.now()}`);
      setFaviconSuccess(true);
      setTimeout(() => setFaviconSuccess(false), 4000);
    } else {
      const data = await res.json();
      setFaviconError(data.error || "আপলোড ব্যর্থ হয়েছে");
    }

    if (faviconInputRef.current) faviconInputRef.current.value = "";
  };

  const handleReviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setReviewUploading(true);
    setReviewError("");
    setReviewSuccess(false);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload-review", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setReviewError(data.error || "আপলোড ব্যর্থ হয়েছে");
        break;
      }
    }

    setReviewUploading(false);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
    await loadReviewImages();
    if (reviewInputRef.current) reviewInputRef.current.value = "";
  };

  const handleReviewDelete = async (id: string) => {
    if (!confirm("এই রিভিউ ছবিটি মুছে ফেলবেন?")) return;
    await fetch("/api/admin/review-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadReviewImages();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">সেটিংস</h1>
        <p className="text-gray-500 text-sm mt-1">
          সাইট, পেমেন্ট ও ইমেইল সেটিংস পরিচালনা — v2
        </p>
      </div>

      <div className="space-y-6">
        {/* Product Image Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <ImageIcon size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">প্রোডাক্ট ছবি</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Preview */}
            <div className="w-36 h-44 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
              {imgUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgUrl} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-3">
                  <ImageIcon size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">কোনো ছবি নেই</p>
                </div>
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-4">
                Hero সেকশনে প্রোডাক্টের ছবি আপলোড করুন। JPG, PNG বা WebP ফরম্যাটে
                সর্বোচ্চ ৫ MB।
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                id="product-image-input"
              />
              <label
                htmlFor="product-image-input"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
              >
                {imgLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {imgLoading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}
              </label>

              {imgSuccess && (
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium mt-3">
                  <CheckCircle2 size={16} />
                  ছবি সফলভাবে আপলোড হয়েছে!
                </div>
              )}
              {imgError && (
                <p className="text-red-500 text-sm mt-3">{imgError}</p>
              )}
              {imgUrl && (
                <p className="text-xs text-gray-400 mt-3 break-all">
                  বর্তমান ছবি: {imgUrl}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Favicon Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Favicon (সাইট লোগো)</h2>
              <p className="text-xs text-gray-500">Browser tab-এ যে আইকন দেখায়</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Preview */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
              {faviconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={faviconUrl}
                  alt="Favicon"
                  className="w-12 h-12 object-contain"
                  onError={() => setFaviconUrl("")}
                />
              ) : (
                <div className="text-center">
                  <Star size={24} className="text-gray-300 mx-auto" />
                </div>
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-4">
                PNG, WebP বা ICO ফরম্যাটে সর্বোচ্চ ২ MB। সেরা ফলাফলের জন্য ৩২×৩২ বা ৬৪×৬৪ পিক্সেল ব্যবহার করুন।
              </p>

              <input
                ref={faviconInputRef}
                type="file"
                accept="image/png,image/webp,image/x-icon,image/vnd.microsoft.icon,image/jpeg"
                onChange={handleFaviconUpload}
                className="hidden"
                id="favicon-input"
              />
              <label
                htmlFor="favicon-input"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
              >
                {faviconLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {faviconLoading ? "আপলোড হচ্ছে..." : "Favicon আপলোড করুন"}
              </label>

              {faviconSuccess && (
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium mt-3">
                  <CheckCircle2 size={16} />
                  Favicon সফলভাবে আপলোড হয়েছে! পেজ রিফ্রেশ করলে দেখাবে।
                </div>
              )}
              {faviconError && (
                <p className="text-red-500 text-sm mt-3">{faviconError}</p>
              )}
              {faviconUrl && (
                <p className="text-xs text-gray-400 mt-3 break-all">
                  বর্তমান favicon: {faviconUrl}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Review Images Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} className="text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">রিভিউ ছবিসমূহ</h2>
                <p className="text-xs text-gray-500">"ব্যবহারকারীদের মতামত" সেকশনে দেখাবে</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {reviewSuccess && (
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  আপলোড সফল!
                </div>
              )}
              <input
                ref={reviewInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleReviewUpload}
                className="hidden"
                id="review-image-input"
              />
              <label
                htmlFor="review-image-input"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
              >
                {reviewUploading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                {reviewUploading ? "আপলোড হচ্ছে..." : "ছবি যোগ করুন"}
              </label>
            </div>
          </div>

          {reviewError && (
            <p className="text-red-500 text-sm mb-4">{reviewError}</p>
          )}

          {reviewImages.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-12 text-center">
              <MessageSquare size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">কোনো রিভিউ ছবি নেই</p>
              <p className="text-gray-400 text-xs mt-1">
                উপরের বাটন দিয়ে রিভিউ স্ক্রিনশট আপলোড করুন
              </p>
              <p className="text-gray-400 text-xs mt-1">
                (ছবি না থাকলে ডিফল্ট R01–R05 ছবি দেখাবে)
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {reviewImages.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt="Review"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => handleReviewDelete(img.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="মুছুন"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">পেমেন্ট সেটিংস</h2>
          </div>

          <form
            onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Bkash নম্বর
                </label>
                <input
                  {...paymentForm.register("bkashNumber")}
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Nagad নম্বর
                </label>
                <input
                  {...paymentForm.register("nagadNumber")}
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {(
                [
                  { field: "codEnabled" as const, label: "Cash on Delivery" },
                  { field: "bkashEnabled" as const, label: "Bkash" },
                  { field: "nagadEnabled" as const, label: "Nagad" },
                ] as const
              ).map((item) => (
                <label key={item.field} className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...paymentForm.register(item.field)}
                    type="checkbox"
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.label} সক্রিয়
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={paymentForm.formState.isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {paymentForm.formState.isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                সংরক্ষণ করুন
              </button>
              {paymentSuccess && (
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  সংরক্ষিত হয়েছে!
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Email / SMTP Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Mail size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">ইমেইল সেটিংস (SMTP)</h2>
              <p className="text-xs text-gray-500">অর্ডার কনফার্ম হলে গ্রাহককে ইনভয়েস পাঠানো হবে</p>
            </div>
          </div>

          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">SMTP Host</label>
                <input
                  {...emailForm.register("smtpHost")}
                  placeholder="mail.yourdomain.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">SMTP Port</label>
                <input
                  {...emailForm.register("smtpPort")}
                  type="number"
                  placeholder="587"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">SMTP ইউজারনেম (ইমেইল)</label>
                <input
                  {...emailForm.register("smtpUser")}
                  placeholder="noreply@yourdomain.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">SMTP পাসওয়ার্ড</label>
                <input
                  {...emailForm.register("smtpPass")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">প্রেরকের নাম</label>
                <input
                  {...emailForm.register("fromName")}
                  placeholder="Health Booster"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">প্রেরকের ইমেইল (From)</label>
                <input
                  {...emailForm.register("fromEmail")}
                  placeholder="noreply@yourdomain.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...emailForm.register("smtpSecure")}
                type="checkbox"
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700">SSL/TLS সক্রিয় (port 465 হলে চেক করুন)</span>
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={emailForm.formState.isSubmitting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {emailForm.formState.isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                সংরক্ষণ করুন
              </button>
              <button
                type="button"
                onClick={sendTestEmail}
                disabled={testingEmail}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {testingEmail ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                টেস্ট ইমেইল পাঠান
              </button>
              {emailSuccess && (
                <div className="flex items-center gap-1.5 text-indigo-600 text-sm font-medium">
                  <CheckCircle2 size={16} /> সংরক্ষিত হয়েছে!
                </div>
              )}
              {testEmailMsg && (
                <p className="text-sm font-medium text-gray-700">{testEmailMsg}</p>
              )}
            </div>
          </form>
        </div>

        {/* Site Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Globe size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">সাইট সেটিংস</h2>
          </div>

          <form
            onSubmit={siteForm.handleSubmit(onSiteSubmit)}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  সাইটের নাম
                </label>
                <input
                  {...siteForm.register("siteName")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  ফোন নম্বর
                </label>
                <input
                  {...siteForm.register("phone")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Facebook URL
                </label>
                <input
                  {...siteForm.register("facebookUrl")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  ঠিকানা
                </label>
                <input
                  {...siteForm.register("address")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                ঘোষণা বার টেক্সট
              </label>
              <input
                {...siteForm.register("announcementText")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Hero শিরোনাম
              </label>
              <textarea
                {...siteForm.register("heroTitle")}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Hero সাবটাইটেল
              </label>
              <textarea
                {...siteForm.register("heroSubtitle")}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  ঢাকার ভিতরে ডেলিভারি চার্জ (টাকা)
                </label>
                <input
                  {...siteForm.register("insideDhakaCharge")}
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  ঢাকার বাইরে ডেলিভারি চার্জ (টাকা)
                </label>
                <input
                  {...siteForm.register("outsideDhakaCharge")}
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={siteForm.formState.isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {siteForm.formState.isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                সংরক্ষণ করুন
              </button>
              {siteSuccess && (
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  সংরক্ষিত হয়েছে!
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
