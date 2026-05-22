/**
 * Walidacja deterministyczna: placeholdery ze źródła obecne w tłumaczeniu.
 *
 * Wykrywa formy {name}, {{token}}, %s, %d, %1$s. Utrata placeholdera jest
 * błędem krytycznym — placeholder musi pozostać nietknięty (doc/06).
 */

import type { Warning } from "../types";

const PLACEHOLDER_PATTERN = /\{\{[^}]+\}\}|\{[^}{]+\}|%(?:\d+\$)?[a-zA-Z]/g;
const MAX_LISTED = 8;

/** Wyciąga placeholdery z tekstu. */
export function extractPlaceholders(text: string): string[] {
  return text.match(PLACEHOLDER_PATTERN) ?? [];
}

/** Wykrywa placeholdery obecne w źródle, lecz nieobecne w tłumaczeniu. */
export function diffPlaceholders(source: string, translation: string): Warning[] {
  const translationSet = new Set(extractPlaceholders(translation));
  const missing: string[] = [];
  const seen = new Set<string>();

  for (const token of extractPlaceholders(source)) {
    if (translationSet.has(token) || seen.has(token)) continue;
    seen.add(token);
    missing.push(token);
  }

  if (missing.length === 0) return [];

  const listed = missing.slice(0, MAX_LISTED).join(", ");
  const suffix =
    missing.length > MAX_LISTED ? ` (i ${missing.length - MAX_LISTED} więcej)` : "";

  return [
    {
      severity: "critical",
      code: "PLACEHOLDER_LOST",
      title: "Utracone placeholdery",
      body: `Placeholdery ze źródła nieobecne w tłumaczeniu: ${listed}${suffix}. Placeholdery muszą pozostać nietknięte.`,
    },
  ];
}
