import { Button } from "@/components/ui/Button";
import { PROTECTED_URL } from "@/config/url.config";
import Link from "next/link";

export default function InvoicesPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button asChild variant="outline">
          <Link href={PROTECTED_URL.dashboard()}>Back to dashboard</Link>
        </Button>
      </header>
      <p className="text-sm text-muted-foreground">
        Protected route is configured. Next step: attach generic AGGridTable with server-side datasource.
      </p>
    </main>
  );
}

