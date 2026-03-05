import { Skeleton } from "@/components/ui/Skeleton";

export function GridLazyFallback() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-[420px]" />
      <Skeleton className="h-[680px] w-full" />
    </div>
  );
}
