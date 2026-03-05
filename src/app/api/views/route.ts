import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { GridEntityType, Prisma } from "@prisma/client";
import { getCurrentUser } from "@/services/profile/profile.service";
import { createUserView, getUserViews } from "@/services/views/views.service";
import { ViewEntityTypeEnum } from "@/shared/enums/ViewEntityType.enum";

const createViewSchema = z.object({
  name: z.string().min(1, "name is required"),
  entityType: z.enum([ViewEntityTypeEnum.INVOICES, ViewEntityTypeEnum.ORDERS]),
  columnState: z.custom<Prisma.InputJsonValue>(),
  sortModel: z.custom<Prisma.InputJsonValue>(),
  filterModel: z.custom<Prisma.InputJsonValue>(),
});

const parseEntityType = (value: string | null): GridEntityType | undefined => {
  if (
    value === ViewEntityTypeEnum.ORDERS ||
    value === ViewEntityTypeEnum.INVOICES
  ) {
    return value as GridEntityType;
  }

  return undefined;
};

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const entityType = parseEntityType(request.nextUrl.searchParams.get("entityType"));
  const views = await getUserViews(user.id, entityType);

  return NextResponse.json({ data: views });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createViewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid payload",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const created = await createUserView({
    userId: user.id,
    ...parsed.data,
    entityType: parsed.data.entityType as GridEntityType,
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
