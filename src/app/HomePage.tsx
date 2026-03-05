import { redirect } from "next/navigation";
import { PROTECTED_URL, PUBLIC_URL } from "@/config/url.config";
import { getCurrentUser } from "@/services/profile/profile.service";

export async function HomePage() {
  const user = await getCurrentUser();

  redirect(user ? PROTECTED_URL.dashboard() : PUBLIC_URL.login());

  return null;
}
