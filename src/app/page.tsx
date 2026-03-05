import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PROTECTED_URL, PUBLIC_URL } from "@/config/url.config";
import { getCurrentUser } from "@/services/profile/profile.service";

async function HomeRedirect() {
  const user = await getCurrentUser();
  redirect(user ? PROTECTED_URL.dashboard() : PUBLIC_URL.login());
  return null;
}

export default function HomeRoutePage() {
  return (
    <Suspense fallback={null}>
      <HomeRedirect />
    </Suspense>
  );
}
