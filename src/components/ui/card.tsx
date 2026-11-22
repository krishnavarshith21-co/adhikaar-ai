import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "outlined" | "filled";
  hover?: boolean;
}

const variantClasses = {
  elevated: "bg-white shadow-sm border border-steel/10",
  outlined: "bg-white/50 border border-steel/20",
  filled: "bg-sapphire/5 border border-transparent",
};

export function Card({
  variant = "elevated",
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl p-6 transition-all duration-200",
        variantClasses[variant],
        hover && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["mb-4", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={[
        "font-display text-xl font-semibold text-sapphire",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={["mt-1 text-sm text-steel font-sans", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

