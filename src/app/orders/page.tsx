import { Metadata } from "next";
import { OrdersPage } from "./OrdersPage";
import { getOrdersGridData } from "@/services/orders/orders.service";
import { OrdersSortFieldEnum } from "@/shared/enums/OrdersSortField.enum";
import { SortDirectionEnum } from "@/shared/enums/SortDirection.enum";
import { connection } from "next/server";

const INITIAL_BLOCK_SIZE = 100;

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders AG-Grid with server-side sorting, filtering and saved views.",
};

export default async function OrdersRoutePage() {
  await connection();

  const initial = await getOrdersGridData({
    startRow: 0,
    endRow: INITIAL_BLOCK_SIZE,
    sortBy: OrdersSortFieldEnum.ORDER_DATE,
    sortDirection: SortDirectionEnum.DESC,
    filterModel: {},
  });

  return (
    <OrdersPage
      initialRows={JSON.parse(JSON.stringify(initial.rows))}
      initialTotal={initial.total}
    />
  );
}
