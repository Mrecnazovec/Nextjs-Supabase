import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PROTECTED_URL, PUBLIC_URL } from "@/config/url.config";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const nextParam = url.searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/")
      ? nextParam
      : PROTECTED_URL.dashboard();

  const redirectToLogin = (message: string) =>
    NextResponse.redirect(
      new URL(
        `${PUBLIC_URL.login()}?message=${encodeURIComponent(message)}`,
        url.origin,
      ),
    );

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }

    return redirectToLogin("Email confirmation code is invalid or expired.");
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }

    return redirectToLogin("Email confirmation link is invalid or expired.");
  }

  return redirectToLogin("Email confirmation data is missing.");
}

