import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const datasourceUrl = process.env.DATABASE_URL_RLS ?? process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error("DATABASE_URL_RLS or DATABASE_URL is not defined.");
}

const globalForPrismaRls = globalThis as unknown as {
  prismaRls?: PrismaClient;
};

const adapter = new PrismaPg({ connectionString: datasourceUrl });

export const prismaRls =
  globalForPrismaRls.prismaRls ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrismaRls.prismaRls = prismaRls;
}
