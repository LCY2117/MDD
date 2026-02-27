export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-secondary"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-muted-foreground mt-4">加载中...</p>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-2xl p-4 border border-border/50 animate-pulse">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-secondary"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-secondary rounded w-24 mb-2"></div>
              <div className="h-3 bg-secondary rounded w-16"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-secondary rounded w-full"></div>
            <div className="h-4 bg-secondary rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
