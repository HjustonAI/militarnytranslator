/**
 * Sekcja promptu z glosariuszem (doc/07 §4).
 *
 * Parsuje surowy glosariusz użytkownika i przekazuje go do `injectGlossary`,
 * które filtruje wpisy po obecności w tekście źródłowym oraz nadaje wpisom
 * użytkownika priorytet nad baseline. Zwraca gotową sekcję promptu wraz
 * z listą wykrytych wpisów (na potrzeby pola `glossaryApplied` i debugowania).
 */

import { injectGlossary } from "../glossary/injectGlossary";
import { parseUserGlossary } from "../glossary/parseUserGlossary";
import type { GlossaryInjection, LangCode } from "../types";

/** Buduje sekcję glosariusza dla danego tekstu źródłowego i języka. */
export function composeGlossary(
  sourceText: string,
  lang: LangCode,
  rawUserGlossary?: string,
): GlossaryInjection {
  const userEntries = parseUserGlossary(rawUserGlossary);
  return injectGlossary(sourceText, lang, userEntries);
}
