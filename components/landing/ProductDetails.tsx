"use client";
import { Info, Leaf } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const specs = [
  { label: "উপাদান", value: "Natural Ingredients" },
  { label: "ক্যাপসুল/ফাইল", value: "৩০টি" },
  { label: "সেবনবিধি", value: "প্রতিদিন ১-২টি" },
  { label: "বয়স", value: "প্রাপ্তবয়স্ক" },
];

export default function ProductDetails() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Product Details
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Health Booster Supplement রুচি ও হজমশক্তি সাপোর্ট করতে সহায়ক।
              রুচি বাড়লে নিয়মিত খাবার গ্রহণ সহজ হয়, ফলে শরীরে পুষ্টি
              গ্রহণে সহায়তা হয় এবং ধীরে ধীরে হেলদি weight gain journey-তে
              support করতে পারে।
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4"
            >
              <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed">
                ফলাফল ব্যক্তিভেদে ভিন্ন হতে পারে। সঠিক খাবার, পর্যাপ্ত পানি
                ও নিয়মিত রুটিন বজায় রাখা জরুরি।
              </p>
            </motion.div>
          </motion.div>

          {/* Right — spec grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
          >
            {specs.map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.88 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-green-50 rounded-2xl p-4 border border-green-100 cursor-default"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Leaf size={16} className="text-green-600" />
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {item.label}
                  </p>
                </div>
                <p className="font-bold text-gray-900">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
