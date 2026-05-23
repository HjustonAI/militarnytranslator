import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import clsx from "clsx";
import type { Severity, Warning } from "@/lib/types";

const STYLES: Record<Severity, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  critical: "border-rose-200 bg-rose-50 text-rose-900",
};

const ICON_STYLES: Record<Severity, string> = {
  info: "text-sky-600",
  warning: "text-amber-600",
  critical: "text-rose-600",
};

/** Karta ostrzeżenia w kolorystyce odpowiadającej severity (doc/13 §07). */
export function WarningCard({ warning }: { warning: Warning }) {
  const Icon =
    warning.severity === "info"
      ? Info
      : warning.severity === "warning"
        ? AlertTriangle
        : AlertCircle;

  return (
    <div
      className={clsx(
        "flex items-start gap-3 rounded-lg border px-3.5 py-3 text-sm",
        STYLES[warning.severity],
      )}
    >
      <Icon
        className={clsx("mt-0.5 h-4 w-4 flex-shrink-0", ICON_STYLES[warning.severity])}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="font-medium">{warning.title}</div>
        <div className="mt-0.5 text-xs leading-relaxed">{warning.body}</div>
      </div>
    </div>
  );
}
