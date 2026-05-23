import clsx from "clsx";
import type { RiskLevel } from "@/lib/types";

const LABELS: Record<RiskLevel, string> = {
  low: "Niskie ryzyko",
  medium: "Średnie ryzyko — sprawdź ostrzeżenia",
  high: "Wysokie ryzyko — wymagany przegląd",
};

const STYLES: Record<RiskLevel, string> = {
  low: "bg-risk-low-bg text-risk-low-fg",
  medium: "bg-risk-med-bg text-risk-med-fg",
  high: "bg-risk-high-bg text-risk-high-fg",
};

const DOTS: Record<RiskLevel, string> = {
  low: "bg-risk-low-fg",
  medium: "bg-risk-med-fg",
  high: "bg-risk-high-fg",
};

/** Kolorowy chip ryzyka — pierwsza rzecz po sukcesie tłumaczenia. */
export function RiskChip({ level }: { level: RiskLevel }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        STYLES[level],
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", DOTS[level])} aria-hidden />
      {LABELS[level]}
    </span>
  );
}
