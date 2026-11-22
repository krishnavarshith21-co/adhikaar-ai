export function LoadingSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const s = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" }[size];
  return (
    <div
      className={[
        "animate-spin rounded-full border-2 border-steel/20 border-t-gold",
        s,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

