/**
 * Deterministyczne przeliczanie poziomu ryzyka (doc/06, doc/07).
 *
 * Reguły:
 * - ostrzeżenie krytyczne => ryzyko wysokie,
 * - ostrzeżenie zwykłe    => ryzyko średnie (o ile nie jest już wysokie),
 * - brak ostrzeżeń        => ryzyko niskie,
 * - przegląd człowieka    => przy ryzyku wysokim lub profilu wymagającym go zawsze.
 */

import type { RiskLevel, TranslationProfile, Warning } from "../types";

export interface RiskOutcome {
  riskLevel: RiskLevel;
  suggestedHumanReview: boolean;
}

/** Wylicza poziom ryzyka i sugestię przeglądu na podstawie ostrzeżeń i profilu. */
export function recalcRisk(
  warnings: Warning[],
  profile: TranslationProfile,
): RiskOutcome {
  const hasCritical = warnings.some((warning) => warning.severity === "critical");
  const hasWarning = warnings.some((warning) => warning.severity === "warning");

  const riskLevel: RiskLevel = hasCritical ? "high" : hasWarning ? "medium" : "low";
  const suggestedHumanReview = profile.alwaysSuggestHumanReview || riskLevel === "high";

  return { riskLevel, suggestedHumanReview };
}
