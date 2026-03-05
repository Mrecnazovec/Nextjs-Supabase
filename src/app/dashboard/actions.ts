"use server";

import { PUBLIC_URL } from "@/config/url.config";
import { CACHE_TAGS } from "@/constants/cache.constant";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOutAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.signOut();

  if (user?.id) {
    revalidateTag(CACHE_TAGS.dashboardEmailByUser(user.id), "max");
  }

  redirect(PUBLIC_URL.login());
}

