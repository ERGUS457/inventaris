import { Skeleton } from "@/components/ui/skeleton";

export default function ItemsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border overflow-hidden">
        <div className="bg-muted/50 flex gap-4 px-4 py-3 border-b">
          {[120, 200, 120, 120, 80, 100, 60].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3.5 border-b last:border-0">
            {[120, 200, 120, 120, 80, 100, 60].map((w, j) => (
              <Skeleton key={j} className="h-4" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
