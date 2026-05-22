/**
 * Adapter modelu Anthropic (doc/11) — wyłącznie po stronie serwera.
 *
 * Odpowiedź JSON wymuszana jest techniką prefill: wiadomość asystenta
 * zaczyna się od znaku „{", więc model kontynuuje czysty obiekt JSON.
 * Klient SDK tworzony jest leniwie — import modułu nie ma efektów ubocznych.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { LlmAdapter, LlmCallInput, LlmCallOutput } from "./adapter";

const DEFAULT_MODEL = "claude-sonnet-4-6";
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
      messages: [
        { role: "user", content: input.prompt.userMessage },
        { role: "assistant", content: "{" },
      ],
    });

    const body = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    // Prefill „{" nie jest częścią odpowiedzi — doklejamy go z powrotem.
    return { raw: `{${body}`, model };
  },
};
