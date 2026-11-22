import type { ReactNode } from "react";
import { Button } from "./button";

export function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-steel/40">{icon}</div>}
      <h3 className="font-display text-xl font-semibold text-sapphire mb-2">
        {title}
      </h3>
      <p className="text-sm text-steel font-sans max-w-sm mb-6">
        {description}
      </p>
      {action && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}

