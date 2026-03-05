import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/shared/types/Dashboard.interface";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [orders, invoices, views] = await Promise.all([
    prisma.order.count(),
    prisma.invoice.count(),
    prisma.view.count({ where: { userId } }),
  ]);

  return {
    orders,
    invoices,
    views,
  };
}
