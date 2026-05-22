/**
 * Sekcja promptu opisująca wybrany profil treści (doc/07 §2).
 *
 * Renderuje rekord `TranslationProfile` z `lib/profiles.ts` na blok tekstu
 * wstrzykiwany do promptu systemowego.
 */

import type { TranslationProfile } from "../types";

/** Buduje sekcję `CONTENT PROFILE` dla danego profilu. */
export function composeProfile(profile: TranslationProfile): string {
  return [
    `=== CONTENT PROFILE: ${profile.id} (${profile.displayName}) ===`,
    `Goal: ${profile.goal}`,
    `Tone: ${profile.tone}`,
    `Creativity: ${profile.creativity}/5 (1 = literal, 5 = transcreation)`,
    `Strictness: ${profile.strictness}/5 (1 = flexible, 5 = change nothing)`,
    `Length guidance: ${profile.lengthGuidance}`,
    `Optimize for: ${profile.optimizeFor}`,
    `Protect (keep exactly 1:1): ${profile.protect.join("; ")}`,
    `Avoid: ${profile.avoid.join("; ")}`,
    `Quality checks: ${profile.qualityChecks.join("; ")}`,
    ``,
    `PROFILE-SPECIFIC INSTRUCTION:`,
    profile.systemInstruction,
  ].join("\n");
}
