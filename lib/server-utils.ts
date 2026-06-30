import { prisma } from "./prisma";

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.order.count();
  const padded = String(count + 1).padStart(6, "0");
  return `HB-${year}-${padded}`;
}
