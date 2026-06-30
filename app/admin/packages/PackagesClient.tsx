"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, Plus, Package, X, Loader2, Star } from "lucide-react";
import { packageSchema } from "@/lib/validations";
import { z } from "zod";

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageWithProduct {
  id: string;
  title: string;
  quantity: number;
  capsuleCount: number;
  price: number;
  salePrice: number | null;
  badge: string | null;
  isPopular: boolean;
  status: string;
  product: { name: string };
}

interface PackagesClientProps {
  initialPackages: PackageWithProduct[];
}

export default function PackagesClient({ initialPackages }: PackagesClientProps) {
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<PackageFormData>({ resolver: zodResolver(packageSchema) as any });

  const startEdit = (pkg: PackageWithProduct) => {
    setEditing(pkg.id);
    setShowAdd(false);
    reset({
      title: pkg.title,
      quantity: pkg.quantity,
      capsuleCount: pkg.capsuleCount,
      price: pkg.price,
      salePrice: pkg.salePrice ?? undefined,
      badge: pkg.badge ?? "",
      isPopular: pkg.isPopular,
      status: pkg.status as "active" | "inactive",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setShowAdd(false);
    reset();
    setError(null);
  };

  const onSubmit = async (data: PackageFormData) => {
    setLoading(true);
    setError(null);
    try {
      const url = editing
        ? `/api/admin/packages/${editing}`
        : "/api/admin/packages";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("সংরক্ষণ ব্যর্থ হয়েছে।");

      const updated = await res.json() as PackageWithProduct;
      if (editing) {
        setPackages((prev) =>
          prev.map((p) => (p.id === editing ? { ...p, ...updated } : p))
        );
      } else {
        setPackages((prev) => [
          ...prev,
          { ...updated, product: { name: "Health Booster Supplement" } },
        ]);
      }

      setEditing(null);
      setShowAdd(false);
      reset();
      router.refresh();
    } catch {
      setError("সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই প্যাকেজটি মুছে ফেলতে চান?")) return;
    await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const PackageForm = () => (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4"
    >
      <h3 className="font-bold text-gray-900 mb-4">
        {editing ? "প্যাকেজ সম্পাদনা" : "নতুন প্যাকেজ"}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            শিরোনাম *
          </label>
          <input
            {...register("title")}
            placeholder="যেমন: ১ ফাইল"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            মূল্য (টাকা) *
          </label>
          <input
            {...register("price")}
            type="number"
            placeholder="1000"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            পরিমাণ (ফাইল) *
          </label>
          <input
            {...register("quantity")}
            type="number"
            placeholder="1"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            ক্যাপসুল সংখ্যা *
          </label>
          <input
            {...register("capsuleCount")}
            type="number"
            placeholder="30"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            সেল মূল্য (ঐচ্ছিক)
          </label>
          <input
            {...register("salePrice")}
            type="number"
            placeholder="900"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            ব্যাজ (ঐচ্ছিক)
          </label>
          <input
            {...register("badge")}
            placeholder="Popular / Best Value"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            স্ট্যাটাস
          </label>
          <select
            {...register("status")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="active">সক্রিয়</option>
            <option value="inactive">নিষ্ক্রিয়</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            {...register("isPopular")}
            type="checkbox"
            id="isPopular"
            className="w-4 h-4 accent-green-600"
          />
          <label
            htmlFor="isPopular"
            className="text-sm font-medium text-gray-700"
          >
            Popular হিসেবে চিহ্নিত করুন
          </label>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {editing ? "আপডেট করুন" : "যোগ করুন"}
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          <X size={16} />
          বাতিল
        </button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">প্যাকেজ ম্যানেজমেন্ট</h1>
          <p className="text-gray-500 text-sm mt-1">প্যাকেজ ও মূল্য পরিচালনা করুন</p>
        </div>
        {!showAdd && !editing && (
          <button
            onClick={() => {
              setShowAdd(true);
              reset({
                status: "active",
                isPopular: false,
                quantity: 1,
                capsuleCount: 30,
              });
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            <Plus size={16} />
            নতুন প্যাকেজ
          </button>
        )}
      </div>

      {(showAdd || editing) && <PackageForm />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>কোনো প্যাকেজ নেই। নতুন প্যাকেজ যোগ করুন।</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{pkg.title}</h3>
                    {pkg.isPopular && (
                      <Star
                        size={14}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    )}
                  </div>
                  {pkg.badge && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(pkg)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">মূল্য</span>
                  <span className="font-bold text-green-700">
                    ৳{pkg.price.toLocaleString()}
                  </span>
                </div>
                {pkg.salePrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">সেল মূল্য</span>
                    <span className="font-bold text-red-600">
                      ৳{pkg.salePrice.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ক্যাপসুল</span>
                  <span className="text-gray-900">{pkg.capsuleCount}টি</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">স্ট্যাটাস</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      pkg.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {pkg.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
