import { PROTECTED_URL, PUBLIC_URL } from "@/config/url.config";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { getCurrentUser } from "@/services/profile/profile.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "./actions";
import { Suspense } from "react";
import { UserEmail } from "./components/UserEmail";

export async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(PUBLIC_URL.login());
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Signed in...</p>}>
            <UserEmail userId={user.id} />
          </Suspense>
          <p className="mt-1 text-xs text-muted-foreground">
            Select a dataset and manage saved table views.
          </p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoices view</CardTitle>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline">
                    <Link href={PROTECTED_URL.invoices()}>Open invoices</Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Invoice statuses, totals, due dates and payment metadata.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders view</CardTitle>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline">
                    <Link href={PROTECTED_URL.orders()}>Open orders</Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Order flow, totals, delivery dates and tracking information.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
