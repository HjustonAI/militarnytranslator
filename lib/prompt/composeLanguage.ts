/**
 * Sekcja promptu opisująca język docelowy (doc/07 §3).
 *
 * Renderuje rekord `LanguageRule` z `lib/languages.ts`. Dla CS, UK, RO i HU
 * dokleja obowiązkowe ostrzeżenie krytyczne; dla EN-US/EN-UK — rozróżnienie
 * ortograficzno-leksykalne.
 */

import type { LanguageRule } from "../types";

/** Buduje sekcję `TARGET LANGUAGE` dla danego języka. */
export function composeLanguage(language: LanguageRule): string {
  const lines = [
    `=== TARGET LANGUAGE: ${language.displayName} (code: ${language.code}) ===`,
    `Market notes: ${language.marketNotes}`,
    `Tone guidance: ${language.toneGuidance}`,
    `E-commerce conventions: ${language.ecommerceNotes}`,
    `Common risks: ${language.commonRisks.join("; ")}`,
    `Polish calque warnings: ${language.polishCalqueWarnings.join("; ")}`,
  ];

  if (language.specialDistinction) {
    lines.push(`Spelling / lexical distinction: ${language.specialDistinction}`);
  }

  if (language.criticalWarning) {
    lines.push(
      `CRITICAL INSTRUCTION (mandatory — overrides general style guidance): ${language.criticalWarning}`,
    );
  }

  return lines.join("\n");
}
