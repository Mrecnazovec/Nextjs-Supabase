import { SortDirectionEnum } from "@/shared/enums/SortDirection.enum";

export type GridFilterModel = Record<string, unknown>;

export interface GridDataQuery<TSortField extends string> {
  startRow: number;
  endRow: number;
  sortBy: TSortField;
  sortDirection: SortDirectionEnum;
  filterModel: GridFilterModel;
}

export interface GridDataResult<TRow> {
  rows: TRow[];
  total: number;
}
