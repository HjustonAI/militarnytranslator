/**
 * Rozstrzyganie trybu działania aplikacji (doc/13 §09).
 *
 * Reguły:
 * - MOCK_MODE=1              => tryb demo (wymuszony),
 * - brak ANTHROPIC_API_KEY   => tryb demo,
 * - ANTHROPIC_API_KEY obecny => tryb API.
 *
 * Funkcja działa wyłącznie po stronie serwera (czyta zmienne środowiskowe).
 */

import type { AppMode } from "./types";

/** Zwraca tryb działania na podstawie zmiennych środowiskowych. */
export function resolveMode(): AppMode {
  if (process.env.MOCK_MODE === "1") return "demo";
  if (!process.env.ANTHROPIC_API_KEY?.trim()) return "demo";
  return "api";
}
