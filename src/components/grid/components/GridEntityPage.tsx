"use client";

import { ColDef } from "ag-grid-community";
import { AGGridTable } from "@/components/grid/AGGridTable";
import { GridPageHeader } from "@/components/grid/components/GridPageHeader";
import { ViewEntityTypeEnum } from "@/shared/enums/ViewEntityType.enum";

interface GridEntityPageProps<TRow extends object> {
  pageTitle: string;
  pageDescription: string;
  gridTitle: string;
  entityType: ViewEntityTypeEnum;
  dataEndpoint: string;
  columnDefs: ColDef<TRow>[];
  initialRows?: TRow[];
  initialTotal?: number;
  initialBlockSize: number;
}

export function GridEntityPage<TRow extends object>({
  pageTitle,
  pageDescription,
  gridTitle,
  entityType,
  dataEndpoint,
  columnDefs,
  initialRows,
  initialTotal,
  initialBlockSize,
}: GridEntityPageProps<TRow>) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6">
      <GridPageHeader title={pageTitle} description={pageDescription} />
      <AGGridTable
        title={gridTitle}
        entityType={entityType}
        dataEndpoint={dataEndpoint}
        columnDefs={columnDefs}
        initialRows={initialRows}
        initialTotal={initialTotal}
        initialBlockSize={initialBlockSize}
      />
    </main>
  );
}
