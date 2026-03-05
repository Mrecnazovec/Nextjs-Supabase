import { API_URL } from "@/config/api.config";
import { ViewEntityTypeEnum } from "@/shared/enums/ViewEntityType.enum";
import { GridViewState, UserView } from "@/shared/types/Views.interface";

function toGridViewState(view: UserView): GridViewState {
  return {
    columnState: Array.isArray(view.columnState) ? view.columnState : [],
    sortModel: Array.isArray(view.sortModel) ? view.sortModel : [],
    filterModel:
      view.filterModel && typeof view.filterModel === "object"
        ? (view.filterModel as Record<string, unknown>)
        : {},
  };
}

export async function getViews(entityType: ViewEntityTypeEnum): Promise<UserView[]> {
  const response = await fetch(`${API_URL.views()}?entityType=${entityType}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load views.");
  }

  const payload = (await response.json()) as { data: UserView[] };
  return payload.data;
}

export async function createView(params: {
  name: string;
  entityType: ViewEntityTypeEnum;
  state: GridViewState;
}) {
  const response = await fetch(API_URL.views(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: params.name,
      entityType: params.entityType,
      columnState: params.state.columnState,
      sortModel: params.state.sortModel,
      filterModel: params.state.filterModel,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create view.");
  }

  const payload = (await response.json()) as { data: UserView };
  return payload.data;
}

export async function updateView(id: string, params: { name?: string; state?: GridViewState }) {
  const response = await fetch(API_URL.viewById(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...(params.name ? { name: params.name } : {}),
      ...(params.state
        ? {
            columnState: params.state.columnState,
            sortModel: params.state.sortModel,
            filterModel: params.state.filterModel,
          }
        : {}),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update view.");
  }

  const payload = (await response.json()) as { data: UserView };
  return payload.data;
}

export async function deleteView(id: string) {
  const response = await fetch(API_URL.viewById(id), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete view.");
  }
}

export { toGridViewState };
