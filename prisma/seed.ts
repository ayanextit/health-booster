import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const url = new URL(process.env.DATABASE_URL!);
const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port || "5432"),
  database: url.pathname.replace("/", "").split("?")[0],
  user: url.username,
  password: url.password || undefined,
});
const adapter = new PrismaPg(pool);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("Seeding database...");

  // Create product
  const product = await prisma.product.upsert({
    where: { slug: "health-booster-supplement" },
    update: {},
    create: {
      name: "Health Booster Supplement",
      slug: "health-booster-supplement",
      description:
        "Health Booster Supplement রুচি ও হজমশক্তি সাপোর্ট করতে সহায়ক। রুচি বাড়লে নিয়মিত খাবার গ্রহণ সহজ হয়, ফলে শরীরে পুষ্টি গ্রহণে সহায়তা হয় এবং ধীরে ধীরে হেলদি weight gain journey-তে support করতে পারে।",
      status: "active",
    },
  });

  await prisma.package.upsert({
    where: { id: "pkg-1-file" },
    update: { price: 1000, title: "১ ফাইল", quantity: 1, capsuleCount: 30 },
    create: {
      id: "pkg-1-file",
      productId: product.id,
      title: "১ ফাইল",
      quantity: 1,
      capsuleCount: 30,
      price: 1000,
      badge: null,
      isPopular: false,
      status: "active",
    },
  });

  await prisma.package.upsert({
    where: { id: "pkg-2-file" },
    update: { price: 1800, title: "২ ফাইল", quantity: 2, capsuleCount: 60 },
    create: {
      id: "pkg-2-file",
      productId: product.id,
      title: "২ ফাইল",
      quantity: 2,
      capsuleCount: 60,
      price: 1800,
      badge: "Popular",
      isPopular: true,
      status: "active",
    },
  });

  await prisma.package.upsert({
    where: { id: "pkg-3-file" },
    update: { price: 2500, title: "৩ ফাইল", quantity: 3, capsuleCount: 90 },
    create: {
      id: "pkg-3-file",
      productId: product.id,
      title: "৩ ফাইল",
      quantity: 3,
      capsuleCount: 90,
      price: 2500,
      badge: "Best Value",
      isPopular: false,
      status: "active",
    },
  });

  const existingPayment = await prisma.paymentSettings.findFirst();
  if (!existingPayment) {
    await prisma.paymentSettings.create({
      data: {
        bkashNumber: "01700000000",
        nagadNumber: "01800000000",
        codEnabled: true,
        bkashEnabled: true,
        nagadEnabled: true,
      },
    });
  }

  const existingSite = await prisma.siteSettings.findFirst();
  if (!existingSite) {
    await prisma.siteSettings.create({
      data: {
        siteName: "Health Booster",
        phone: "01700000000",
        address: "ঢাকা, বাংলাদেশ",
        facebookUrl: "https://facebook.com/healthbooster",
        heroTitle:
          "হেলদি ভাবে ওজন বাড়াতে ও রুচি বাড়াতে সহায়ক Health Booster Supplement",
        heroSubtitle:
          "Natural Ingredients দিয়ে তৈরি Health Booster Supplement রুচি, হজমশক্তি ও দৈনন্দিন এনার্জি সাপোর্ট করতে সাহায্য করে।",
        announcementText:
          "ঢাকার ভিতরে ১–২ দিন, ঢাকার বাইরে ২–৩ দিনে ডেলিভারি",
        insideDhakaCharge: 80,
        outsideDhakaCharge: 130,
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
