"use client";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-green-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-green-800">
              Health Booster
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: "হোম", id: "hero" },
              { label: "উপকারিতা", id: "benefits" },
              { label: "প্রাইস", id: "pricing" },
              { label: "খাওয়ার নিয়ম", id: "dosage" },
              { label: "অর্ডার করুন", id: "order" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-gray-700 hover:text-green-700 font-medium text-sm transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("order")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors shadow-md"
            >
              Order Now
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-green-100 mt-2 pt-3 space-y-2">
            {[
              { label: "হোম", id: "hero" },
              { label: "উপকারিতা", id: "benefits" },
              { label: "প্রাইস", id: "pricing" },
              { label: "খাওয়ার নিয়ম", id: "dosage" },
              { label: "অর্ডার করুন", id: "order" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg font-medium"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("order")}
              className="w-full bg-green-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm mt-2"
            >
              Order Now
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
