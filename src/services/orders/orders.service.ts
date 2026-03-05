import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/services/grid/grid-query.service";
import { Prisma } from "@prisma/client";
import { OrdersSortFieldEnum } from "@/shared/enums/OrdersSortField.enum";
import { GridListQuery } from "@/shared/types/GridQuery.interface";
import {
  OrdersListResult,
  OrdersSortField,
} from "@/shared/types/Orders.interface";

const ORDER_SORT_FIELDS: Record<OrdersSortField, Prisma.OrderScalarFieldEnum> = {
  [OrdersSortFieldEnum.ORDER_DATE]: "orderDate",
  [OrdersSortFieldEnum.CUSTOMER_NAME]: "customerName",
  [OrdersSortFieldEnum.ITEMS_COUNT]: "itemsCount",
  [OrdersSortFieldEnum.TOTAL]: "total",
  [OrdersSortFieldEnum.STATUS]: "status",
};

export async function getOrdersList(
  query: GridListQuery<OrdersSortField>,
): Promise<OrdersListResult> {
  const { skip, take } = getPaginationParams(query.page, query.pageSize);
  const orderByField = ORDER_SORT_FIELDS[query.sortBy];
  const orderBy: Prisma.OrderOrderByWithRelationInput = {
    [orderByField]: query.sortDirection,
  };

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take,
      orderBy,
    }),
    prisma.order.count(),
  ]);

  return {
    data,
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}
