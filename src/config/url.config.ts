export const APP_URL = process.env.APP_URL as string;

const withSegment = (base: string, url = "") =>
  url ? `${base}/${url}` : base;

export const PUBLIC_URL = {
  home: (url = "") => withSegment("/", url).replace("//", "/"),
  login: (url = "") => withSegment("/login", url),
} as const;

export const PROTECTED_URL = {
  dashboard: (url = "") => withSegment("/dashboard", url),
  invoices: (url = "") => withSegment("/invoices", url),
  orders: (url = "") => withSegment("/orders", url),
} as const;

export const PROTECTED_URL_LIST = [
  PROTECTED_URL.dashboard(),
  PROTECTED_URL.orders(),
  PROTECTED_URL.invoices(),
] as const;
