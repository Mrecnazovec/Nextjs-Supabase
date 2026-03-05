"use client";

import { API_URL } from "@/config/api.config";
import { INITIAL_GRID_BLOCK_SIZE } from "@/components/grid/constants";
import { GridEntityPage } from "@/components/grid/components/GridEntityPage";
import { ViewEntityTypeEnum } from "@/shared/enums/ViewEntityType.enum";
import { OrderRow } from "@/shared/types/OrderRow.interface";
import { ordersColumnDefs } from "./orders.columnDefs";

interface OrdersPageProps {
  initialRows?: OrderRow[];
  initialTotal?: number;
}

export function OrdersPage({ initialRows, initialTotal }: OrdersPageProps) {
  return (
    <GridEntityPage<OrderRow>
      pageTitle="Orders"
      pageDescription="Server-side sorting and filtering with saved user views."
      gridTitle="Orders Grid"
      entityType={ViewEntityTypeEnum.ORDERS}
      dataEndpoint={API_URL.orders()}
      columnDefs={ordersColumnDefs}
      initialRows={initialRows}
      initialTotal={initialTotal}
      initialBlockSize={INITIAL_GRID_BLOCK_SIZE}
    />
  );
}
