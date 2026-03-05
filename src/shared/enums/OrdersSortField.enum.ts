export const OrdersSortFieldEnum = {
  ORDER_DATE: "orderDate",
  CUSTOMER_NAME: "customerName",
  ITEMS_COUNT: "itemsCount",
  TOTAL: "total",
  STATUS: "status",
} as const;

export type OrdersSortFieldEnum =
  (typeof OrdersSortFieldEnum)[keyof typeof OrdersSortFieldEnum];
