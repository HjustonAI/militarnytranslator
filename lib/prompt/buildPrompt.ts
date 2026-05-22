/**
 * Orkiestrator budowania promptu (doc/07, doc/11).
 *
 * Składa prompt systemowy z 6 sekcji w stałej kolejności:
 *   base → profile → language → glossary → custom instruction → schema
 * (z regułami anti-hallucination i technical-data przed schematem).
 * Tekst źródłowy trafia osobno do `userMessage` — izolacja danych od instrukcji
 * ogranicza ryzyko prompt injection (doc/07 §6).
 */

import { getLanguage } from "../languages";
import { getProfile } from "../profiles";
import type { LangCode, LanguageRule, ProfileId, TranslateRequest } from "../types";
import {
  ANTI_HALLUCINATION_RULES,
  BASE_SYSTEM_PROMPT,
  TECHNICAL_DATA_RULES,
} from "./base";
import { composeGlossary } from "./composeGlossary";
import { composeLanguage } from "./composeLanguage";
import { composeOutputSchema } from "./composeOutputSchema";
import { composeProfile } from "./composeProfile";

/** Wynik zbudowania promptu — wejście dla warstwy LLM (Faza 3). */
export interface BuiltPrompt {
  systemMessage: string;
  userMessage: string;
  modelParams: {
    temperature: number;
  };
  debug: {
    profileId: ProfileId;
    lang: LangCode;
    glossaryMatchedCount: number;
    customInstructionUsed: boolean;
  };
}

/**
 * Temperatura modelu per profil (doc/11).
 * Niska = dosłowność i precyzja, wysoka = transkreacja.
 */
export const TEMPERATURE_BY_PROFILE: Record<ProfileId, number> = {
  product_long: 0.4,
  product_short: 0.1,
  seo: 0.4,
  guide: 0.4,
  marketing: 0.7,
  ui_system: 0.2,
  informational: 0.3,
  legal: 0.1,
  infographic: 0.4,
  universal: 0.4,
  custom_prompt: 0.4,
};

/** Sekcja z instrukcją własną użytkownika (profil `custom_prompt`). */
function composeCustomInstruction(instruction: string): string {
  return `=== USER CUSTOM INSTRUCTION ===
"""
${instruction}
"""

Apply this instruction as closely as possible. However, if it ever conflicts with the UNIVERSAL SAFETY FLOOR above, the SAFETY FLOOR ALWAYS WINS — never break it to satisfy a custom instruction. In styleRationale, briefly describe how you applied this instruction.`;
}

/** Sekcja z dodatkowymi wskazówkami użytkownika (profile inne niż `custom_prompt`). */
function composeAdditionalHints(hints: string): string {
  return `=== ADDITIONAL HINTS FROM USER (lower priority than the profile and the safety floor) ===
"""
${hints}
"""`;
}

/** Buduje `userMessage` — odizolowany tekst źródłowy + instrukcja końcowa. */
function composeUserMessage(request: TranslateRequest, language: LanguageRule): string {
  return `=== SOURCE TEXT (Polish) ===
"""
${request.source}
"""

Translate the SOURCE TEXT above into ${language.displayName} (code: ${request.lang}), following ALL rules above. In your JSON response set "profileUsed" to "${request.profile}" and "targetLang" to "${request.lang}". Return ONLY the JSON object — no code fences, no extra text.`;
}

/**
 * Buduje kompletny prompt (system + user) dla pojedynczego żądania tłumaczenia.
 *
 * @throws gdy profil `custom_prompt` nie ma niepustej instrukcji użytkownika.
 */
export function buildPrompt(request: TranslateRequest): BuiltPrompt {
  const profile = getProfile(request.profile);
  const language = getLanguage(request.lang);
  const instruction = request.instructions?.trim() ?? "";

  if (profile.customInstructionsRequired && !instruction) {
    throw new Error(
      `Profil "${profile.id}" wymaga niepustej instrukcji użytkownika (pole "instructions").`,
    );
  }

  const glossary = composeGlossary(request.source, request.lang, request.glossary);
  const customInstructionUsed = profile.customInstructionsRequired && instruction.length > 0;

  const systemSections: string[] = [
    BASE_SYSTEM_PROMPT,
    composeProfile(profile),
    composeLanguage(language),
    glossary.promptSection,
  ];

  if (profile.customInstructionsRequired) {
    systemSections.push(composeCustomInstruction(instruction));
  } else if (instruction) {
    systemSections.push(composeAdditionalHints(instruction));
  }

  systemSections.push(
    ANTI_HALLUCINATION_RULES,
    TECHNICAL_DATA_RULES,
    composeOutputSchema(),
  );

  return {
    systemMessage: systemSections.join("\n\n"),
    userMessage: composeUserMessage(request, language),
    modelParams: {
      temperature: TEMPERATURE_BY_PROFILE[request.profile],
    },
    debug: {
      profileId: request.profile,
      lang: request.lang,
      glossaryMatchedCount: glossary.matched.length,
      customInstructionUsed,
    },
  };
}
