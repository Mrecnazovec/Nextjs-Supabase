import { Skeleton } from "@/components/ui/Skeleton";

export function GridPageLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-44" />
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-9 w-56" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
        <Skeleton className="h-[680px] w-full" />
      </div>
    </main>
  );
}
