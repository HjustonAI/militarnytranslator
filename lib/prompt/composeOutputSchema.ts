/**
 * Sekcja promptu wymuszająca strukturę odpowiedzi (doc/07 §7).
 *
 * Schemat odpowiada kanonicznemu kontraktowi `TranslationResult` z doc/13.
 * Pole `meta` jest wypełniane przez aplikację (Faza 3/5), więc model jest
 * proszony o jego pominięcie.
 */

/** Buduje sekcję `REQUIRED OUTPUT FORMAT` (statyczna). */
export function composeOutputSchema(): string {
  return `=== REQUIRED OUTPUT FORMAT (JSON only — no Markdown, no code fences) ===
Respond with a SINGLE JSON object and nothing else, matching exactly this shape:

{
  "profileUsed": "<the content profile id from the CONTENT PROFILE section>",
  "targetLang": "<the target language code from the TARGET LANGUAGE section>",
  "translation": "<the full translated text, ready to copy>",
  "riskLevel": "low" | "medium" | "high",
  "suggestedHumanReview": true | false,
  "qualityNotes": [
    { "kind": "ok" | "info", "text": "<short, concrete note in Polish>" }
  ],
  "preservedTerms": [
    { "term": "<term kept 1:1>", "category": "<Polish label, e.g. Marka / Model / Jednostka / Standard / Placeholder / Kod / Inne>", "reason": "<short reason in Polish>" }
  ],
  "warnings": [
    { "severity": "info" | "warning" | "critical", "title": "<short title in Polish>", "body": "<explanation in Polish>" }
  ],
  "styleRationale": "<1-3 sentences in Polish explaining why this style was chosen>",
  "glossaryApplied": [
    { "source": "<source term>", "appliedAs": "<how it appears in the translation>" }
  ]
}

OUTPUT RULES:
- Output ONLY the JSON object. No code fences, no commentary, nothing before or after it.
- "profileUsed" MUST equal the content profile id given in the CONTENT PROFILE section.
- "targetLang" MUST equal the target language code given in the TARGET LANGUAGE section.
- "translation" is written in the TARGET LANGUAGE. Every other text field is written in POLISH — the operator reads them.
- All lists are required; use an empty array [] when there is nothing to report (never null).
- "qualityNotes": 0-5 concrete notes — never generic praise. "kind" is "ok" for a passed check, "info" for a neutral remark.
- "preservedTerms": list every brand, model, number, unit, standard and placeholder kept 1:1.
- "warnings": 0-5 entries. Use "critical" only for issues that block publication (a lost number/unit/placeholder, a false friend); "warning" for quality risks; "info" for minor style changes.
- "riskLevel" is "low" unless warnings or the profile justify "medium" or "high".
- "suggestedHumanReview" is true when the profile is legal, when any critical warning exists, or when riskLevel is "high".
- Do NOT add a "meta" field — the application fills it in after receiving your response.`;
}
