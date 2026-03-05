export const ViewEntityTypeEnum = {
  ORDERS: "orders",
  INVOICES: "invoices",
} as const;

export type ViewEntityTypeEnum =
  (typeof ViewEntityTypeEnum)[keyof typeof ViewEntityTypeEnum];
