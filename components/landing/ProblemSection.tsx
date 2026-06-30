"use client";
import { AlertCircle } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const problems = [
  "খাবারে রুচি কম",
  "শরীর দুর্বল লাগে",
  "ওজন বাড়ছে না",
  "খাবার খেলেও পুষ্টি ধরে না",
  "হজমের সমস্যা",
  "এনার্জি কম লাগে",
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProblemSection() {
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            আপনার কি এই সমস্যাগুলো আছে?
          </h2>
          <p className="text-gray-500">
            এই সমস্যাগুলো অনেকেরই থাকে — আপনি একা নন।
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
        >
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 hover:shadow-md cursor-default"
            >
              <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={18} className="text-red-500" />
              </div>
              <span className="text-gray-800 font-medium text-sm">{problem}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 text-center bg-green-50 rounded-2xl p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-green-800 font-semibold text-lg">
            Health Booster Supplement এই সমস্যাগুলোতে সহায়ক হতে পারে! 👇
          </p>
        </motion.div>
      </div>
    </section>
  );
}
