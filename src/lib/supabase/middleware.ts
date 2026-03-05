import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./env";
import { PROTECTED_URL_LIST, PROTECTED_URL, PUBLIC_URL } from "@/config/url.config";
import { getCurrentUserFromClient } from "@/services/profile/profile.service";

const isProtectedPath = (pathname: string) =>
  PROTECTED_URL_LIST.some((path) => pathname.startsWith(path));

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const user = await getCurrentUserFromClient(supabase);

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = PUBLIC_URL.login();
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === PUBLIC_URL.login()) {
    const url = request.nextUrl.clone();
    url.pathname = PROTECTED_URL.dashboard();
    return NextResponse.redirect(url);
  }

  return response;
}

