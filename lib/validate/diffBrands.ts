/**
 * Walidacja deterministyczna: chronione terminy obecne w tłumaczeniu (doc/06).
 *
 * Sprawdza wpisy baseline z kategorii brand / model / protected / spec —
 * jeśli termin jest w źródle, ale znika z tłumaczenia, sygnalizuje ryzyko
 * utraty marki, modelu, standardu lub parametru.
 */

import { BASELINE_GLOSSARY, textContainsTerm } from "../glossary/injectGlossary";
import type { GlossaryCategory, Warning } from "../types";

const PROTECTED_CATEGORIES: ReadonlySet<GlossaryCategory> = new Set<GlossaryCategory>([
  "brand",
  "model",
  "protected",
  "spec",
]);
const MAX_LISTED = 8;

/** Wykrywa chronione terminy obecne w źródle, lecz nieobecne w tłumaczeniu. */
export function diffBrands(source: string, translation: string): Warning[] {
  const missing: string[] = [];
  const seen = new Set<string>();

  for (const entry of BASELINE_GLOSSARY) {
    if (!PROTECTED_CATEGORIES.has(entry.category)) continue;
    const key = entry.source.toLowerCase();
    if (seen.has(key)) continue;
    if (
      textContainsTerm(source, entry.source) &&
      !textContainsTerm(translation, entry.source)
    ) {
      seen.add(key);
      missing.push(entry.source);
    }
  }

  if (missing.length === 0) return [];

  const listed = missing.slice(0, MAX_LISTED).join(", ");
  const suffix =
    missing.length > MAX_LISTED ? ` (i ${missing.length - MAX_LISTED} więcej)` : "";

  return [
    {
      severity: "warning",
      code: "BRAND_DRIFT",
      title: "Możliwa utrata chronionych terminów",
      body: `Terminy chronione obecne w źródle, lecz nieodnalezione w tłumaczeniu: ${listed}${suffix}. Marki, modele i standardy muszą zostać zachowane 1:1.`,
    },
  ];
}
