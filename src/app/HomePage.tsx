import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PROTECTED_URL, PUBLIC_URL } from "@/config/url.config";
import { getCurrentUser } from "@/services/profile/profile.service";

export async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(PROTECTED_URL.dashboard());
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-6">
      <section className="w-full rounded-xl border bg-card p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">AG-Grid Views Management</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Manage Orders and Invoices views with saved filters, sorting and column settings.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link href={PUBLIC_URL.login()}>Login</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
