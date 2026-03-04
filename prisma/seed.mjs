import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const datasourceUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL must be defined for seeding.");
}

const adapter = new PrismaPg({ connectionString: datasourceUrl });
const prisma = new PrismaClient({ adapter });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const readJson = async (relativePath) => {
  const filePath = path.join(rootDir, relativePath);
  const fileContent = await readFile(filePath, "utf8");
  return JSON.parse(fileContent);
};

const toOrderCreateManyData = (orders) =>
  orders.map((item) => ({
    orderId: item.order_id,
    customerName: item.customer_name,
    customerPhone: item.customer_phone,
    orderDate: new Date(item.order_date),
    shippingAddress: item.shipping_address,
    itemsCount: item.items_count,
    subtotal: item.subtotal,
    shippingCost: item.shipping_cost,
    discount: item.discount,
    total: item.total,
    status: item.status,
    trackingNumber: item.tracking_number,
    estimatedDelivery: item.estimated_delivery
      ? new Date(item.estimated_delivery)
      : null,
  }));

const toInvoiceCreateManyData = (invoices) =>
  invoices.map((item) => ({
    invoiceId: item.invoice_id,
    customerName: item.customer_name,
    customerEmail: item.customer_email,
    invoiceDate: new Date(item.invoice_date),
    dueDate: new Date(item.due_date),
    amount: item.amount,
    tax: item.tax,
    total: item.total,
    status: item.status,
    paymentMethod: item.payment_method,
    notes: item.notes,
  }));

const main = async () => {
  const [orders, invoices] = await Promise.all([
    readJson("data/orders.json"),
    readJson("data/invoices.json"),
  ]);

  await prisma.$transaction([
    prisma.order.deleteMany(),
    prisma.invoice.deleteMany(),
  ]);

  await prisma.order.createMany({
    data: toOrderCreateManyData(orders),
    skipDuplicates: true,
  });

  await prisma.invoice.createMany({
    data: toInvoiceCreateManyData(invoices),
    skipDuplicates: true,
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Prisma seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
