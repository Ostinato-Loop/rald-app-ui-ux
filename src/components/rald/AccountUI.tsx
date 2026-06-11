import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-rald)]",
        className,
      )}
    >
      {(title || description) && (
        <div className="px-4 pb-1 pt-3">
          {title && <h2 className="text-base font-extrabold">{title}</h2>}
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

export function SettingRow({
  icon: Icon,
  label,
  value,
  action,
  onClick,
  danger,
}: {
  icon?: LucideIcon;
  label: string;
  value?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const interactive = !!onClick;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
        interactive ? "hover:bg-muted" : "cursor-default",
      )}
    >
      {Icon && (
        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full",
            danger ? "bg-red-soft text-red" : "bg-green-soft text-green",
          )}
        >
          <Icon size={18} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", danger && "text-red")}>
          {label}
        </p>
        {value && (
          <div className="mt-0.5 truncate text-sm text-muted-foreground">
            {value}
          </div>
        )}
      </div>
      {action ?? (interactive && <ChevronRight size={18} className="shrink-0 text-muted-foreground" />)}
    </button>
  );
}
