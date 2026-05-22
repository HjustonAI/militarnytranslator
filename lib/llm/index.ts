/**
 * Warstwa LLM — wybór adaptera modelu.
 *
 * `getLlm()` zwraca adapter zgodny z trybem działania: Anthropic w trybie API,
 * mock w trybie demo. Endpoint korzysta wyłącznie z tej funkcji.
 */

import { resolveMode } from "../env";
import { anthropicAdapter } from "./anthropic";
import { mockAdapter } from "./mock";
import type { LlmAdapter } from "./adapter";

export type { LlmAdapter, LlmCallInput, LlmCallOutput } from "./adapter";

/** Zwraca adapter modelu zgodny z aktualnym trybem działania. */
export function getLlm(): LlmAdapter {
  return resolveMode() === "api" ? anthropicAdapter : mockAdapter;
}
