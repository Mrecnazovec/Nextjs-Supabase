export const InvoicesSortFieldEnum = {
  INVOICE_DATE: "invoiceDate",
  CUSTOMER_NAME: "customerName",
  DUE_DATE: "dueDate",
  TOTAL: "total",
  STATUS: "status",
} as const;

export type InvoicesSortFieldEnum =
  (typeof InvoicesSortFieldEnum)[keyof typeof InvoicesSortFieldEnum];
