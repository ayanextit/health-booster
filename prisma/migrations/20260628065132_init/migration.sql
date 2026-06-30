-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "capsuleCount" INTEGER NOT NULL DEFAULT 30,
    "price" INTEGER NOT NULL,
    "salePrice" INTEGER,
    "badge" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "packageTitle" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "productPrice" INTEGER NOT NULL,
    "deliveryArea" TEXT NOT NULL,
    "deliveryCharge" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "totalAmount" INTEGER NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSettings" (
    "id" TEXT NOT NULL,
    "bkashNumber" TEXT NOT NULL DEFAULT '',
    "nagadNumber" TEXT NOT NULL DEFAULT '',
    "codEnabled" BOOLEAN NOT NULL DEFAULT true,
    "bkashEnabled" BOOLEAN NOT NULL DEFAULT true,
    "nagadEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Health Booster',
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "heroTitle" TEXT NOT NULL DEFAULT 'হেলদি ভাবে ওজন বাড়াতে ও রুচি বাড়াতে সহায়ক Health Booster Supplement',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Natural Ingredients দিয়ে তৈরি Health Booster Supplement রুচি, হজমশক্তি ও দৈনন্দিন এনার্জি সাপোর্ট করতে সাহায্য করে।',
    "announcementText" TEXT NOT NULL DEFAULT 'ঢাকার ভিতরে ১–২ দিন, ঢাকার বাইরে ২–৩ দিনে ডেলিভারি',
    "insideDhakaCharge" INTEGER NOT NULL DEFAULT 80,
    "outsideDhakaCharge" INTEGER NOT NULL DEFAULT 130,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
