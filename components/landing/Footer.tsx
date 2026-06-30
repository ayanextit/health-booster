"use client";
import { Leaf, Phone, MapPin, ExternalLink } from "lucide-react";

interface FooterProps {
  siteName: string;
  phone: string;
  address: string;
  facebookUrl: string;
}

export default function Footer({
  siteName,
  phone,
  address,
  facebookUrl,
}: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">{siteName}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Natural Ingredients দিয়ে তৈরি health supplement যা রুচি, হজমশক্তি
              ও হেলদি weight gain journey-তে সহায়ক।
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">যোগাযোগ</h4>
            <ul className="space-y-3">
              {phone && (
                <li className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-green-400 shrink-0" />
                  <span>{phone}</span>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2 text-sm">
                  <MapPin
                    size={16}
                    className="text-green-400 shrink-0 mt-0.5"
                  />
                  <span>{address}</span>
                </li>
              )}
              {facebookUrl && (
                <li className="flex items-center gap-2 text-sm">
                  <ExternalLink size={16} className="text-green-400 shrink-0" />
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-400 transition-colors"
                  >
                    Facebook Page
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-2">
              {[
                { label: "হোম", id: "hero" },
                { label: "উপকারিতা", id: "benefits" },
                { label: "প্রাইস", id: "pricing" },
                { label: "খাওয়ার নিয়ম", id: "dosage" },
                { label: "অর্ডার করুন", id: "order" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      document
                        .getElementById(item.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {siteName} Supplement. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            এই পণ্যটি রোগ নির্ণয়, চিকিৎসা বা প্রতিরোধের জন্য নয়।
          </p>
        </div>
      </div>
    </footer>
  );
}
