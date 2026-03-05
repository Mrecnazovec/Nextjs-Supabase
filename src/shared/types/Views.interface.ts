import { GridEntityType, Prisma } from "@prisma/client";

export interface CreateViewInput {
  userId: string;
  name: string;
  entityType: GridEntityType;
  columnState: Prisma.InputJsonValue;
  sortModel: Prisma.InputJsonValue;
  filterModel: Prisma.InputJsonValue;
}

export interface UpdateViewInput {
  name?: string;
  columnState?: Prisma.InputJsonValue;
  sortModel?: Prisma.InputJsonValue;
  filterModel?: Prisma.InputJsonValue;
}
