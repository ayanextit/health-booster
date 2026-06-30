export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AnnouncementBar from "@/components/landing/AnnouncementBar";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import ProductDetails from "@/components/landing/ProductDetails";
import PricingSection from "@/components/landing/PricingSection";
import DosageSection from "@/components/landing/DosageSection";
import DeliverySection from "@/components/landing/DeliverySection";
import PaymentSection from "@/components/landing/PaymentSection";
import OrderForm from "@/components/landing/OrderForm";
import FAQSection from "@/components/landing/FAQSection";
import DisclaimerSection from "@/components/landing/DisclaimerSection";
import Footer from "@/components/landing/Footer";
import StickyOrderButton from "@/components/landing/StickyOrderButton";
import FloatingCTA from "@/components/landing/FloatingCTA";
import CelebrityEndorsement from "@/components/landing/CelebrityEndorsement";
import ReviewsSection from "@/components/landing/ReviewsSection";

async function getPageData() {
  let faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    const defaults = [
      { question: "কত দিনে ডেলিভারি পাবো?", answer: "ঢাকার ভিতরে ১–২ কার্যদিবসের মধ্যে এবং ঢাকার বাইরে ২–৩ কার্যদিবসের মধ্যে ডেলিভারি পাবেন।", sortOrder: 0 },
      { question: "কতদিনে রেজাল্ট পাবো?", answer: "৭ দিনের মধ্যেই পরিবর্তন বুঝতে পারবেন। ১টি ফাইল সম্পূর্ণ করলে ৫ থেকে ৭ কেজি ওজন বৃদ্ধি পাবেন।", sortOrder: 1 },
      { question: "কীভাবে খেতে হবে?", answer: "প্রথম ১ সপ্তাহ প্রতিদিন ২টি ক্যাপসুল — সকালে ও রাতে খাবারের ১০ মিনিট পর। এরপর থেকে প্রতিদিন সকালে ১টি করে।", sortOrder: 2 },
      { question: "Cash on Delivery আছে কি?", answer: "হ্যাঁ, আমরা Cash on Delivery সুবিধা দিয়ে থাকি। পণ্য হাতে পেয়ে পেমেন্ট করতে পারবেন।", sortOrder: 3 },
      { question: "Bkash/Nagad payment করা যাবে কি?", answer: "হ্যাঁ, Bkash ও Nagad Send Money-এর মাধ্যমে অ্যাডভান্স পেমেন্ট করা যায়। পেমেন্টের Transaction ID অর্ডার ফর্মে লিখতে হবে।", sortOrder: 4 },
      { question: "১ ফাইলে কয়টি ক্যাপসুল থাকে?", answer: "১টি ফাইলে ৩০টি ক্যাপসুল থাকে।", sortOrder: 5 },
      { question: "কারা সেবনের আগে ডাক্তারের পরামর্শ নেবেন?", answer: "গর্ভবতী মহিলা, দুগ্ধদানকারী মা, অসুস্থ ব্যক্তি, কম বয়সী ব্যক্তি অথবা নিয়মিত ওষুধ সেবনকারী হলে ব্যবহারের আগে অবশ্যই ডাক্তারের পরামর্শ নিন।", sortOrder: 6 },
    ];
    await prisma.fAQ.createMany({ data: defaults });
    faqCount = defaults.length;
  }

  const [siteSettings, paymentSettings, packages, reviewImages, faqs] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.paymentSettings.findFirst(),
    prisma.package.findMany({
      where: { status: "active" },
      orderBy: { price: "asc" },
    }),
    prisma.reviewImage.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.fAQ.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return { siteSettings, paymentSettings, packages, reviewImages, faqs };
}

export default async function HomePage() {
  const { siteSettings, paymentSettings, packages, reviewImages, faqs } = await getPageData();

  const site = siteSettings ?? {
    siteName: "Health Booster",
    phone: "01700000000",
    address: "",
    facebookUrl: "",
    heroTitle:
      "হেলদি ভাবে ওজন বাড়াতে ও রুচি বাড়াতে সহায়ক Health Booster Supplement",
    heroSubtitle:
      "Natural Ingredients দিয়ে তৈরি Health Booster Supplement রুচি, হজমশক্তি ও দৈনন্দিন এনার্জি সাপোর্ট করতে সাহায্য করে।",
    announcementText:
      "ঢাকার ভিতরে ১–২ দিন, ঢাকার বাইরে ২–৩ দিনে ডেলিভারি",
    insideDhakaCharge: 80,
    outsideDhakaCharge: 130,
    productImageUrl: "",
  };

  const payment = paymentSettings ?? {
    bkashNumber: "",
    nagadNumber: "",
    codEnabled: true,
    bkashEnabled: true,
    nagadEnabled: true,
  };

  return (
    <main className="flex-1">
      <AnnouncementBar text={site.announcementText} />
      <Navbar />
      <HeroSection
        title={site.heroTitle}
        subtitle={site.heroSubtitle}
        productImageUrl={site.productImageUrl || "/images/model-1.jpg"}
      />
      <ProblemSection />
      <CelebrityEndorsement />
      <BenefitsSection />
      <ProductDetails />
      <PricingSection packages={packages} />
      <DosageSection />
      <DeliverySection
        insideDhakaCharge={site.insideDhakaCharge}
        outsideDhakaCharge={site.outsideDhakaCharge}
      />
      <PaymentSection
        codEnabled={payment.codEnabled}
        bkashEnabled={payment.bkashEnabled}
        nagadEnabled={payment.nagadEnabled}
        bkashNumber={payment.bkashNumber}
        nagadNumber={payment.nagadNumber}
      />
      <OrderForm
        packages={packages}
        insideDhakaCharge={site.insideDhakaCharge}
        outsideDhakaCharge={site.outsideDhakaCharge}
      />
      <ReviewsSection images={reviewImages} />
      <FAQSection faqs={faqs} />
      <DisclaimerSection />
      <Footer
        siteName={site.siteName}
        phone={site.phone}
        address={site.address}
        facebookUrl={site.facebookUrl}
      />
      <StickyOrderButton />
      <FloatingCTA phone={site.phone} />
    </main>
  );
}
