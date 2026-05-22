/**
 * Schematy Zod (doc/06, doc/13).
 *
 * `TranslateRequestSchema` waliduje żądanie wchodzące do /api/translate.
 * `TranslationResultSchema` waliduje odpowiedź modelu (kanoniczny kontrakt
 * doc/13). Schemat odpowiedzi jest tolerancyjny — pojedyncze pola mają
 * `.catch()`, więc drobny błąd modelu nie unieważnia całej odpowiedzi.
 * Twardym wymogiem jest jedynie obecność tekstowego pola `translation`.
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

const QualityNoteSchema = z.object({
  kind: z.enum(["ok", "info"]).catch("info"),
  text: z.string().catch(""),
});

const PreservedTermSchema = z.object({
  term: z.string().catch(""),
  category: z.string().catch("Inne"),
  reason: z.string().catch(""),
});

const WarningSchema = z.object({
  severity: z.enum(["info", "warning", "critical"]).catch("info"),
  title: z.string().catch(""),
  body: z.string().catch(""),
  code: z.string().optional(),
});

const GlossaryAppliedSchema = z.object({
  source: z.string().catch(""),
  appliedAs: z.string().catch(""),
});

/**
 * Odpowiedź modelu. Pole `meta` celowo pominięte — wypełnia je aplikacja,
 * a `z.object` usuwa nieznane klucze z wejścia.
 */
export const TranslationResultSchema = z.object({
  profileUsed: z.string().catch(""),
  targetLang: z.string().catch(""),
  translation: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]).catch("low"),
  suggestedHumanReview: z.boolean().catch(false),
  qualityNotes: z.array(QualityNoteSchema).catch([]),
  preservedTerms: z.array(PreservedTermSchema).catch([]),
  warnings: z.array(WarningSchema).catch([]),
  styleRationale: z.string().catch(""),
  glossaryApplied: z.array(GlossaryAppliedSchema).catch([]),
});

export type TranslateRequestInput = z.infer<typeof TranslateRequestSchema>;
export type ParsedModelResult = z.infer<typeof TranslationResultSchema>;
