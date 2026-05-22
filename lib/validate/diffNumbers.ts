/**
 * Walidacja deterministyczna: liczby ze źródła obecne w tłumaczeniu (doc/06).
 *
 * Liczby porównywane są po normalizacji separatora dziesiętnego (przecinek
 * traktowany jak kropka), żeby uniknąć fałszywych alarmów przy lokalizacji
 * formatu liczb między rynkami.
 */

import type { Warning } from "../types";

const NUMBER_PATTERN = /\d+(?:[.,]\d+)*/g;
const MAX_LISTED = 8;

/** Wyciąga tokeny liczbowe z tekstu. */
export function extractNumbers(text: string): string[] {
  return text.match(NUMBER_PATTERN) ?? [];
}

function normalize(token: string): string {
  return token.replace(/,/g, ".");
}

/** Wykrywa liczby obecne w źródle, lecz nieobecne w tłumaczeniu. */
export function diffNumbers(source: string, translation: string): Warning[] {
  const translationSet = new Set(extractNumbers(translation).map(normalize));
  const missing: string[] = [];
  const seen = new Set<string>();

  for (const token of extractNumbers(source)) {
    const key = normalize(token);
    if (translationSet.has(key) || seen.has(key)) continue;
    seen.add(key);
    missing.push(token);
  }

  if (missing.length === 0) return [];

  const listed = missing.slice(0, MAX_LISTED).join(", ");
  const suffix =
    missing.length > MAX_LISTED ? ` (i ${missing.length - MAX_LISTED} więcej)` : "";

  return [
    {
      severity: "warning",
      code: "MISSING_NUMBER",
      title: "Brakujące liczby w tłumaczeniu",
      body: `Liczby obecne w źródle, lecz nieodnalezione w tłumaczeniu: ${listed}${suffix}. Sprawdź, czy nie zostały pominięte lub zmienione.`,
    },
  ];
}
