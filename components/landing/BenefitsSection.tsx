"use client";
import { Heart, Zap, Apple, TrendingUp, Shield, Star } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const benefits = [
  {
    icon: Apple,
    title: "রুচি বাড়াতে সহায়ক",
    desc: "খাবারের প্রতি স্বাভাবিক আগ্রহ তৈরিতে সহায়তা করে।",
  },
  {
    icon: Shield,
    title: "হজমশক্তি সাপোর্ট করে",
    desc: "হজমক্রিয়া সাভাবিক রাখতে সহায়ক।",
  },
  {
    icon: Heart,
    title: "খাবারের প্রতি আগ্রহ বাড়াতে সাহায্য করে",
    desc: "নিয়মিত খাবার গ্রহণে উৎসাহ জোগায়।",
  },
  {
    icon: Star,
    title: "পুষ্টি গ্রহণে সহায়ক",
    desc: "শরীরে পুষ্টির সঠিক শোষণে ভূমিকা রাখে।",
  },
  {
    icon: TrendingUp,
    title: "হেলদি Weight Gain Journey সাপোর্ট",
    desc: "ধীরে ধীরে সুস্থ ওজন বৃদ্ধির যাত্রায় সহায়তা।",
  },
  {
    icon: Zap,
    title: "দৈনন্দিন দুর্বলতা কমাতে সহায়ক",
    desc: "সারাদিনের এনার্জি লেভেল ধরে রাখতে সাহায্য করে।",
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export default function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="benefits"
      className="py-16 bg-gradient-to-br from-green-50 to-emerald-50"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Health Booster Supplement কীভাবে সাহায্য করে?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Natural Ingredients দিয়ে তৈরি, প্রতিদিনের সুস্বাস্থ্যের যাত্রায় সহায়ক।
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.25 },
            },
          }}
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-green-100 group cursor-default"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors duration-300">
                <benefit.icon
                  size={24}
                  className="text-green-600 group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{benefit.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
