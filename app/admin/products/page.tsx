export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Box, CheckCircle2 } from "lucide-react";
import type { Product, Package } from "@/app/generated/prisma/client";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      packages: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">পণ্য ম্যানেজমেন্ট</h1>
          <p className="text-gray-500 text-sm mt-1">
            পণ্যের তথ্য দেখুন ও পরিচালনা করুন
          </p>
        </div>

        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
              <Box size={40} className="mx-auto mb-3 opacity-30" />
              <p>কোনো পণ্য নেই। সীড ডেটা রান করুন।</p>
            </div>
          ) : (
            products.map((product: Product & { packages: Package[] }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Slug: {product.slug}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </div>

                {product.description && (
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {product.description}
                  </p>
                )}

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    প্যাকেজ ({product.packages.length}টি):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.packages.map((pkg: Package) => (
                      <div
                        key={pkg.id}
                        className="bg-green-50 rounded-xl p-3 border border-green-100"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle2
                            size={14}
                            className="text-green-600"
                          />
                          <p className="font-semibold text-gray-900 text-sm">
                            {pkg.title}
                          </p>
                        </div>
                        <p className="text-green-700 font-bold">
                          ৳{pkg.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {pkg.capsuleCount}টি ক্যাপসুল
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
