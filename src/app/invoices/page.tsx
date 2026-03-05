import { Metadata } from "next";
import { InvoicesPage } from "./InvoicesPage";
import { getInvoicesGridData } from "@/services/invoices/invoices.service";
import { InvoicesSortFieldEnum } from "@/shared/enums/InvoicesSortField.enum";
import { SortDirectionEnum } from "@/shared/enums/SortDirection.enum";
import { INITIAL_GRID_BLOCK_SIZE } from "@/components/grid/constants";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Invoices",
  description: "Invoices AG-Grid with server-side sorting, filtering and saved views.",
};

export default async function InvoicesRoutePage() {
  await connection();

  const initial = await getInvoicesGridData({
    startRow: 0,
    endRow: INITIAL_GRID_BLOCK_SIZE,
    sortBy: InvoicesSortFieldEnum.INVOICE_DATE,
    sortDirection: SortDirectionEnum.DESC,
    filterModel: {},
  });

  return (
    <InvoicesPage
      initialRows={JSON.parse(JSON.stringify(initial.rows))}
      initialTotal={initial.total}
    />
  );
}
