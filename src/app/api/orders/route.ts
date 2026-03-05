import { NextResponse, type NextRequest } from "next/server";
import {
  parseAgGridQuery,
} from "@/services/grid/grid-query.service";
import { getOrdersGridData } from "@/services/orders/orders.service";
import { OrdersSortFieldEnum } from "@/shared/enums/OrdersSortField.enum";
import { SortDirectionEnum } from "@/shared/enums/SortDirection.enum";
import { OrdersSortField } from "@/shared/types/Orders.interface";

const ORDER_SORT_FIELDS: readonly OrdersSortField[] = [
  OrdersSortFieldEnum.ORDER_DATE,
  OrdersSortFieldEnum.CUSTOMER_NAME,
  OrdersSortFieldEnum.ITEMS_COUNT,
  OrdersSortFieldEnum.TOTAL,
  OrdersSortFieldEnum.STATUS,
];

export async function GET(request: NextRequest) {
  const query = parseAgGridQuery(request.nextUrl.searchParams, {
    allowedSortFields: ORDER_SORT_FIELDS,
    defaultSortBy: OrdersSortFieldEnum.ORDER_DATE,
    defaultSortDirection: SortDirectionEnum.DESC,
    defaultBlockSize: 100,
  });

  const result = await getOrdersGridData(query);
  return NextResponse.json(result);
}
