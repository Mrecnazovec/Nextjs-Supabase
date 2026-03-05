import { SortDirectionEnum } from "@/shared/enums/SortDirection.enum";
import {
  GridListQuery,
  PaginationParams,
  ParseGridListQueryOptions,
} from "@/shared/types/GridQuery.interface";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export function getPaginationParams(
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
): PaginationParams {
  const safePage = Math.max(page, DEFAULT_PAGE);
  const safePageSize = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);

  return {
    skip: (safePage - 1) * safePageSize,
    take: safePageSize,
  };
}

export function parseGridListQuery<TSortField extends string>(
  searchParams: URLSearchParams,
  options: ParseGridListQueryOptions<TSortField>,
): GridListQuery<TSortField> {
  const sortByRaw = searchParams.get("sortBy");
  const sortDirectionRaw = searchParams.get("sortDirection");
  const pageRaw = searchParams.get("page");
  const pageSizeRaw = searchParams.get("pageSize");

  const sortBy = options.allowedSortFields.includes(sortByRaw as TSortField)
    ? (sortByRaw as TSortField)
    : options.defaultSortBy;

  const sortDirection: SortDirectionEnum =
    sortDirectionRaw === SortDirectionEnum.ASC ||
    sortDirectionRaw === SortDirectionEnum.DESC
      ? sortDirectionRaw
      : (options.defaultSortDirection ?? SortDirectionEnum.DESC);

  const page = Number.isFinite(Number(pageRaw)) ? Number(pageRaw) : DEFAULT_PAGE;
  const pageSize = Number.isFinite(Number(pageSizeRaw))
    ? Number(pageSizeRaw)
    : (options.defaultPageSize ?? DEFAULT_PAGE_SIZE);

  return {
    page: Math.max(page, DEFAULT_PAGE),
    pageSize: Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE),
    sortBy,
    sortDirection,
  };
}
