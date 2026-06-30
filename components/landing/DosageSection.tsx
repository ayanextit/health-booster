"use client";
import { Clock, Moon, Sun, Droplets } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function DosageSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="dosage" className="py-16 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">খাওয়ার নিয়ম</h2>
          <p className="text-gray-500">
            সঠিকভাবে সেবন করুন, সর্বোত্তম ফলাফলের জন্য
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-green-50 rounded-2xl p-5 mb-6 text-center border border-green-100"
          >
            <p className="text-green-800 font-semibold text-lg">
              ১টি ফাইলে থাকে ৩০টি ক্যাপসুল।
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-5"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: { staggerChildren: 0.15, delayChildren: 0.35 },
              },
            }}
          >
            {/* Card 1 */}
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock size={20} className="text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900">প্রথম সপ্তাহ</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-yellow-50 rounded-xl p-3">
                  <Sun size={18} className="text-yellow-500 shrink-0" />
                  <p className="text-sm text-gray-700">
                    সকালে ১টি ক্যাপসুল (খাবারের ১০ মিনিট পর)
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 rounded-xl p-3">
                  <Moon size={18} className="text-indigo-500 shrink-0" />
                  <p className="text-sm text-gray-700">
                    রাতে ১টি ক্যাপসুল (খাবারের ১০ মিনিট পর)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Sun size={20} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">১ সপ্তাহ পর থেকে</h3>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  প্রতিদিন শুধু সকালে খাবারের পর ১টি করে ক্যাপসুল সেবন করুন।
                </p>
              </div>
              <div className="mt-3 bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  প্রথম ফাইল প্রায় ২১ দিন চলবে।
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Droplets size={20} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">গুরুত্বপূর্ণ তথ্য</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "পর্যাপ্ত পানি পান করবেন",
                  "খাবারের পরেই সেবন করুন",
                  "নিয়মিত রুটিন মেনে চলুন",
                  "পরবর্তী ফাইল: ১টি/দিন",
                ].map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
