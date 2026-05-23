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
const MAX_TOKENS = 4096;

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

    const raw = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return { raw, model };
  },
};
