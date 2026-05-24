/**
 * Adapter modelu Anthropic (doc/11) — wyłącznie po stronie serwera.
 *
 * JSON-only wymuszany jest w prompt-cie (BASE_SYSTEM_PROMPT + końcowa linia
 * userMessage: „Return ONLY the JSON object — no code fences, no extra text").
 * NIE używamy prefilla wiadomości asystenta — część modeli Anthropic go
 * odrzuca komunikatem „This model does not support assistant message prefill.
 * The conversation must end with a user message." Parsowanie odpowiedzi
 * (safeParseJSON → Zod → walidacje deterministyczne) tolerancyjne na drobny
 * prose wokół JSON-a, więc prefill nie jest potrzebny.
 *
 * Klient SDK tworzony jest leniwie — import modułu nie ma efektów ubocznych.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { LlmAdapter, LlmCallInput, LlmCallOutput } from "./adapter";

const DEFAULT_MODEL = "claude-sonnet-4-6";
// Sufit znakowy dla pełnego JSON-a kontraktu doc/13 z bogatymi listami
// (preservedTerms, glossaryApplied, warnings, qualityNotes) plus styleRationale.
// 4096 okazało się ciasne dla profili produkujących długie listy (seo,
// marketing) — wycięcie odpowiedzi na granicy `max_tokens` produkuje
// niepoprawny JSON i wymusza fallback. 8192 daje bezpieczny margines.
const MAX_TOKENS = 8192;

export const anthropicAdapter: LlmAdapter = {
  id: "anthropic",

  async call(input: LlmCallInput): Promise<LlmCallOutput> {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("Brak klucza API modelu.");
    }

    const model = process.env.LLM_MODEL?.trim() || DEFAULT_MODEL;
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      temperature: input.prompt.modelParams.temperature,
      system: input.prompt.systemMessage,
      messages: [{ role: "user", content: input.prompt.userMessage }],
    });

    if (response.stop_reason === "max_tokens") {
      // Diagnostyka — wycięcie na max_tokens daje uszkodzony JSON i fallback.
      console.warn("[anthropic] response truncated at max_tokens", {
        model,
        maxTokens: MAX_TOKENS,
        outputTokens: response.usage?.output_tokens,
      });
    }

    const raw = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return { raw, model };
  },
};
