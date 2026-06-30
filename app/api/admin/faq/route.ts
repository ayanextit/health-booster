import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_FAQS = [
  { question: "কত দিনে ডেলিভারি পাবো?", answer: "ঢাকার ভিতরে ১–২ কার্যদিবসের মধ্যে এবং ঢাকার বাইরে ২–৩ কার্যদিবসের মধ্যে ডেলিভারি পাবেন।", sortOrder: 0 },
  { question: "কতদিনে রেজাল্ট পাবো?", answer: "৭ দিনের মধ্যেই পরিবর্তন বুঝতে পারবেন। ১টি ফাইল সম্পূর্ণ করলে ৫ থেকে ৭ কেজি ওজন বৃদ্ধি পাবেন।", sortOrder: 1 },
  { question: "কীভাবে খেতে হবে?", answer: "প্রথম ১ সপ্তাহ প্রতিদিন ২টি ক্যাপসুল — সকালে ও রাতে খাবারের ১০ মিনিট পর। এরপর থেকে প্রতিদিন সকালে ১টি করে।", sortOrder: 2 },
  { question: "Cash on Delivery আছে কি?", answer: "হ্যাঁ, আমরা Cash on Delivery সুবিধা দিয়ে থাকি। পণ্য হাতে পেয়ে পেমেন্ট করতে পারবেন।", sortOrder: 3 },
  { question: "Bkash/Nagad payment করা যাবে কি?", answer: "হ্যাঁ, Bkash ও Nagad Send Money-এর মাধ্যমে অ্যাডভান্স পেমেন্ট করা যায়। পেমেন্টের Transaction ID অর্ডার ফর্মে লিখতে হবে।", sortOrder: 4 },
  { question: "১ ফাইলে কয়টি ক্যাপসুল থাকে?", answer: "১টি ফাইলে ৩০টি ক্যাপসুল থাকে।", sortOrder: 5 },
  { question: "কারা সেবনের আগে ডাক্তারের পরামর্শ নেবেন?", answer: "গর্ভবতী মহিলা, দুগ্ধদানকারী মা, অসুস্থ ব্যক্তি, কম বয়সী ব্যক্তি অথবা নিয়মিত ওষুধ সেবনকারী হলে ব্যবহারের আগে অবশ্যই ডাক্তারের পরামর্শ নিন।", sortOrder: 6 },
];

async function auth(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await auth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const count = await prisma.fAQ.count();
  if (count === 0) {
    await prisma.fAQ.createMany({ data: DEFAULT_FAQS });
  }

  const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  if (!(await auth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { question, answer, isActive } = await req.json();
  if (!question || !answer) return NextResponse.json({ error: "Question and answer required" }, { status: 400 });

  const count = await prisma.fAQ.count();
  const faq = await prisma.fAQ.create({
    data: { question, answer, isActive: isActive ?? true, sortOrder: count },
  });
  return NextResponse.json({ faq });
}

export async function PUT(req: NextRequest) {
  if (!(await auth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, question, answer, isActive, sortOrder } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const faq = await prisma.fAQ.update({
    where: { id },
    data: { question, answer, isActive, sortOrder },
  });
  return NextResponse.json({ faq });
}

export async function DELETE(req: NextRequest) {
  if (!(await auth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
