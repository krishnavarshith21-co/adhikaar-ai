import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-sans text-sm font-medium text-sapphire">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          "h-11 rounded-lg border bg-white px-4 font-sans text-sm text-sapphire placeholder:text-steel/60",
          "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold",
          error ? "border-copper" : "border-steel/30",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-copper font-sans">{error}</p>}
    </div>
  );
}

