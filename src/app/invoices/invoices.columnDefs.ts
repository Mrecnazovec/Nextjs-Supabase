import { ColDef } from "ag-grid-community";
import {
  InvoiceStatusEnum,
  InvoiceStatusLabel,
} from "@/shared/enums/InvoiceStatus.enum";
import {
  formatCurrencyValue,
  formatDateValue,
  formatPercentValue,
} from "@/shared/utils/GridValueFormatter";
import { InvoiceRow } from "@/shared/types/InvoiceRow.interface";

export const invoicesColumnDefs: ColDef<InvoiceRow>[] = [
  { field: "invoiceId", headerName: "Invoice ID" },
  { field: "customerName", headerName: "Customer Name" },
  { field: "customerEmail", headerName: "Customer Email", hide: true },
  {
    field: "invoiceDate",
    headerName: "Invoice Date",
    filter: "agDateColumnFilter",
    valueFormatter: ({ value }) => formatDateValue(value),
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    filter: "agDateColumnFilter",
    valueFormatter: ({ value }) => formatDateValue(value),
  },
  {
    field: "amount",
    headerName: "Amount",
    hide: true,
    filter: "agNumberColumnFilter",
    valueFormatter: ({ value }) => formatCurrencyValue(value),
  },
  {
    field: "tax",
    headerName: "Tax",
    hide: true,
    filter: "agNumberColumnFilter",
    valueFormatter: ({ value }) => formatPercentValue(value),
  },
  {
    field: "total",
    headerName: "Total",
    filter: "agNumberColumnFilter",
    valueFormatter: ({ value }) => formatCurrencyValue(value),
  },
  {
    field: "status",
    headerName: "Status",
    filter: "agTextColumnFilter",
    valueFormatter: ({ value }) =>
      InvoiceStatusLabel[value as InvoiceStatusEnum] ?? String(value ?? ""),
  },
  { field: "paymentMethod", headerName: "Payment Method", hide: true },
  { field: "notes", headerName: "Notes", hide: true },
];
