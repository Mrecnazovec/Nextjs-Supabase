import { prismaRls } from "@/lib/prisma-rls";
import { GridEntityType } from "@prisma/client";
import { CreateViewInput, UpdateViewInput } from "@/shared/types/Views.interface";

export async function getUserViews(userId: string, entityType?: GridEntityType) {
  return prismaRls.view.findMany({
    where: {
      userId,
      ...(entityType ? { entityType } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserViewById(userId: string, id: string) {
  return prismaRls.view.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function createUserView(input: CreateViewInput) {
  return prismaRls.view.create({
    data: {
      userId: input.userId,
      name: input.name,
      entityType: input.entityType,
      columnState: input.columnState,
      sortModel: input.sortModel,
      filterModel: input.filterModel,
    },
  });
}

export async function updateUserView(
  userId: string,
  id: string,
  input: UpdateViewInput,
) {
  return prismaRls.view.updateMany({
    where: {
      id,
      userId,
    },
    data: input,
  });
}

export async function deleteUserView(userId: string, id: string) {
  return prismaRls.view.deleteMany({
    where: {
      id,
      userId,
    },
  });
}
