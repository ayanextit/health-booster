"use client";
import { Star } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    image: "/images/model-1.jpg",
    name: "রাহেলা বেগম",
    location: "ঢাকা",
    text: "Health Booster ব্যবহার করে রুচি অনেক বেড়ে গেছে। এখন নিয়মিত খাবার খেতে পারছি। শরীরে অনেক পার্থক্য অনুভব করছি।",
    stars: 5,
  },
  {
    image: "/images/model-2.jpg",
    name: "সুমাইয়া আক্তার",
    location: "চট্টগ্রাম",
    text: "Natural ingredients হওয়ায় কোনো পার্শ্বপ্রতিক্রিয়া নেই। ২ মাস ব্যবহারে শরীরে ভালো পরিবর্তন দেখছি। সবাইকে recommend করি।",
    stars: 5,
  },
  {
    image: "/images/model-3.jpg",
    name: "নাদিয়া হোসেন",
    location: "সিলেট",
    text: "রুচি ফিরে পেয়ে খুব ভালো লাগছে। প্রতিদিন নিয়মিত সেবন করছি এবং শরীরে শক্তি অনুভব করছি।",
    stars: 5,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function TestimonialsSection() {
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
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Star size={14} className="fill-yellow-500 text-yellow-500" />
            <span>ব্যবহারকারীদের মতামত</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            সবাই বলছেন Health Booster সম্পর্কে
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            হাজারো মানুষ Health Booster Supplement ব্যবহার করে উপকার পাচ্ছেন।
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.25 },
            },
          }}
        >
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              transition={{ duration: 0.55, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Photo */}
              <div className="h-72 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} size={15} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  &ldquo;{item.text}&rdquo;
                </p>

                {/* Name + badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs">{item.location}</p>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    ✓ ব্যবহারকারী
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
