export const SERVER_URL = process.env.SERVER_URL as string;

export const API_URL = {
  root: (url = "") => (url ? `/api/${url}` : "/api"),
  auth: () => API_URL.root("auth"),
  dashboard: () => API_URL.root("dashboard"),
  registerConfirm: () => API_URL.root("register/confirm"),
} as const;
