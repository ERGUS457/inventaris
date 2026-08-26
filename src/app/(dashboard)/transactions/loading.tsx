import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <div className="bg-muted/50 flex gap-4 px-4 py-3 border-b">
          {[50, 200, 120, 80, 200, 160].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center px-4 py-3.5 border-b last:border-0">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            {[200, 120, 80, 200, 160].map((w, j) => (
              <Skeleton key={j} className="h-4" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
