"use client";

import { API_URL } from "@/config/api.config";
import { INITIAL_GRID_BLOCK_SIZE } from "@/components/grid/constants";
import { GridEntityPage } from "@/components/grid/components/GridEntityPage";
import { ViewEntityTypeEnum } from "@/shared/enums/ViewEntityType.enum";
import { InvoiceRow } from "@/shared/types/InvoiceRow.interface";
import { invoicesColumnDefs } from "./invoices.columnDefs";

interface InvoicesPageProps {
  initialRows?: InvoiceRow[];
  initialTotal?: number;
}

export function InvoicesPage({ initialRows, initialTotal }: InvoicesPageProps) {
  return (
    <GridEntityPage<InvoiceRow>
      pageTitle="Invoices"
      pageDescription="Server-side sorting and filtering with saved user views."
      gridTitle="Invoices Grid"
      entityType={ViewEntityTypeEnum.INVOICES}
      dataEndpoint={API_URL.invoices()}
      columnDefs={invoicesColumnDefs}
      initialRows={initialRows}
      initialTotal={initialTotal}
      initialBlockSize={INITIAL_GRID_BLOCK_SIZE}
    />
  );
}
