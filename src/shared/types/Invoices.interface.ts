import { Invoice } from "@prisma/client";
import { InvoicesSortFieldEnum } from "@/shared/enums/InvoicesSortField.enum";

export type InvoicesSortField = InvoicesSortFieldEnum;

export interface InvoicesListResult {
  data: Invoice[];
  total: number;
  page: number;
  pageSize: number;
}
