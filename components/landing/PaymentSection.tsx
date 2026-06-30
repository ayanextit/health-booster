"use client";
import { Banknote, Smartphone, Info } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface PaymentSectionProps {
  codEnabled: boolean;
  bkashEnabled: boolean;
  nagadEnabled: boolean;
  bkashNumber: string;
  nagadNumber: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function PaymentSection({
  codEnabled,
  bkashEnabled,
  nagadEnabled,
  bkashNumber,
  nagadNumber,
}: PaymentSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">পেমেন্ট পদ্ধতি</h2>
          <p className="text-gray-500">সহজ ও নিরাপদ পেমেন্ট অপশন</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.25 },
            },
          }}
        >
          {codEnabled && (
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-md"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Banknote size={28} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Cash on Delivery
              </h3>
              <p className="text-gray-500 text-sm">
                পণ্য হাতে পেয়ে পেমেন্ট করুন। কোনো অ্যাডভান্স পেমেন্ট নেই।
              </p>
              <div className="mt-4 bg-green-600 text-white text-xs font-bold py-1.5 px-4 rounded-full inline-block">
                ✓ সবচেয়ে জনপ্রিয়
              </div>
            </motion.div>
          )}

          {bkashEnabled && (
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-pink-50 border border-pink-200 rounded-2xl p-6 text-center hover:shadow-md"
            >
              <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone size={28} className="text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Bkash Send Money
              </h3>
              {bkashNumber && (
                <div className="bg-pink-100 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1">Bkash নম্বর</p>
                  <p className="font-bold text-pink-700 text-lg">{bkashNumber}</p>
                </div>
              )}
              <div className="flex items-start gap-2 bg-white rounded-xl p-3 text-left">
                <Info size={14} className="text-pink-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Send Money করার পর Transaction ID অর্ডার ফর্মে লিখুন।
                </p>
              </div>
            </motion.div>
          )}

          {nagadEnabled && (
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center hover:shadow-md"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone size={28} className="text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Nagad Send Money
              </h3>
              {nagadNumber && (
                <div className="bg-orange-100 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1">Nagad নম্বর</p>
                  <p className="font-bold text-orange-700 text-lg">{nagadNumber}</p>
                </div>
              )}
              <div className="flex items-start gap-2 bg-white rounded-xl p-3 text-left">
                <Info size={14} className="text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Send Money করার পর Transaction ID অর্ডার ফর্মে লিখুন।
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
