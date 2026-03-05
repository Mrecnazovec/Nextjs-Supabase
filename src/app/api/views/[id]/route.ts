import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/services/profile/profile.service";
import {
  deleteUserView,
  getUserViewById,
  updateUserView,
} from "@/services/views/views.service";

const updateViewSchema = z.object({
  name: z.string().min(1).optional(),
  columnState: z.custom<Prisma.InputJsonValue>().optional(),
  sortModel: z.custom<Prisma.InputJsonValue>().optional(),
  filterModel: z.custom<Prisma.InputJsonValue>().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const view = await getUserViewById(user.id, id);

  if (!view) {
    return NextResponse.json({ message: "View not found" }, { status: 404 });
  }

  return NextResponse.json({ data: view });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateViewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid payload",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ message: "No data to update" }, { status: 400 });
  }

  const { id } = await context.params;
  const updated = await updateUserView(user.id, id, parsed.data);

  if (updated.count === 0) {
    return NextResponse.json({ message: "View not found" }, { status: 404 });
  }

  const view = await getUserViewById(user.id, id);
  return NextResponse.json({ data: view });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteUserView(user.id, id);

  if (deleted.count === 0) {
    return NextResponse.json({ message: "View not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
