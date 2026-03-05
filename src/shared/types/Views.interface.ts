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

export interface GridViewState {
  columnState: unknown[];
  sortModel: unknown[];
  filterModel: Record<string, unknown>;
}

export interface UserView {
  id: string;
  userId: string;
  name: string;
  entityType: GridEntityType;
  columnState: unknown;
  sortModel: unknown;
  filterModel: unknown;
  createdAt: string;
  updatedAt: string;
}
