"use client";
import { MapPin, Truck, Clock } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface DeliverySectionProps {
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
}

export default function DeliverySection({
  insideDhakaCharge,
  outsideDhakaCharge,
}: DeliverySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            অর্ডার ও ডেলিভারি তথ্য
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Inside Dhaka */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-green-100"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">ঢাকার ভিতরে</h3>
                <p className="text-gray-500 text-sm">Inside Dhaka</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock size={16} />
                  ডেলিভারি সময়
                </div>
                <span className="font-semibold text-gray-900">১–২ দিন</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Truck size={16} />
                  ডেলিভারি চার্জ
                </div>
                <span className="font-bold text-green-700 text-lg">
                  ৳{insideDhakaCharge}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Outside Dhaka */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Truck size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">ঢাকার বাইরে</h3>
                <p className="text-gray-500 text-sm">Outside Dhaka</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock size={16} />
                  ডেলিভারি সময়
                </div>
                <span className="font-semibold text-gray-900">২–৩ দিন</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Truck size={16} />
                  ডেলিভারি চার্জ
                </div>
                <span className="font-bold text-blue-700 text-lg">
                  ৳{outsideDhakaCharge}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
