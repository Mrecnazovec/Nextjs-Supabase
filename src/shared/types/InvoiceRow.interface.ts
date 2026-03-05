export interface InvoiceRow {
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
