import { redirect } from "next/navigation";
import { PROTECTED_URL, PUBLIC_URL } from "@/config/url.config";
import { createClient } from "@/lib/supabase/server";

export async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? PROTECTED_URL.dashboard() : PUBLIC_URL.login());

  return null;
}
