import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { InvoicesSortFieldEnum } from "@/shared/enums/InvoicesSortField.enum";
import { GridDataQuery, GridDataResult } from "@/shared/types/GridData.interface";
import { InvoicesSortField } from "@/shared/types/Invoices.interface";

const INVOICE_SORT_FIELDS: Record<InvoicesSortField, Prisma.InvoiceScalarFieldEnum> = {
  [InvoicesSortFieldEnum.INVOICE_DATE]: "invoiceDate",
  [InvoicesSortFieldEnum.CUSTOMER_NAME]: "customerName",
  [InvoicesSortFieldEnum.DUE_DATE]: "dueDate",
  [InvoicesSortFieldEnum.TOTAL]: "total",
  [InvoicesSortFieldEnum.STATUS]: "status",
};

const TEXT_FIELDS: ReadonlySet<string> = new Set([
  "invoiceId",
  "customerName",
  "customerEmail",
  "paymentMethod",
  "notes",
  "status",
]);

const NUMBER_FIELDS: ReadonlySet<string> = new Set(["amount", "tax", "total"]);

const DATE_FIELDS: ReadonlySet<string> = new Set(["invoiceDate", "dueDate"]);

function getStringFilter(model: Record<string, unknown>): Prisma.StringFilter | undefined {
  if (model.filterType === "set" && Array.isArray(model.values)) {
    const values = model.values.filter((value) => typeof value === "string") as string[];
    return values.length > 0 ? { in: values } : undefined;
  }

  const type = model.type;
  const filter = typeof model.filter === "string" ? model.filter : "";

  if (!filter) {
    return undefined;
  }

  if (type === "equals") return { equals: filter };
  if (type === "notEqual") return { not: filter };
  if (type === "startsWith") return { startsWith: filter, mode: "insensitive" };
  if (type === "endsWith") return { endsWith: filter, mode: "insensitive" };

  return { contains: filter, mode: "insensitive" };
}

function getNumberFilter(model: Record<string, unknown>): Prisma.DecimalFilter | undefined {
  const filterValue = Number(model.filter);

  if (!Number.isFinite(filterValue)) {
    return undefined;
  }

  const type = model.type;

  if (type === "equals") return { equals: filterValue };
  if (type === "notEqual") return { not: filterValue };
  if (type === "greaterThan") return { gt: filterValue };
  if (type === "greaterThanOrEqual") return { gte: filterValue };
  if (type === "lessThan") return { lt: filterValue };
  if (type === "lessThanOrEqual") return { lte: filterValue };

  return { equals: filterValue };
}

function getDateFilter(model: Record<string, unknown>): Prisma.DateTimeFilter | undefined {
  const raw = typeof model.dateFrom === "string" ? model.dateFrom : undefined;

  if (!raw) {
    return undefined;
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const type = model.type;

  if (type === "equals") {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return { gte: date, lt: nextDay };
  }

  if (type === "greaterThan") return { gt: date };
  if (type === "greaterThanOrEqual") return { gte: date };
  if (type === "lessThan") return { lt: date };
  if (type === "lessThanOrEqual") return { lte: date };

  return { gte: date };
}

function buildInvoicesWhere(filterModel: Record<string, unknown>): Prisma.InvoiceWhereInput {
  const andConditions: Prisma.InvoiceWhereInput[] = [];

  for (const [field, rawModel] of Object.entries(filterModel)) {
    if (!rawModel || typeof rawModel !== "object") {
      continue;
    }

    const model = rawModel as Record<string, unknown>;

    if (TEXT_FIELDS.has(field)) {
      const filter = getStringFilter(model);
      if (filter) {
        andConditions.push({ [field]: filter } as Prisma.InvoiceWhereInput);
      }
      continue;
    }

    if (NUMBER_FIELDS.has(field)) {
      const filter = getNumberFilter(model);
      if (filter) {
        andConditions.push({ [field]: filter } as Prisma.InvoiceWhereInput);
      }
      continue;
    }

    if (DATE_FIELDS.has(field)) {
      const filter = getDateFilter(model);
      if (filter) {
        andConditions.push({ [field]: filter } as Prisma.InvoiceWhereInput);
      }
    }
  }

  return andConditions.length > 0 ? { AND: andConditions } : {};
}

export async function getInvoicesGridData(
  query: GridDataQuery<InvoicesSortField>,
): Promise<GridDataResult<Awaited<ReturnType<typeof prisma.invoice.findMany>>[number]>> {
  const orderByField = INVOICE_SORT_FIELDS[query.sortBy];
  const orderBy: Prisma.InvoiceOrderByWithRelationInput = {
    [orderByField]: query.sortDirection,
  };

  const where = buildInvoicesWhere(query.filterModel);

  const [rows, total] = await Promise.all([
    prisma.invoice.findMany({
      skip: query.startRow,
      take: query.endRow - query.startRow,
      orderBy,
      where,
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    rows,
    total,
  };
}
