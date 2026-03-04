import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const DEFAULT_COOKIE_DAYS = 7;

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return Cookies.get(ACCESS_TOKEN_KEY) ?? null;
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: DEFAULT_COOKIE_DAYS,
    sameSite: "strict",
    secure: window.location.protocol === "https:",
  });
}

export function removeFromStorage() {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.remove(ACCESS_TOKEN_KEY);
}
