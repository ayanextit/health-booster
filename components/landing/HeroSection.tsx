"use client";
import { CheckCircle2, ShoppingCart, Eye, Leaf, Truck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  productImageUrl?: string | null;
}

const fadeLeft = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const fadeRight = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
};

export default function HeroSection({ title, subtitle, productImageUrl }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const bullets = [
    { icon: CheckCircle2, text: "রুচি বাড়াতে সহায়ক" },
    { icon: CheckCircle2, text: "হজমশক্তি সাপোর্ট করে" },
    { icon: Leaf, text: "Natural Ingredients" },
    { icon: Truck, text: "Fast Delivery" },
    { icon: CreditCard, text: "Cash on Delivery Available" },
  ];

  return (
    <section
      id="hero"
      className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16 lg:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium"
            >
              <Leaf size={14} />
              <span>Natural Health Supplement</span>
            </motion.div>

            <motion.h1
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              {title}
            </motion.h1>

            <motion.p
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, delay: 0.3 }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              {subtitle}
            </motion.p>

            <motion.ul
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.5 },
                },
              }}
            >
              {bullets.map((bullet, idx) => (
                <motion.li
                  key={idx}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <bullet.icon size={20} className="text-green-600 shrink-0" />
                  <span className="text-gray-700 font-medium">{bullet.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <motion.button
                onClick={() => scrollTo("order")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-full font-bold text-base transition-colors shadow-lg animate-cta-pulse"
              >
                <ShoppingCart size={18} />
                এখনই অর্ডার করুন
              </motion.button>
              <motion.button
                onClick={() => scrollTo("pricing")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-50 px-8 py-3.5 rounded-full font-bold text-base transition-colors"
              >
                <Eye size={18} />
                প্রাইস দেখুন
              </motion.button>
            </motion.div>
          </div>

          {/* Right - Product Image or Placeholder */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {productImageUrl ? (
                <div className="w-full max-w-xs sm:max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={productImageUrl}
                    alt="Health Booster Supplement"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full max-w-xs sm:max-w-sm aspect-[3/4] bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6"
                  >
                    <Leaf size={48} className="text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-center mb-2">Health Booster</h3>
                  <p className="text-green-100 text-sm text-center mb-4">Supplement</p>
                  <div className="w-full bg-white/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-green-100">প্রতিটি ফাইলে</p>
                    <p className="text-3xl font-bold">৩০টি</p>
                    <p className="text-sm text-green-100">ক্যাপসুল</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                    ✓ Natural Ingredients
                  </div>
                </div>
              )}

              {/* Floating badges */}
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 20 }}
                className="absolute -top-4 -right-4 bg-white shadow-lg rounded-2xl px-4 py-2 text-center"
              >
                <p className="text-xs text-gray-500">শুরু মাত্র</p>
                <p className="text-lg font-bold text-green-700">৳১,০০০</p>
              </motion.div>
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.1, type: "spring", stiffness: 260, damping: 20 }}
                className="absolute -bottom-4 -left-4 bg-white shadow-lg rounded-2xl px-4 py-2 text-center"
              >
                <p className="text-xs text-gray-500">ডেলিভারি</p>
                <p className="text-sm font-bold text-green-700">১-৩ দিন</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
