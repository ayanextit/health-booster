import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL!);
  const isProduction = process.env.NODE_ENV === "production";
  const pool = new Pool({
    host: url.hostname,
    port: parseInt(url.port || "5432"),
    database: url.pathname.replace("/", "").split("?")[0],
    user: url.username,
    password: url.password || undefined,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });
  const adapter = new PrismaPg(pool);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
