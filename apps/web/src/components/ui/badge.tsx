import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "gold" | "copper" | "steel" | "success";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-sapphire/10 text-sapphire",
  gold: "bg-gold/15 text-gold",
  copper: "bg-copper/15 text-copper",
  steel: "bg-steel/15 text-steel",
  success: "bg-emerald-100 text-emerald-700",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold font-sans",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

