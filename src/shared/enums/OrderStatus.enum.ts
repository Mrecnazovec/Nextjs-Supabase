export const OrderStatusEnum = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  DELIVERED: "delivered",
} as const;

export type OrderStatusEnum =
  (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum];

export const OrderStatusLabel: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.PENDING]: "Pending",
  [OrderStatusEnum.CONFIRMED]: "Confirmed",
  [OrderStatusEnum.PROCESSING]: "Processing",
  [OrderStatusEnum.DELIVERED]: "Delivered",
};
