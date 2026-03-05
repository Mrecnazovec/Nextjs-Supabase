import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PUBLIC_URL, PROTECTED_URL } from "@/config/url.config";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
      <section className="w-full rounded-xl border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you requested does not exist or was moved.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href={PUBLIC_URL.home()}>Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={PROTECTED_URL.dashboard()}>Open Dashboard</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={PUBLIC_URL.login()}>Login</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
