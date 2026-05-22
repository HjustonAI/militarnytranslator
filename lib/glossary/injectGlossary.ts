/**
 * Dopasowanie i wstrzyknięcie glosariusza do prompta (doc/04, doc/07 §4).
 *
 * Z baseline oraz glosariusza użytkownika wybierane są wyłącznie wpisy,
 * których źródło faktycznie występuje w tekście — dzięki temu prompt nie
 * puchnie. Sekcja użytkownika ma najwyższy priorytet i nadpisuje baseline.
 */

import baselineJson from "./baseline.json";
import { getLanguage } from "../languages";
import type {
  GlossaryAppliedEntry,
  GlossaryEntry,
  GlossaryInjection,
  LangCode,
} from "../types";

/** Glosariusz bazowy załadowany z `baseline.json`. */
export const BASELINE_GLOSSARY: GlossaryEntry[] = baselineJson as unknown as GlossaryEntry[];

/** Escape znaków specjalnych regular expression. */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Czy tekst źródłowy zawiera dany termin?
 *
 * Dopasowanie jest niewrażliwe na wielkość liter, tolerancyjne na białe znaki
 * i ograniczone „miękką" granicą słowa — termin nie może być częścią dłuższego
 * wyrazu (np. „MOLLE" nie dopasuje się wewnątrz „MOLLEX").
 */
export function textContainsTerm(text: string, term: string): boolean {
  const cleaned = term.trim();
  if (!cleaned) return false;
  const pattern = escapeRegex(cleaned).replace(/\s+/g, "\\s+");
  try {
    const regex = new RegExp(`(?<![\\p{L}\\p{N}])${pattern}(?![\\p{L}\\p{N}])`, "iu");
    return regex.test(text);
  } catch {
    // Fallback, gdyby środowisko nie wspierało lookbehind / \p{...}.
    return text.toLowerCase().includes(cleaned.toLowerCase());
  }
}

/** Forma, w jakiej termin pojawia się w tłumaczeniu. */
function appliedForm(entry: GlossaryEntry, lang: LangCode): string {
  if (entry.policy === "preserve" || entry.policy === "context") return entry.source;
  // policy === "translate": wpis użytkownika ma `target`, baseline `translations`.
  return entry.target ?? entry.translations?.[lang] ?? entry.source;
}

/**
 * Buduje sekcję glosariusza do prompta oraz listę wykrytych wpisów.
 *
 * @param sourceText   polski tekst źródłowy
 * @param lang         język docelowy
 * @param userGlossary sparsowane wpisy użytkownika (z `parseUserGlossary`)
 */
export function injectGlossary(
  sourceText: string,
  lang: LangCode,
  userGlossary: GlossaryEntry[] = [],
): GlossaryInjection {
  const userMatches = userGlossary.filter((entry) =>
    textContainsTerm(sourceText, entry.source),
  );
  const userSources = new Set(userMatches.map((entry) => entry.source.toLowerCase()));

  // Baseline z pominięciem wpisów nadpisanych przez glosariusz użytkownika.
  const baselineMatches = BASELINE_GLOSSARY.filter(
    (entry) =>
      !userSources.has(entry.source.toLowerCase()) &&
      textContainsTerm(sourceText, entry.source),
  );

  const preserve = baselineMatches.filter((entry) => entry.policy === "preserve");
  const fixed = baselineMatches.filter((entry) => entry.policy === "translate");
  const contextual = baselineMatches.filter((entry) => entry.policy === "context");

  const sections: string[] = [];

  if (preserve.length > 0) {
    sections.push(
      "=== TERMS YOU MUST PRESERVE EXACTLY (do not translate) ===\n" +
        preserve.map((entry) => `- ${entry.source}`).join("\n"),
    );
  }

  if (fixed.length > 0) {
    const langLabel = getLanguage(lang).short;
    sections.push(
      `=== TERMS WITH FIXED TRANSLATION FOR ${langLabel} ===\n` +
        fixed
          .map((entry) => `- "${entry.source}" → "${appliedForm(entry, lang)}"`)
          .join("\n"),
    );
  }

  if (contextual.length > 0) {
    sections.push(
      "=== TERMS THAT MAY STAY IN THE ORIGINAL (translator's judgement) ===\n" +
        contextual.map((entry) => `- ${entry.source}`).join("\n"),
    );
  }

  if (userMatches.length > 0) {
    sections.push(
      "=== USER-PROVIDED TERMS (highest priority) ===\n" +
        userMatches
          .map((entry) =>
            entry.policy === "preserve"
              ? `- ${entry.source}`
              : `- "${entry.source}" → "${appliedForm(entry, lang)}"`,
          )
          .join("\n"),
    );
  }

  const promptSection =
    sections.length > 0
      ? sections.join("\n\n")
      : "No glossary terms apply to this source text.";

  const matched: GlossaryAppliedEntry[] = [
    ...preserve.map((entry) => ({ source: entry.source, appliedAs: entry.source })),
    ...fixed.map((entry) => ({ source: entry.source, appliedAs: appliedForm(entry, lang) })),
    ...contextual.map((entry) => ({ source: entry.source, appliedAs: entry.source })),
    ...userMatches.map((entry) => ({
      source: entry.source,
      appliedAs: appliedForm(entry, lang),
    })),
  ];

  return { promptSection, matched };
}
