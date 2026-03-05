import { NextResponse, type NextRequest } from "next/server";
import {
  parseAgGridQuery,
} from "@/services/grid/grid-query.service";
import { getInvoicesGridData } from "@/services/invoices/invoices.service";
import { InvoicesSortFieldEnum } from "@/shared/enums/InvoicesSortField.enum";
import { SortDirectionEnum } from "@/shared/enums/SortDirection.enum";
import { InvoicesSortField } from "@/shared/types/Invoices.interface";

const INVOICE_SORT_FIELDS: readonly InvoicesSortField[] = [
  InvoicesSortFieldEnum.INVOICE_DATE,
  InvoicesSortFieldEnum.CUSTOMER_NAME,
  InvoicesSortFieldEnum.DUE_DATE,
  InvoicesSortFieldEnum.TOTAL,
  InvoicesSortFieldEnum.STATUS,
];

export async function GET(request: NextRequest) {
  const query = parseAgGridQuery(request.nextUrl.searchParams, {
    allowedSortFields: INVOICE_SORT_FIELDS,
    defaultSortBy: InvoicesSortFieldEnum.INVOICE_DATE,
    defaultSortDirection: SortDirectionEnum.DESC,
    defaultBlockSize: 100,
  });

  const result = await getInvoicesGridData(query);
  return NextResponse.json(result);
}
