import { NextResponse, type NextRequest } from "next/server";
import {
  parseGridListQuery,
} from "@/services/grid/grid-query.service";
import { getOrdersList } from "@/services/orders/orders.service";
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
  const query = parseGridListQuery(request.nextUrl.searchParams, {
    allowedSortFields: ORDER_SORT_FIELDS,
    defaultSortBy: OrdersSortFieldEnum.ORDER_DATE,
    defaultSortDirection: SortDirectionEnum.DESC,
    defaultPageSize: 20,
  });

  const result = await getOrdersList(query);
  return NextResponse.json(result);
}
