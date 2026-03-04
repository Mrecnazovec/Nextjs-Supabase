import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [orders, invoices, views] = await Promise.all([
    prisma.order.count(),
    prisma.invoice.count(),
    prisma.view.count({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({
    orders,
    invoices,
    views,
  });
}
