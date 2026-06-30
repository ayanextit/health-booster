"use client";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingCTAProps {
  phone: string;
}

export default function FloatingCTA({ phone }: FloatingCTAProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const raw = phone.replace(/\D/g, "");
  const waNumber = raw.startsWith("88") ? raw : `88${raw}`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("আমি Health Booster Supplement সম্পর্কে জানতে চাই।")}`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 40 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0, opacity: 0, x: 40 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="fixed bottom-24 right-4 z-50 md:bottom-10 flex flex-col items-center gap-1"
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp-এ যোগাযোগ করুন"
            className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-2xl transition-colors"
          >
            <MessageCircle size={28} fill="white" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
          </a>
          <span className="text-[10px] font-semibold text-gray-600 bg-white/90 px-2 py-0.5 rounded-full shadow">
            WhatsApp
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
