export interface OrderRow {
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
