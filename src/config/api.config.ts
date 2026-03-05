export const SERVER_URL = process.env.SERVER_URL as string;

export const API_URL = {
  root: (url = "") => (url ? `/api/${url}` : "/api"),
  auth: () => API_URL.root("auth"),
  dashboard: () => API_URL.root("dashboard"),
  orders: () => API_URL.root("orders"),
  invoices: () => API_URL.root("invoices"),
  views: () => API_URL.root("views"),
  viewById: (id: string) => API_URL.root(`views/${id}`),
  registerConfirm: () => API_URL.root("register/confirm"),
} as const;
