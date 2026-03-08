import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/lib/types";

const config: Record<
  UrgencyLevel,
  { label: string; bg: string; text: string; dot: string }
> = {
  urgent: {
    label: "Urgent",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500 animate-pulse",
  },
  high: {
    label: "High",
    bg: "bg-orange-50",
    text: "text-orange-600",
    dot: "bg-orange-500",
  },
  warning: {
    label: "Soon",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  info: {
    label: "Upcoming",
    bg: "bg-sky-50",
    text: "text-sky-600",
    dot: "bg-sky-500",
  },
  complete: {
    label: "All Set",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
};

export function StatusBadge({
  level,
  className,
}: {
  level: UrgencyLevel;
  className?: string;
}) {
  const c = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        c.bg,
        c.text,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", c.dot)} />
      {c.label}
    </span>
  );
}
