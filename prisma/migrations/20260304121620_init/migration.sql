-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'processing', 'delivered');

-- CreateEnum
CREATE TYPE "GridEntityType" AS ENUM ('invoices', 'orders');

-- CreateTable
CREATE TABLE "invoices" (
    "invoice_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "tax" DECIMAL(5,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL,
    "payment_method" TEXT,
    "notes" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "items_count" INTEGER NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "shipping_cost" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(5,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "tracking_number" TEXT,
    "estimated_delivery" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "views" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity_type" "GridEntityType" NOT NULL,
    "column_state" JSONB NOT NULL,
    "sort_model" JSONB NOT NULL,
    "filter_model" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "views_user_id_entity_type_idx" ON "views"("user_id", "entity_type");
