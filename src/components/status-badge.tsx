import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/lib/types";

export function StatusBadge({
  level,
  className,
}: {
  level: UrgencyLevel;
  className?: string;
}) {
  const isComplete = level === "complete";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        isComplete
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-600",
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full shrink-0",
          isComplete ? "bg-emerald-500" : "bg-red-500"
        )}
      />
      {isComplete ? "All Set" : "Open"}
    </span>
  );
}
