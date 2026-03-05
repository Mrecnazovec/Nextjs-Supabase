"use client";

import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/Button";
import { PROTECTED_URL } from "@/config/url.config";
import { API_URL } from "@/config/api.config";
import { AGGridTable } from "@/components/grid/AGGridTable";
import {
  InvoiceStatusEnum,
  InvoiceStatusLabel,
} from "@/shared/enums/InvoiceStatus.enum";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { ViewEntityTypeEnum } from "@/shared/enums/ViewEntityType.enum";
import {
  formatCurrencyValue,
  formatDateValue,
  formatPercentValue,
} from "@/shared/utils/GridValueFormatter";
import Link from "next/link";

interface InvoiceRow {
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  invoiceDate: string;
  dueDate: string;
  amount: string;
  tax: string;
  total: string;
  status: string;
  paymentMethod: string | null;
  notes: string | null;
}

interface InvoicesPageProps {
  initialRows?: InvoiceRow[];
  initialTotal?: number;
}

const columnDefs: ColDef<InvoiceRow>[] = [
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

export function InvoicesPage({ initialRows, initialTotal }: InvoicesPageProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-xs text-muted-foreground">
            Server-side sorting and filtering with saved user views.
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline">
                <Link href={PROTECTED_URL.dashboard()}>Back to dashboard</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Return to protected workspace overview.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      <AGGridTable<InvoiceRow>
        title="Invoices Grid"
        entityType={ViewEntityTypeEnum.INVOICES}
        dataEndpoint={API_URL.invoices()}
        columnDefs={columnDefs}
        initialRows={initialRows}
        initialTotal={initialTotal}
        initialBlockSize={100}
      />
    </main>
  );
}
