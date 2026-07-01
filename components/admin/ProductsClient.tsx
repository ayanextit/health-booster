"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp, PackagePlus } from "lucide-react";

interface Package {
  id: string;
  title: string;
  quantity: number;
  capsuleCount: number;
  price: number;
  salePrice: number | null;
  badge: string | null;
  isPopular: boolean;
  status: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  packages: Package[];
}

type ProductStatus = "active" | "inactive";
const emptyProduct: { name: string; slug: string; description: string; status: ProductStatus } = { name: "", slug: "", description: "", status: "active" };
const emptyPackage: { title: string; quantity: number; capsuleCount: number; price: number; salePrice: string; badge: string; isPopular: boolean; status: ProductStatus } = { title: "", quantity: 1, capsuleCount: 30, price: 0, salePrice: "", badge: "", isPopular: false, status: "active" };

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);

  // Package form state
  const [showPackageForm, setShowPackageForm] = useState<string | null>(null); // productId
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [packageForm, setPackageForm] = useState(emptyPackage);

  // Expanded products
  const [expanded, setExpanded] = useState<Set<string>>(new Set(products.map((p) => p.id)));

  const refresh = () => router.refresh();

  // ─── Product CRUD ───────────────────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setShowProductForm(true);
    setError("");
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, slug: p.slug, description: p.description ?? "", status: (p.status === "inactive" ? "inactive" : "active") as ProductStatus });
    setShowProductForm(true);
    setError("");
  };

  const closeProductForm = () => { setShowProductForm(false); setEditingProduct(null); setError(""); };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleProductNameChange = (name: string) => {
    setProductForm((f) => ({
      ...f,
      name,
      slug: editingProduct ? f.slug : autoSlug(name),
    }));
  };

  const saveProduct = async () => {
    setLoading(true); setError("");
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productForm, description: productForm.description || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "সমস্যা হয়েছে"); return; }

      if (editingProduct) {
        setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...data } : p));
      } else {
        setProducts((prev) => [{ ...data, packages: [] }, ...prev]);
        setExpanded((s) => new Set([...s, data.id]));
      }
      closeProductForm();
    } finally { setLoading(false); }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`"${name}" এবং এর সব প্যাকেজ ডিলিট করবেন?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally { setLoading(false); }
  };

  // ─── Package CRUD ───────────────────────────────────────────
  const openAddPackage = (productId: string) => {
    setEditingPackage(null);
    setPackageForm(emptyPackage);
    setShowPackageForm(productId);
    setError("");
  };

  const openEditPackage = (productId: string, pkg: Package) => {
    setEditingPackage(pkg);
    setPackageForm({
      title: pkg.title, quantity: pkg.quantity, capsuleCount: pkg.capsuleCount,
      price: pkg.price, salePrice: pkg.salePrice?.toString() ?? "",
      badge: pkg.badge ?? "", isPopular: pkg.isPopular, status: pkg.status as "active" | "inactive",
    });
    setShowPackageForm(productId);
    setError("");
  };

  const closePackageForm = () => { setShowPackageForm(null); setEditingPackage(null); setError(""); };

  const savePackage = async (productId: string) => {
    setLoading(true); setError("");
    try {
      const payload = {
        ...packageForm,
        salePrice: packageForm.salePrice ? Number(packageForm.salePrice) : null,
        badge: packageForm.badge || null,
        price: Number(packageForm.price),
        quantity: Number(packageForm.quantity),
        capsuleCount: Number(packageForm.capsuleCount),
      };

      let res: Response;
      if (editingPackage) {
        res = await fetch(`/api/admin/packages/${editingPackage.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, productId }),
        });
      }

      const data = await res.json();
      if (!res.ok) { setError(data.error || "সমস্যা হয়েছে"); return; }

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          const pkgs = editingPackage
            ? p.packages.map((pkg) => (pkg.id === editingPackage.id ? data : pkg))
            : [...p.packages, data];
          return { ...p, packages: pkgs.sort((a, b) => a.price - b.price) };
        })
      );
      closePackageForm();
    } finally { setLoading(false); }
  };

  const deletePackage = async (productId: string, pkgId: string, title: string) => {
    if (!confirm(`"${title}" প্যাকেজ ডিলিট করবেন?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/packages/${pkgId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, packages: p.packages.filter((pkg) => pkg.id !== pkgId) } : p
          )
        );
      }
    } finally { setLoading(false); }
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">পণ্য ম্যানেজমেন্ট</h1>
          <p className="text-gray-500 text-sm mt-1">পণ্য ও প্যাকেজ যোগ, সম্পাদনা ও পরিচালনা করুন</p>
        </div>
        <button
          onClick={openAddProduct}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <Plus size={16} />
          নতুন পণ্য
        </button>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? "পণ্য সম্পাদনা" : "নতুন পণ্য যোগ করুন"}
              </h2>
              <button onClick={closeProductForm} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">পণ্যের নাম *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => handleProductNameChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="যেমন: Health Booster Supplement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">স্লাগ (URL) *</label>
                <input
                  type="text"
                  value={productForm.slug}
                  onChange={(e) => setProductForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  placeholder="health-booster-supplement"
                />
                <p className="text-xs text-gray-400 mt-1">শুধু ইংরেজি অক্ষর, সংখ্যা ও হাইফেন</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">বিবরণ</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="পণ্যের সংক্ষিপ্ত বিবরণ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">স্ট্যাটাস</label>
                <select
                  value={productForm.status}
                  onChange={(e) => setProductForm((f) => ({ ...f, status: e.target.value as "active" | "inactive" }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">সক্রিয়</option>
                  <option value="inactive">নিষ্ক্রিয়</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeProductForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">বাতিল</button>
              <button
                onClick={saveProduct}
                disabled={loading}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 mb-4">কোনো পণ্য নেই</p>
          <button onClick={openAddProduct} className="text-green-600 hover:underline text-sm font-medium">+ নতুন পণ্য যোগ করুন</button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Product Header */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => setExpanded((s) => { const n = new Set(s); n.has(product.id) ? n.delete(product.id) : n.add(product.id); return n; })}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    {expanded.has(product.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {product.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">/{product.slug} · {product.packages.length}টি প্যাকেজ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => openEditProduct(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Pencil size={13} />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id, product.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                    ডিলিট
                  </button>
                </div>
              </div>

              {/* Product Body */}
              {expanded.has(product.id) && (
                <div className="border-t border-gray-100 px-6 py-5">
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  )}

                  {/* Packages */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">প্যাকেজ ({product.packages.length}টি)</p>
                    <button
                      onClick={() => openAddPackage(product.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700"
                    >
                      <PackagePlus size={14} />
                      প্যাকেজ যোগ করুন
                    </button>
                  </div>

                  {/* Package Form */}
                  {showPackageForm === product.id && (
                    <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">
                        {editingPackage ? "প্যাকেজ সম্পাদনা" : "নতুন প্যাকেজ"}
                      </h3>
                      {error && <p className="text-red-500 text-xs mb-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">প্যাকেজের নাম *</label>
                          <input
                            type="text"
                            value={packageForm.title}
                            onChange={(e) => setPackageForm((f) => ({ ...f, title: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="যেমন: ১ ফাইল"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">পরিমাণ (ফাইল)</label>
                          <input
                            type="number" min={1}
                            value={packageForm.quantity}
                            onChange={(e) => setPackageForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">ক্যাপসুল সংখ্যা</label>
                          <input
                            type="number" min={1}
                            value={packageForm.capsuleCount}
                            onChange={(e) => setPackageForm((f) => ({ ...f, capsuleCount: Number(e.target.value) }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">মূল্য (৳) *</label>
                          <input
                            type="number" min={1}
                            value={packageForm.price}
                            onChange={(e) => setPackageForm((f) => ({ ...f, price: Number(e.target.value) }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">অফার মূল্য (৳)</label>
                          <input
                            type="number" min={1}
                            value={packageForm.salePrice}
                            onChange={(e) => setPackageForm((f) => ({ ...f, salePrice: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="ঐচ্ছিক"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">ব্যাজ</label>
                          <input
                            type="text"
                            value={packageForm.badge}
                            onChange={(e) => setPackageForm((f) => ({ ...f, badge: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="যেমন: সেরা অফার"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">স্ট্যাটাস</label>
                          <select
                            value={packageForm.status}
                            onChange={(e) => setPackageForm((f) => ({ ...f, status: e.target.value as "active" | "inactive" }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="active">সক্রিয়</option>
                            <option value="inactive">নিষ্ক্রিয়</option>
                          </select>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`popular-${product.id}`}
                            checked={packageForm.isPopular}
                            onChange={(e) => setPackageForm((f) => ({ ...f, isPopular: e.target.checked }))}
                            className="rounded"
                          />
                          <label htmlFor={`popular-${product.id}`} className="text-xs font-medium text-gray-600">সবচেয়ে জনপ্রিয় হিসেবে চিহ্নিত করুন</label>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 justify-end">
                        <button onClick={closePackageForm} className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900">বাতিল</button>
                        <button
                          onClick={() => savePackage(product.id)}
                          disabled={loading}
                          className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60"
                        >
                          {loading ? "সংরক্ষণ..." : "সংরক্ষণ"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Package Cards */}
                  {product.packages.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">কোনো প্যাকেজ নেই।</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {product.packages.map((pkg) => (
                        <div key={pkg.id} className={`relative rounded-xl p-4 border ${pkg.status === "active" ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-200 opacity-60"}`}>
                          {pkg.isPopular && (
                            <span className="absolute -top-2 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">জনপ্রিয়</span>
                          )}
                          {pkg.badge && (
                            <span className="absolute -top-2 right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pkg.badge}</span>
                          )}
                          <p className="font-bold text-gray-900 text-sm mb-1">{pkg.title}</p>
                          <p className="text-green-700 font-bold text-lg">৳{pkg.price.toLocaleString()}</p>
                          {pkg.salePrice && <p className="text-xs text-gray-400 line-through">৳{pkg.salePrice.toLocaleString()}</p>}
                          <p className="text-xs text-gray-500 mt-1">{pkg.capsuleCount}টি ক্যাপসুল · {pkg.quantity} ফাইল</p>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => openEditPackage(product.id, pkg)}
                              className="flex-1 text-xs text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg py-1.5 font-medium transition-colors"
                            >
                              সম্পাদনা
                            </button>
                            <button
                              onClick={() => deletePackage(product.id, pkg.id, pkg.title)}
                              className="flex-1 text-xs text-red-500 bg-white border border-red-200 hover:bg-red-50 rounded-lg py-1.5 font-medium transition-colors"
                            >
                              ডিলিট
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
