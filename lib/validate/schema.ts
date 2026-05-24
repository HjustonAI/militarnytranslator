/**
 * Schematy Zod (doc/06, doc/13).
 *
 * `TranslateRequestSchema` waliduje żądanie wchodzące do /api/translate.
 * `TranslationResultSchema` waliduje odpowiedź modelu (kanoniczny kontrakt
 * doc/13). Schemat odpowiedzi jest tolerancyjny — pojedyncze pola mają
 * `.catch()`, więc drobny błąd modelu nie unieważnia całej odpowiedzi.
 * Twardym wymogiem jest jedynie obecność tekstowego pola `translation`,
 * przy czym typowe odchylenia LLM (tablica akapitów, prosta liczba, obiekt
 * z polem tekstowym) są coercowane do stringu zanim Zod zwaliduje typ.
 */

import { z } from "zod";
import { LANGUAGES } from "../languages";
import { PROFILES } from "../profiles";
import type { LangCode, ProfileId } from "../types";

const isProfileId = (value: string): value is ProfileId =>
  PROFILES.some((profile) => profile.id === value);

const isLangCode = (value: string): value is LangCode =>
  LANGUAGES.some((language) => language.code === value);

/** Żądanie tłumaczenia (`TranslateRequest`). */
export const TranslateRequestSchema = z.object({
  profile: z.string().refine(isProfileId, { message: "Nieznany profil treści." }),
  lang: z.string().refine(isLangCode, { message: "Nieznany język docelowy." }),
  source: z.string(),
  glossary: z.string().optional(),
  instructions: z.string().optional(),
});

/**
 * Coerce drobnych odchyleń LLM dla pola `translation` do stringu.
 * Akceptuje: string (bez zmian), tablicę stringów (join \n), liczbę/boolean
 * (String(v)), obiekt z typowym polem tekstowym (`text`/`content`/`value`/
 * `translated`/`output`). Pozostałe typy puszcza dalej — Zod je odrzuci.
 */
function coerceTranslation(value: unknown): unknown {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value.join("\n");
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of ["text", "content", "value", "translated", "output"]) {
      const candidate = obj[key];
      if (typeof candidate === "string") return candidate;
    }
  }
  return value;
}

/** Coerce pojedynczego pola tekstowego — akceptuje także liczby/boolean. */
function coerceText(value: unknown): unknown {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return value;
}

const QualityNoteSchema = z.object({
  kind: z.enum(["ok", "info"]).catch("info"),
  text: z.preprocess(coerceText, z.string()).catch(""),
});

const PreservedTermSchema = z.object({
  term: z.preprocess(coerceText, z.string()).catch(""),
  category: z.preprocess(coerceText, z.string()).catch("Inne"),
  reason: z.preprocess(coerceText, z.string()).catch(""),
});

const WarningSchema = z.object({
  severity: z.enum(["info", "warning", "critical"]).catch("info"),
  title: z.preprocess(coerceText, z.string()).catch(""),
  body: z.preprocess(coerceText, z.string()).catch(""),
  code: z.preprocess(coerceText, z.string()).optional(),
});

const GlossaryAppliedSchema = z.object({
  source: z.preprocess(coerceText, z.string()).catch(""),
  appliedAs: z.preprocess(coerceText, z.string()).catch(""),
});

/**
 * Odpowiedź modelu. Pole `meta` celowo pominięte — wypełnia je aplikacja,
 * a `z.object` usuwa nieznane klucze z wejścia. Wpisy tablicowe, które
 * całkowicie nie sparsują się jako obiekty (np. `null`), są wyłapywane
 * przez `.catch([])` na poziomie tablicy — pojedynczy zły wpis nie psuje
 * całej odpowiedzi.
 */
export const TranslationResultSchema = z.object({
  profileUsed: z.preprocess(coerceText, z.string()).catch(""),
  targetLang: z.preprocess(coerceText, z.string()).catch(""),
  translation: z.preprocess(coerceTranslation, z.string()),
  riskLevel: z.enum(["low", "medium", "high"]).catch("low"),
  suggestedHumanReview: z.boolean().catch(false),
  qualityNotes: z.array(QualityNoteSchema).catch([]),
  preservedTerms: z.array(PreservedTermSchema).catch([]),
  warnings: z.array(WarningSchema).catch([]),
  styleRationale: z.preprocess(coerceText, z.string()).catch(""),
  glossaryApplied: z.array(GlossaryAppliedSchema).catch([]),
});

export type TranslateRequestInput = z.infer<typeof TranslateRequestSchema>;
export type ParsedModelResult = z.infer<typeof TranslationResultSchema>;
