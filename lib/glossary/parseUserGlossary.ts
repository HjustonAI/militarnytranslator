/**
 * Parser glosariusza użytkownika (doc/04 §9).
 *
 * Format wejścia — jeden wpis na linię:
 *
 *   źródło => tłumaczenie
 *
 * Wpis, w którym źródło jest równe tłumaczeniu, staje się regułą `preserve`
 * (termin zostaje 1:1). Pozostałe stają się regułami `translate`.
 * Wpisy użytkownika mają najwyższy priorytet i nadpisują baseline.
 */

import type { GlossaryEntry } from "../types";

const SEPARATOR = "=>";

/** Parsuje surowy tekst glosariusza użytkownika na listę wpisów. */
export function parseUserGlossary(raw: string | null | undefined): GlossaryEntry[] {
  if (!raw || !raw.trim()) return [];

  const entries: GlossaryEntry[] = [];
  const seen = new Set<string>();

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    // Pomijamy linie puste i komentarze.
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) continue;

    const sepIndex = trimmed.indexOf(SEPARATOR);
    if (sepIndex === -1) continue;

    const source = trimmed.slice(0, sepIndex).trim();
    const target = trimmed.slice(sepIndex + SEPARATOR.length).trim();
    if (!source || !target) continue;

    const key = source.toLowerCase();
    if (seen.has(key)) continue; // przy duplikacie wygrywa pierwszy wpis
    seen.add(key);

    const isPreserve = source.toLowerCase() === target.toLowerCase();
    entries.push(
      isPreserve
        ? { source, category: "user", policy: "preserve" }
        : { source, category: "user", policy: "translate", target },
    );
  }

  return entries;
}
