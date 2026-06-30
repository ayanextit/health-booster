import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("bn-BD")}`;
}

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Processing: "bg-purple-100 text-purple-800",
  Shipped: "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: "পেন্ডিং",
  Confirmed: "কনফার্ম",
  Processing: "প্রসেসিং",
  Shipped: "শিপড",
  Delivered: "ডেলিভারড",
  Cancelled: "বাতিল",
};
