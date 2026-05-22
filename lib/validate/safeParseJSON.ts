/**
 * Bezpieczne parsowanie odpowiedzi modelu jako JSON (doc/06 §Fallback).
 *
 * Obsługuje: czysty JSON, JSON w blokach ```json ... ```, JSON otoczony
 * dodatkowym tekstem. Nigdy nie rzuca wyjątku — zawsze zwraca wynik.
 */

export type JsonParseResult =
  | { ok: true; value: unknown }
  | { ok: false; error: string };

function tryParse(text: string): JsonParseResult {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Błąd parsowania JSON.",
    };
  }
}

/** Wyłuskuje zawartość z bloku ```json ... ``` lub ``` ... ```. */
function extractFromCodeFence(text: string): string | null {
  const match = text.match(/```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?```/i);
  return match ? match[1].trim() : null;
}

/** Wyłuskuje fragment od pierwszego `{` do ostatniego `}`. */
function extractObjectSpan(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

/** Próbuje sparsować surową odpowiedź modelu jako wartość JSON. */
export function safeParseJSON(raw: string): JsonParseResult {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return { ok: false, error: "Pusta odpowiedź modelu." };
  }

  const direct = tryParse(raw.trim());
  if (direct.ok) return direct;

  const fenced = extractFromCodeFence(raw);
  if (fenced) {
    const fromFence = tryParse(fenced);
    if (fromFence.ok) return fromFence;
  }

  const span = extractObjectSpan(raw);
  if (span) {
    const fromSpan = tryParse(span);
    if (fromSpan.ok) return fromSpan;
  }

  return { ok: false, error: "Nie udało się sparsować odpowiedzi modelu jako JSON." };
}
