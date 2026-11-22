import Image from "next/image";
export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={[
        "inline-flex items-center justify-center rounded-full bg-sapphire text-linen font-sans font-semibold overflow-hidden shrink-0",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {src ? (
        <Image src={src} alt={name} width={56} height={56} className="h-full w-full object-cover" unoptimized />
      ) : (
        initials
      )}
    </div>
  );
}

