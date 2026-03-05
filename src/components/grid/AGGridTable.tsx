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

interface AGGridTableProps<TRow extends object> {
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

  const [views, setViews] = useState<UserView[]>([]);
  const [selectedViewId, setSelectedViewId] = useState<string>(DEFAULT_VIEW_ID);
  const [isDirty, setIsDirty] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isGridReady, setIsGridReady] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const refreshViews = useCallback(async () => {
    const data = await getViews(entityType);
    setViews(data);
    return data;
  }, [entityType]);

  useEffect(() => {
    let isActive = true;

    void getViews(entityType).then((data) => {
      if (isActive) {
        setViews(data);
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

        params.successCallback(payload.rows, payload.total);
      } catch {
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
    }

    setIsBusy(false);
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
    }

    setIsBusy(false);
  }, [applyState, refreshViews, selectedViewId]);

  const handleResetToDefault = useCallback(() => {
    const api = gridApiRef.current;

    if (!api || !defaultStateRef.current) {
      return;
    }

    setSelectedViewId(DEFAULT_VIEW_ID);
    applyState(api, defaultStateRef.current);
    toast.success("Reset to default view.");
  }, [applyState]);

  return (
    <div className="space-y-4">
      <AGGridTableHeader
        title={title}
        views={views}
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
        {isGridReady && isDataLoading ? (
          <div className="pointer-events-none absolute inset-0 z-10 bg-background/70 p-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[460px] w-full" />
            </div>
          </div>
        ) : null}
        <AgGridReact<TRow>
          theme={themeAlpine}
          columnDefs={columnDefs}
          rowModelType="infinite"
          cacheBlockSize={100}
          maxBlocksInCache={5}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: true,
          }}
          onGridReady={onGridReady}
          onColumnMoved={syncDirtyState}
          onColumnVisible={syncDirtyState}
          onSortChanged={syncDirtyState}
          onFilterChanged={syncDirtyState}
          onColumnPinned={syncDirtyState}
          onColumnResized={syncDirtyState}
        />
      </div>
    </div>
  );
}
