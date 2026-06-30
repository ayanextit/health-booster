"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Quote, ShoppingCart } from "lucide-react";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CelebrityEndorsement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-16 lg:py-20 bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 overflow-hidden"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* --------- Left: Celebrity Image --------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center lg:justify-end order-2 lg:order-1"
          >
            {/* Floating wrapper */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-yellow-400/20 blur-2xl scale-110 pointer-events-none" />

              {/* Photo */}
              <div className="relative w-full max-w-xs sm:max-w-sm rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/model-3.jpg"
                  alt="Anjuman Mehjabin"
                  className="w-full h-auto object-cover"
                />
                {/* Subtle overlay gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-900/70 to-transparent" />
              </div>

              {/* Name badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 22 }}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-5 py-2.5 text-center whitespace-nowrap"
              >
                <p className="font-bold text-gray-900 text-sm">অঞ্জুমান মেহজাবিন</p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle2 size={12} className="text-green-500" />
                  <p className="text-green-600 text-xs font-medium">Brand Ambassador</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* --------- Right: Q&A Content --------- */}
          <div className="order-1 lg:order-2 space-y-5">
            {/* Section label */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-4 py-1.5 rounded-full text-sm font-semibold"
            >
              ⭐ সেলিব্রিটি এন্ডোর্সমেন্ট
            </motion.div>

            {/* Question bubble */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <p className="text-white/90 text-sm leading-relaxed">
                <span className="text-yellow-300 font-bold">❓ প্রশ্ন: </span>
                এটি কি অঞ্জুমান মেহজাবিন আপুর প্রোডাক্ট? আপু কি এই প্রোডাক্টটি খেয়েছেন?
              </p>
            </motion.div>

            {/* Answer */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.55, delay: 0.4 }}
              className="relative"
            >
              <div className="flex gap-4">
                {/* Accent bar */}
                <div className="w-1 rounded-full bg-yellow-400 flex-shrink-0 self-stretch" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-yellow-400 shrink-0" />
                    <span className="text-yellow-300 text-sm font-bold uppercase tracking-wide">
                      অঞ্জুমান মেহজাবিন আপুর উত্তর
                    </span>
                  </div>

                  {/* Big quote */}
                  <div className="relative">
                    <Quote
                      size={36}
                      className="absolute -top-2 -left-1 text-white/10"
                    />
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-white text-lg sm:text-xl font-semibold leading-relaxed pl-5"
                    >
                      আসসালামুওয়ালাইকুম সবাইকে, আমি সর্বশেষ এই প্রোডাক্টটি সেবন করে
                      মোটা হয়েছি। তাই আপনারা নিশ্চিন্তে এই প্রোডাক্টটি নিতে পারেন।
                    </motion.p>
                  </div>

                  {/* Extended detail */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-white/70 text-sm leading-relaxed pl-5"
                  >
                    Health Booster Supplement আমাকে রুচি বাড়াতে ও নিয়মিত খাবার
                    খেতে সাহায্য করেছে। Natural Ingredients দিয়ে তৈরি হওয়ায়
                    কোনো পার্শ্বপ্রতিক্রিয়া নেই। আমি নিজে ব্যবহার করে উপকার পেয়েছি
                    — তাই আমার প্রিয় সবাইকে recommend করছি। নিশ্চিন্তে
                    অর্ডার করুন! 💚
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-3.5 rounded-full shadow-xl transition-colors animate-cta-pulse"
              >
                <ShoppingCart size={18} />
                আজই অর্ডার করুন
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
