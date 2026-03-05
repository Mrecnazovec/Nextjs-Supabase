export const InvoiceStatusEnum = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;

export type InvoiceStatusEnum =
  (typeof InvoiceStatusEnum)[keyof typeof InvoiceStatusEnum];

export const InvoiceStatusLabel: Record<InvoiceStatusEnum, string> = {
  [InvoiceStatusEnum.DRAFT]: "Draft",
  [InvoiceStatusEnum.SENT]: "Sent",
  [InvoiceStatusEnum.PAID]: "Paid",
  [InvoiceStatusEnum.OVERDUE]: "Overdue",
  [InvoiceStatusEnum.CANCELLED]: "Cancelled",
};
