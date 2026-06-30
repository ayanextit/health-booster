"use client";
import { CheckCircle2, Star, ShoppingCart } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Package {
  id: string;
  title: string;
  quantity: number;
  capsuleCount: number;
  price: number;
  salePrice?: number | null;
  badge?: string | null;
  isPopular: boolean;
}

interface PricingSectionProps {
  packages: Package[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function PricingSection({ packages }: PricingSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const scrollToOrder = (pkgId: string) => {
    const el = document.getElementById("order");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(
        new CustomEvent("selectPackage", { detail: { packageId: pkgId } })
      );
    }
  };

  const notes: Record<string, string> = {};
  if (packages.length > 2) {
    notes[packages[2]?.id] = "নিয়মিত কোর্স সম্পূর্ণ করতে recommended";
  }

  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-green-50 to-emerald-50" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">প্রাইস লিস্ট</h2>
          <p className="text-gray-500">আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.3 },
            },
          }}
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={cardVariants}
              transition={{ duration: 0.55, ease: "easeOut" }}
              whileHover={{ y: pkg.isPopular ? -8 : -4, transition: { duration: 0.2 } }}
              className={`relative bg-white rounded-3xl shadow-md border-2 p-7 flex flex-col ${
                pkg.isPopular
                  ? "border-green-500 ring-2 ring-green-200 animate-pulse-ring"
                  : "border-transparent hover:shadow-xl"
              }`}
            >
              {pkg.badge && (
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                    pkg.isPopular
                      ? "bg-green-600 text-white"
                      : "bg-yellow-400 text-yellow-900"
                  }`}
                >
                  {pkg.isPopular && <Star size={12} className="inline mr-1" />}
                  {pkg.badge}
                </div>
              )}

              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {pkg.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {pkg.capsuleCount}টি ক্যাপসুল
                </p>
              </div>

              <div className="text-center mb-6">
                {pkg.salePrice ? (
                  <>
                    <span className="text-gray-400 line-through text-lg">
                      ৳{pkg.price.toLocaleString()}
                    </span>
                    <div className="text-4xl font-black text-green-700">
                      ৳{pkg.salePrice.toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div className="text-4xl font-black text-green-700">
                    ৳{pkg.price.toLocaleString()}
                  </div>
                )}
                <p className="text-gray-400 text-sm mt-1">+ ডেলিভারি চার্জ</p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  {pkg.quantity} ফাইল পণ্য
                </li>
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  {pkg.capsuleCount}টি ক্যাপসুল
                </li>
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  Cash on Delivery Available
                </li>
                {notes[pkg.id] && (
                  <li className="flex items-start gap-2 text-green-700 text-sm font-medium mt-2">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                    {notes[pkg.id]}
                  </li>
                )}
              </ul>

              <motion.button
                onClick={() => scrollToOrder(pkg.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm transition-colors ${
                  pkg.isPopular
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    : "border-2 border-green-600 text-green-700 hover:bg-green-50"
                }`}
              >
                <ShoppingCart size={16} />
                {pkg.title} অর্ডার করুন
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
