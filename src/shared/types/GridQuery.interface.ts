import { SortDirectionEnum } from "@/shared/enums/SortDirection.enum";

export interface GridListQuery<TSortField extends string> {
  page: number;
  pageSize: number;
  sortBy: TSortField;
  sortDirection: SortDirectionEnum;
}

export interface PaginationParams {
  skip: number;
  take: number;
}

export interface ParseGridListQueryOptions<TSortField extends string> {
  allowedSortFields: readonly TSortField[];
  defaultSortBy: TSortField;
  defaultSortDirection?: SortDirectionEnum;
  defaultPageSize?: number;
}
