/**
 * Wspólny interfejs adapterów modelu (doc/11).
 *
 * Każdy adapter (mock, anthropic) przyjmuje żądanie wraz ze zbudowanym
 * promptem i zwraca surową odpowiedź JSON jako tekst. Parsowanie i walidacja
 * odbywają się jednolicie w endpointcie — niezależnie od użytego adaptera.
 */

import type { BuiltPrompt } from "../prompt";
import type { TranslateRequest } from "../types";

export interface LlmCallInput {
  request: TranslateRequest;
  prompt: BuiltPrompt;
}

export interface LlmCallOutput {
  /** Surowa odpowiedź modelu — oczekiwany obiekt JSON jako tekst. */
  raw: string;
  /** Nazwa modelu do wpisania w `meta.model`. */
  model: string;
}

export interface LlmAdapter {
  readonly id: "mock" | "anthropic";
  call(input: LlmCallInput): Promise<LlmCallOutput>;
}
