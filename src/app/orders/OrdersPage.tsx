"use client";

import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/Button";
import { PROTECTED_URL } from "@/config/url.config";
import { API_URL } from "@/config/api.config";
import { AGGridTable } from "@/components/grid/AGGridTable";
import {
  OrderStatusEnum,
  OrderStatusLabel,
} from "@/shared/enums/OrderStatus.enum";
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

interface OrderRow {
  orderId: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  shippingAddress: string;
  itemsCount: number;
  subtotal: string;
  shippingCost: string;
  discount: string;
  total: string;
  status: string;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
}

interface OrdersPageProps {
  initialRows?: OrderRow[];
  initialTotal?: number;
}

const columnDefs: ColDef<OrderRow>[] = [
  { field: "orderId", headerName: "Order ID" },
  { field: "customerName", headerName: "Customer Name" },
  { field: "customerPhone", headerName: "Customer Phone", hide: true },
  {
    field: "orderDate",
    headerName: "Order Date",
    filter: "agDateColumnFilter",
    valueFormatter: ({ value }) => formatDateValue(value),
  },
  { field: "shippingAddress", headerName: "Shipping Address", hide: true },
  { field: "itemsCount", headerName: "Items Count" },
  {
    field: "subtotal",
    headerName: "Subtotal",
    hide: true,
    filter: "agNumberColumnFilter",
    valueFormatter: ({ value }) => formatCurrencyValue(value),
  },
  {
    field: "shippingCost",
    headerName: "Shipping Cost",
    hide: true,
    filter: "agNumberColumnFilter",
    valueFormatter: ({ value }) => formatCurrencyValue(value),
  },
  {
    field: "discount",
    headerName: "Discount",
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
      OrderStatusLabel[value as OrderStatusEnum] ?? String(value ?? ""),
  },
  { field: "trackingNumber", headerName: "Tracking Number" },
  {
    field: "estimatedDelivery",
    headerName: "Estimated Delivery",
    hide: true,
    filter: "agDateColumnFilter",
    valueFormatter: ({ value }) => formatDateValue(value),
  },
];

export function OrdersPage({ initialRows, initialTotal }: OrdersPageProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
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
      <AGGridTable<OrderRow>
        title="Orders Grid"
        entityType={ViewEntityTypeEnum.ORDERS}
        dataEndpoint={API_URL.orders()}
        columnDefs={columnDefs}
        initialRows={initialRows}
        initialTotal={initialTotal}
        initialBlockSize={100}
      />
    </main>
  );
}
