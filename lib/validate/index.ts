/**
 * Warstwa walidacji — publiczne API.
 *
 * `runDeterministicValidations` uruchamia walidacje liczb, placeholderów
 * i chronionych terminów, dokleja wykryte ostrzeżenia i przelicza ryzyko.
 * `buildFallbackResult` buduje bezpieczną odpowiedź, gdy model nie zwrócił
 * poprawnego JSON-a (doc/06 §Fallback).
 */

import type { TranslateRequest, TranslationProfile, TranslationResult } from "../types";
import { diffBrands } from "./diffBrands";
import { diffNumbers } from "./diffNumbers";
import { diffPlaceholders } from "./diffPlaceholders";
import { recalcRisk } from "./recalcRisk";

export { TranslateRequestSchema, TranslationResultSchema } from "./schema";
export type { ParsedModelResult, TranslateRequestInput } from "./schema";
export { safeParseJSON } from "./safeParseJSON";
export type { JsonParseResult } from "./safeParseJSON";
export { diffNumbers, extractNumbers } from "./diffNumbers";
export { diffPlaceholders, extractPlaceholders } from "./diffPlaceholders";
export { diffBrands } from "./diffBrands";
export { recalcRisk } from "./recalcRisk";
export type { RiskOutcome } from "./recalcRisk";

/**
 * Dokleja deterministyczne ostrzeżenia do wyniku i przelicza ryzyko.
 * Walidacje uzupełniają (nie zastępują) ostrzeżenia modelu.
 */
export function runDeterministicValidations(
  result: TranslationResult,
  sourceText: string,
  profile: TranslationProfile,
): TranslationResult {
  const extraWarnings: TranslationResult["warnings"] = [
    ...diffNumbers(sourceText, result.translation),
    ...diffPlaceholders(sourceText, result.translation),
    ...diffBrands(sourceText, result.translation),
  ];
  const warnings = [...result.warnings, ...extraWarnings];
  const { riskLevel, suggestedHumanReview } = recalcRisk(warnings, profile);

  return { ...result, warnings, riskLevel, suggestedHumanReview };
}

/** Buduje bezpieczną odpowiedź zastępczą, gdy odpowiedź modelu jest niepoprawna. */
export function buildFallbackResult(
  request: TranslateRequest,
  rawModelOutput: string,
): TranslationResult {
  return {
    profileUsed: request.profile,
    targetLang: request.lang,
    translation: rawModelOutput.trim(),
    riskLevel: "high",
    suggestedHumanReview: true,
    qualityNotes: [],
    preservedTerms: [],
    warnings: [
      {
        severity: "critical",
        code: "STRUCTURED_OUTPUT_LOST",
        title: "Utracona struktura odpowiedzi",
        body: "Model nie zwrócił poprawnego obiektu JSON. Wyświetlono surową odpowiedź — wymagany przegląd człowieka przed użyciem.",
      },
    ],
    styleRationale: "Brak — odpowiedź modelu nie miała poprawnej struktury JSON.",
    glossaryApplied: [],
  };
}
