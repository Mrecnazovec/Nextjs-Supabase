"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AllCommunityModule,
  ColDef,
  ColumnState,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  ModuleRegistry,
  themeAlpine,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ViewEntityTypeEnum } from "@/shared/enums/ViewEntityType.enum";
import { GridViewState, UserView } from "@/shared/types/Views.interface";
import { getGridRows } from "@/services/grid/grid-api.service";
import {
  createView,
  deleteView,
  getViews,
  toGridViewState,
  updateView,
} from "@/services/views/views-api.service";
import { toast } from "sonner";
import { isSameState, normalizeState } from "./lib/gridViewState";
import { AGGridTableHeader } from "./components/AGGridTableHeader";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface AGGridTableProps<TRow extends object> {
  title: string;
  entityType: ViewEntityTypeEnum;
  dataEndpoint: string;
  columnDefs: ColDef<TRow>[];
  initialRows?: TRow[];
  initialTotal?: number;
  initialBlockSize?: number;
}

const DEFAULT_VIEW_ID = "default";

export function AGGridTable<TRow extends object>({
  title,
  entityType,
  dataEndpoint,
  columnDefs,
  initialRows,
  initialTotal,
  initialBlockSize = 100,
}: AGGridTableProps<TRow>) {
  const gridApiRef = useRef<GridApi<TRow> | null>(null);
  const defaultStateRef = useRef<GridViewState | null>(null);
  const baselineStateRef = useRef<GridViewState | null>(null);
  const isApplyingStateRef = useRef(false);
  const initialDataUsedRef = useRef(false);
  const ignoreDirtyChecksUntilRef = useRef(0);
  const pendingRequestsRef = useRef(0);
  const latestRequestIdRef = useRef(0);

  const [views, setViews] = useState<UserView[]>([]);
  const [isViewsLoading, setIsViewsLoading] = useState(true);
  const [selectedViewId, setSelectedViewId] = useState<string>(DEFAULT_VIEW_ID);
  const [isDirty, setIsDirty] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isGridReady, setIsGridReady] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [hasFirstDataRendered, setHasFirstDataRendered] = useState(false);

  const refreshViews = useCallback(async () => {
    setIsViewsLoading(true);
    try {
      const data = await getViews(entityType);
      setViews(data);
      return data;
    } finally {
      setIsViewsLoading(false);
    }
  }, [entityType]);

  useEffect(() => {
    let isActive = true;

    setIsViewsLoading(true);
    void getViews(entityType)
      .then((data) => {
        if (isActive) {
          setViews(data);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsViewsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [entityType]);

  const captureState = useCallback((api: GridApi<TRow>): GridViewState => {
    const sortModel = typeof (api as unknown as { getSortModel?: () => unknown[] }).getSortModel === "function"
      ? ((api as unknown as { getSortModel: () => unknown[] }).getSortModel() ?? [])
      : [];

    return {
      columnState: api.getColumnState() as unknown[],
      sortModel,
      filterModel: (api.getFilterModel() as Record<string, unknown>) ?? {},
    };
  }, []);

  const applyState = useCallback((api: GridApi<TRow>, state: GridViewState) => {
    isApplyingStateRef.current = true;
    ignoreDirtyChecksUntilRef.current = Date.now() + 300;

    const normalized = normalizeState(state);
    const columnState = normalized.columnState as ColumnState[];

    if (columnState.length > 0) {
      api.applyColumnState({
        state: columnState,
        applyOrder: true,
      });
    }

    const maybeSetSortModel = api as unknown as { setSortModel?: (value: unknown[]) => void };
    if (typeof maybeSetSortModel.setSortModel === "function") {
      maybeSetSortModel.setSortModel(normalized.sortModel);
    }

    api.setFilterModel(normalized.filterModel);

    setTimeout(() => {
      // Capture canonical state from grid after it applies internal defaults.
      baselineStateRef.current = captureState(api);
      setIsDirty(false);
      isApplyingStateRef.current = false;
      api.refreshInfiniteCache();
    }, 0);
  }, [captureState]);

  const syncDirtyState = useCallback((event?: unknown) => {
    const api = gridApiRef.current;

    if (!api || isApplyingStateRef.current) {
      return;
    }

    if (Date.now() < ignoreDirtyChecksUntilRef.current) {
      return;
    }

    // Ignore non-user resize events triggered during initial layout/render cycle.
    if (event && typeof event === "object" && "type" in event) {
      const maybeType = (event as { type?: string }).type;
      if (maybeType === "columnResized") {
        const resizeEvent = event as {
          finished?: boolean;
          source?: string;
        };

        if (resizeEvent.finished === false) {
          return;
        }

        if (
          resizeEvent.source === "gridInitializing" ||
          resizeEvent.source === "autosizeColumns" ||
          resizeEvent.source === "sizeColumnsToFit"
        ) {
          return;
        }
      }
    }

    const current = captureState(api);
    setIsDirty(!isSameState(current, baselineStateRef.current));
  }, [captureState]);

  const dataSource = useMemo<IDatasource>(() => ({
    getRows: async (params: IGetRowsParams) => {
      const requestId = ++latestRequestIdRef.current;
      const hasInitialData =
        Array.isArray(initialRows) &&
        typeof initialTotal === "number" &&
        initialTotal >= 0;
      const isDefaultQuery =
        params.startRow === 0 &&
        params.endRow <= initialBlockSize &&
        (!Array.isArray(params.sortModel) || params.sortModel.length === 0) &&
        (!params.filterModel || Object.keys(params.filterModel).length === 0);

      if (hasInitialData && isDefaultQuery && !initialDataUsedRef.current) {
        initialDataUsedRef.current = true;
        params.successCallback(initialRows, initialTotal);
        return;
      }

      pendingRequestsRef.current += 1;
      setIsDataLoading(true);

      try {
        const payload = await getGridRows<TRow>({
          endpoint: dataEndpoint,
          startRow: params.startRow,
          endRow: params.endRow,
          sortModel: params.sortModel,
          filterModel: params.filterModel as Record<string, unknown>,
        });

        // Ignore stale responses from older requests to avoid flicker/race conditions.
        if (requestId !== latestRequestIdRef.current) {
          return;
        }

        params.successCallback(payload.rows, payload.total);
      } catch {
        if (requestId !== latestRequestIdRef.current) {
          return;
        }
        params.failCallback();
      } finally {
        pendingRequestsRef.current = Math.max(pendingRequestsRef.current - 1, 0);
        if (pendingRequestsRef.current === 0) {
          setIsDataLoading(false);
        }
      }
    },
  }), [dataEndpoint, initialBlockSize, initialRows, initialTotal]);

  const onGridReady = useCallback((event: GridReadyEvent<TRow>) => {
    gridApiRef.current = event.api;
    event.api.setGridOption("datasource", dataSource);
    setIsGridReady(true);
    setHasFirstDataRendered(false);

    queueMicrotask(() => {
      const initialState = captureState(event.api);
      defaultStateRef.current = initialState;
      baselineStateRef.current = initialState;
      setIsDirty(false);
    });
  }, [captureState, dataSource]);

  const handleSelectView = useCallback((value: string) => {
    setSelectedViewId(value);

    const api = gridApiRef.current;
    if (!api) {
      return;
    }

    if (value === DEFAULT_VIEW_ID) {
      if (defaultStateRef.current) {
        applyState(api, defaultStateRef.current);
      }
      return;
    }

    const view = views.find((item) => item.id === value);
    if (!view) {
      return;
    }

    applyState(api, toGridViewState(view));
  }, [applyState, views]);

  const handleSave = useCallback(async () => {
    const api = gridApiRef.current;

    if (!api) {
      return;
    }

    const currentState = captureState(api);

    setIsBusy(true);

    try {
      await updateView(selectedViewId, { state: currentState });
      await refreshViews();
      baselineStateRef.current = currentState;
      setIsDirty(false);
      toast.success("View saved.");
    } catch {
      toast.error("Failed to save view.");
    } finally {
      setIsBusy(false);
    }
  }, [captureState, refreshViews, selectedViewId]);

  const handleSaveAsNew = useCallback(async (name: string) => {
    const api = gridApiRef.current;

    if (!api) {
      return;
    }

    if (!name.trim()) {
      toast.error("Enter view name for Save As New.");
      return;
    }

    const currentState = captureState(api);
    setIsBusy(true);

    try {
      const created = await createView({
        name: name.trim(),
        entityType,
        state: currentState,
      });

      await refreshViews();
      setSelectedViewId(created.id);
      baselineStateRef.current = currentState;
      setIsDirty(false);
      toast.success("New view saved.");
    } catch {
      toast.error("Failed to create new view.");
    }

    setIsBusy(false);
  }, [captureState, entityType, refreshViews]);

  const handleDeleteView = useCallback(async () => {
    if (selectedViewId === DEFAULT_VIEW_ID) {
      return;
    }

    setIsBusy(true);

    try {
      await deleteView(selectedViewId);
      await refreshViews();
      setSelectedViewId(DEFAULT_VIEW_ID);

      const api = gridApiRef.current;
      if (api && defaultStateRef.current) {
        applyState(api, defaultStateRef.current);
      }

      toast.success("View deleted.");
    } catch {
      toast.error("Failed to delete view.");
    } finally {
      setIsBusy(false);
    }
  }, [applyState, refreshViews, selectedViewId]);

  const handleResetToDefault = useCallback(() => {
    const api = gridApiRef.current;

    if (!api) {
      return;
    }

    // Reset only filter state for the currently selected view and keep baseline unchanged,
    // so grid state is marked as unsaved until user explicitly saves it.
    isApplyingStateRef.current = true;
    ignoreDirtyChecksUntilRef.current = Date.now() + 300;
    api.setFilterModel({});
    api.refreshInfiniteCache();
    setTimeout(() => {
      isApplyingStateRef.current = false;
      setIsDirty(true);
    }, 0);
    toast.success("Filters reset.");
  }, []);

  return (
    <div className="space-y-4">
      <AGGridTableHeader
        title={title}
        views={views}
        isViewsLoading={isViewsLoading}
        selectedViewId={selectedViewId}
        isDefaultViewSelected={selectedViewId === DEFAULT_VIEW_ID}
        isBusy={isBusy}
        isDirty={isDirty}
        onSelectView={handleSelectView}
        onSaveCurrentView={handleSave}
        onSaveAsNewView={handleSaveAsNew}
        onResetToDefault={handleResetToDefault}
        onDeleteView={handleDeleteView}
      />

      <div className="relative h-[680px] w-full overflow-hidden rounded-md border">
        {!isGridReady ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-[580px] w-full" />
          </div>
        ) : null}
        {isGridReady && (isDataLoading || isBusy) ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
              <Loader2 className="size-4 animate-spin" />
              {isBusy ? "Processing..." : "Loading data..."}
            </div>
          </div>
        ) : null}
        {isGridReady && !isBusy && !isDataLoading && !hasFirstDataRendered ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
              <Loader2 className="size-4 animate-spin" />
              Rendering...
            </div>
          </div>
        ) : null}
        <AgGridReact<TRow>
          theme={themeAlpine}
          columnDefs={columnDefs}
          rowModelType="infinite"
          cacheBlockSize={initialBlockSize}
          blockLoadDebounceMillis={250}
          maxConcurrentDatasourceRequests={1}
          maxBlocksInCache={5}
          maintainColumnOrder
          suppressDragLeaveHidesColumns
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: true,
            suppressMovable: false,
          }}
          onGridReady={onGridReady}
          onColumnMoved={syncDirtyState}
          onColumnVisible={syncDirtyState}
          onSortChanged={syncDirtyState}
          onFilterChanged={syncDirtyState}
          onColumnPinned={syncDirtyState}
          onColumnResized={syncDirtyState}
          onFirstDataRendered={() => setHasFirstDataRendered(true)}
        />
      </div>
    </div>
  );
}
