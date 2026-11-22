export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  label,
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between font-sans text-sm">
          <span className="text-sapphire font-medium">{label}</span>
          <span className="text-steel">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-sapphire/10">
        <div
          className="h-full rounded-full bg-gold transition-all duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

