import { ColDef } from "ag-grid-community";
import { OrderStatusEnum, OrderStatusLabel } from "@/shared/enums/OrderStatus.enum";
import {
  formatCurrencyValue,
  formatDateValue,
  formatPercentValue,
} from "@/shared/utils/GridValueFormatter";
import { OrderRow } from "@/shared/types/OrderRow.interface";

export const ordersColumnDefs: ColDef<OrderRow>[] = [
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
