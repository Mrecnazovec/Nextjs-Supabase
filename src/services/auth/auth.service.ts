import { API_URL } from "@/config/api.config";
import { PROTECTED_URL } from "@/config/url.config";
import { EmailPasswordAuthInput } from "@/shared/types/Auth.interface";
import { SupabaseClient } from "@supabase/supabase-js";

export async function signUpWithEmail(
  supabase: SupabaseClient,
  input: EmailPasswordAuthInput,
  origin: string,
) {
  const emailRedirectTo = `${origin}${API_URL.registerConfirm()}?next=${PROTECTED_URL.dashboard()}`;

  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo,
    },
  });
}

export async function signInWithEmail(
  supabase: SupabaseClient,
  input: EmailPasswordAuthInput,
) {
  return supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
}

export async function resendSignUpConfirmation(
  supabase: SupabaseClient,
  email: string,
  origin: string,
) {
  const emailRedirectTo = `${origin}${API_URL.registerConfirm()}?next=${PROTECTED_URL.dashboard()}`;

  return supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo,
    },
  });
}
