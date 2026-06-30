"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";
import { Star, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

interface ReviewsSectionProps {
  images: ReviewImage[];
}

const DEFAULT_REVIEWS = [
  "/images/reviews/R01.jpg",
  "/images/reviews/R02.jpg",
  "/images/reviews/R03.jpg",
  "/images/reviews/R04.jpg",
  "/images/reviews/R05.jpg",
];

const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  }),
};

export default function ReviewsSection({ images }: ReviewsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const reviewUrls =
    images.length > 0 ? images.map((img) => img.imageUrl) : DEFAULT_REVIEWS;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = reviewUrls.length;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  // Auto-play every 3.5 seconds
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Star size={14} className="fill-yellow-500 text-yellow-500" />
            <span>ব্যবহারকারীদের মতামত</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            সত্যিকারের গ্রাহকদের রিভিউ
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            হাজারো মানুষ Health Booster Supplement ব্যবহার করে উপকার পাচ্ছেন।
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-gray-600 font-semibold text-sm">৫/৫ রেটিং</span>
            <span className="text-gray-400 text-sm ml-1">(১০০০+ রিভিউ)</span>
          </div>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Slide area */}
            <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reviewUrls[current]}
                    alt={`Customer Review ${current + 1}`}
                    className="w-full h-full object-contain bg-[#f9f5ee]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Left arrow */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Right arrow */}
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>

              {/* Counter badge */}
              <div className="absolute top-3 right-3 z-10 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                {current + 1} / {total}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {reviewUrls.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === current
                      ? "bg-green-600 w-7 h-2.5"
                      : "bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Thumbnail strip */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 overflow-x-auto pb-1 scrollbar-none">
              {reviewUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`rounded-xl overflow-hidden shrink-0 transition-all duration-200 w-10 h-10 sm:w-14 sm:h-14 ${
                    idx === current
                      ? "ring-2 ring-green-500 ring-offset-2 opacity-100 scale-105"
                      : "opacity-50 hover:opacity-80 scale-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
            <MessageCircle size={22} className="text-green-600 shrink-0" />
            <p className="text-gray-700 text-sm">
              <span className="font-bold text-green-700">আপনিও উপকৃত হোন!</span>{" "}
              আজই অর্ডার করুন এবং ১–৩ সপ্তাহে পার্থক্য অনুভব করুন।
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() =>
                document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })
              }
              className="shrink-0 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              অর্ডার করুন
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
