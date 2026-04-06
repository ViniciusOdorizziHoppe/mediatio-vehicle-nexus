export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-6 bg-muted rounded w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded-lg" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-14 bg-muted rounded-md" />
      ))}
    </div>
  );
}
