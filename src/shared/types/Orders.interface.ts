import { Order } from "@prisma/client";
import { OrdersSortFieldEnum } from "@/shared/enums/OrdersSortField.enum";

export type OrdersSortField = OrdersSortFieldEnum;

export interface OrdersListResult {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
}
