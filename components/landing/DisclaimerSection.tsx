"use client";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerSection() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-lg mb-2">
                গুরুত্বপূর্ণ বিজ্ঞপ্তি / Disclaimer
              </h3>
              <p className="text-amber-800 leading-relaxed text-sm">
                এটি কোনো রোগ নিরাময়ের ঔষধ নয়। এটি একটি health supplement।
                গর্ভবতী, দুগ্ধদানকারী মা, অসুস্থ ব্যক্তি, কম বয়সী ব্যক্তি
                অথবা নিয়মিত ওষুধ সেবনকারী হলে ব্যবহারের আগে ডাক্তারের
                পরামর্শ নিন। ফলাফল ব্যক্তিভেদে ভিন্ন হতে পারে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
