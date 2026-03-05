import { prisma } from "@/lib/prisma";
import { GridEntityType } from "@prisma/client";
import { CreateViewInput, UpdateViewInput } from "@/shared/types/Views.interface";

export async function getUserViews(userId: string, entityType?: GridEntityType) {
  return prisma.view.findMany({
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
  return prisma.view.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function createUserView(input: CreateViewInput) {
  return prisma.view.create({
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
  return prisma.view.updateMany({
    where: {
      id,
      userId,
    },
    data: input,
  });
}

export async function deleteUserView(userId: string, id: string) {
  return prisma.view.deleteMany({
    where: {
      id,
      userId,
    },
  });
}
