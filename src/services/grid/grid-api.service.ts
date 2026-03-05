interface GridRowsResponse<TRow> {
  rows: TRow[];
  total: number;
}

export async function getGridRows<TRow>(params: {
  endpoint: string;
  startRow: number;
  endRow: number;
  sortModel: unknown[];
  filterModel: Record<string, unknown>;
}): Promise<GridRowsResponse<TRow>> {
  const query = new URLSearchParams();
  query.set("startRow", String(params.startRow));
  query.set("endRow", String(params.endRow));
  query.set("sortModel", JSON.stringify(params.sortModel));
  query.set("filterModel", JSON.stringify(params.filterModel));

  const response = await fetch(`${params.endpoint}?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load grid rows.");
  }

  return (await response.json()) as GridRowsResponse<TRow>;
}
