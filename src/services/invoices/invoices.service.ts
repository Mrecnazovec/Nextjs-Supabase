import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/services/grid/grid-query.service";
import { Prisma } from "@prisma/client";
import { InvoicesSortFieldEnum } from "@/shared/enums/InvoicesSortField.enum";
import { GridListQuery } from "@/shared/types/GridQuery.interface";
import {
  InvoicesListResult,
  InvoicesSortField,
} from "@/shared/types/Invoices.interface";

const INVOICE_SORT_FIELDS: Record<InvoicesSortField, Prisma.InvoiceScalarFieldEnum> = {
  [InvoicesSortFieldEnum.INVOICE_DATE]: "invoiceDate",
  [InvoicesSortFieldEnum.CUSTOMER_NAME]: "customerName",
  [InvoicesSortFieldEnum.DUE_DATE]: "dueDate",
  [InvoicesSortFieldEnum.TOTAL]: "total",
  [InvoicesSortFieldEnum.STATUS]: "status",
};

export async function getInvoicesList(
  query: GridListQuery<InvoicesSortField>,
): Promise<InvoicesListResult> {
  const { skip, take } = getPaginationParams(query.page, query.pageSize);
  const orderByField = INVOICE_SORT_FIELDS[query.sortBy];
  const orderBy: Prisma.InvoiceOrderByWithRelationInput = {
    [orderByField]: query.sortDirection,
  };

  const [data, total] = await Promise.all([
    prisma.invoice.findMany({
      skip,
      take,
      orderBy,
    }),
    prisma.invoice.count(),
  ]);

  return {
    data,
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}
