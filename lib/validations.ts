import { z } from "zod";

const bangladeshiPhone = z
  .string()
  .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "সঠিক বাংলাদেশী মোবাইল নম্বর দিন");

export const orderSchema = z
  .object({
    customerName: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে"),
    customerEmail: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
    phone: bangladeshiPhone,
    address: z.string().min(10, "পূর্ণ ঠিকানা লিখুন (বাড়ির নম্বর, এলাকা, জেলাসহ)"),
    packageId: z.string().min(1, "প্যাকেজ সিলেক্ট করুন"),
    deliveryArea: z
      .string()
      .refine((v) => v === "inside_dhaka" || v === "outside_dhaka", {
        message: "ডেলিভারি এলাকা সিলেক্ট করুন",
      }),
    paymentMethod: z
      .string()
      .refine((v) => ["cod", "bkash", "nagad"].includes(v), {
        message: "পেমেন্ট পদ্ধতি সিলেক্ট করুন",
      }),
    transactionId: z.string().optional(),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.paymentMethod === "bkash" || data.paymentMethod === "nagad") &&
      !data.transactionId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Transaction ID দিন",
        path: ["transactionId"],
      });
    }
  });

export type OrderFormData = z.infer<typeof orderSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

export const packageSchema = z.object({
  title: z.string().min(1, "প্যাকেজের নাম দিন"),
  quantity: z.coerce.number().int().min(1),
  capsuleCount: z.coerce.number().int().min(1),
  price: z.coerce.number().int().min(1, "মূল্য দিন"),
  salePrice: z.coerce.number().int().optional().nullable(),
  badge: z.string().optional().nullable(),
  isPopular: z.boolean().optional(),
  status: z.enum(["active", "inactive"]),
});

export type PackageFormData = z.infer<typeof packageSchema>;

export const paymentSettingsSchema = z.object({
  bkashNumber: z.string(),
  nagadNumber: z.string(),
  codEnabled: z.boolean(),
  bkashEnabled: z.boolean(),
  nagadEnabled: z.boolean(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  phone: z.string(),
  address: z.string(),
  facebookUrl: z.string(),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  announcementText: z.string().min(1),
  insideDhakaCharge: z.coerce.number().int().min(0),
  outsideDhakaCharge: z.coerce.number().int().min(0),
});

export const emailSettingsSchema = z.object({
  smtpHost: z.string(),
  smtpPort: z.coerce.number().int().min(1).max(65535),
  smtpSecure: z.boolean(),
  smtpUser: z.string(),
  smtpPass: z.string(),
  fromName: z.string(),
  fromEmail: z.string(),
});
