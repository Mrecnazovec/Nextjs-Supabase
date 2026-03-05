import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache.constant";
import { getCurrentUser } from "@/services/profile/profile.service";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(CACHE_TAGS.dashboardEmailByUser(user.id), "max");

  return NextResponse.json({ success: true });
}
