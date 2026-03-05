import { GridViewState } from "@/shared/types/Views.interface";

export function normalizeState(state: GridViewState): GridViewState {
  return {
    columnState: Array.isArray(state.columnState) ? state.columnState : [],
    sortModel: Array.isArray(state.sortModel) ? state.sortModel : [],
    filterModel:
      state.filterModel && typeof state.filterModel === "object"
        ? state.filterModel
        : {},
  };
}

export function isSameState(
  first: GridViewState | null,
  second: GridViewState | null,
): boolean {
  if (!first || !second) {
    return false;
  }

  return JSON.stringify(normalizeState(first)) === JSON.stringify(normalizeState(second));
}
