export const SortDirectionEnum = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortDirectionEnum =
  (typeof SortDirectionEnum)[keyof typeof SortDirectionEnum];
