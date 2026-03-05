import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
        <Skeleton className="mb-3 h-7 w-40" />
        <Skeleton className="mb-6 h-4 w-64" />
        <Skeleton className="mb-3 h-9 w-full" />
        <Skeleton className="mb-3 h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </main>
  );
}
