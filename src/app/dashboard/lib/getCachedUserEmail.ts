import { CACHE_TAGS } from "@/constants/cache.constant";
import { createClient } from "@/lib/supabase/server";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedUserEmail(userId: string) {
  "use cache: private";
  cacheLife({ stale: 300 });
  cacheTag(CACHE_TAGS.dashboardEmailByUser(userId));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email ?? "";
}
