/**
 * Bezpieczne parsowanie odpowiedzi modelu jako JSON (doc/06 §Fallback).
 *
 * Obsługuje: czysty JSON, JSON w blokach ```json ... ```, JSON otoczony
 * dodatkowym tekstem. Jako ostatnia próba — sanityzacja przecinków
 * końcowych (`,]` / `,}`) oraz escape niezaescapowanych prostych
 * cudzysłowów wewnątrz stringów (LLM-y trafiają na to przy cytowaniu
 * obcojęzycznych terminów w polskich uwagach typu „Hydratorpak"). Nigdy
 * nie rzuca wyjątku — zawsze zwraca wynik.
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

/**
 * Escapuje niezaescapowane proste cudzysłowy wewnątrz stringów JSON.
 *
 * Heurystyka: cudzysłow zamykający string JSON jest zawsze followowany
 * przez `,`, `}`, `]`, `:` lub koniec wejścia (z pominięciem whitespace).
 * Jeśli po `"` widzimy litery/cyfry/inną treść — to niezaescapowany
 * cudzysłów wewnątrz wartości stringu (typowa wpadka LLM przy mieszaniu
 * polskich „..." z prostym `"`). Escapujemy go i kontynuujemy w stringu.
 */
function escapeInnerStraightQuotes(text: string): string {
  let out = "";
  let inString = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      out += ch;
      escape = false;
      continue;
    }
    if (ch === "\\") {
      out += ch;
      escape = true;
      continue;
    }
    if (!inString) {
      if (ch === '"') inString = true;
      out += ch;
      continue;
    }
    if (ch !== '"') {
      out += ch;
      continue;
    }
    // W stringu, napotkany niezaescapowany `"` — sprawdź czy to faktyczny koniec.
    let j = i + 1;
    while (j < text.length && (text[j] === " " || text[j] === "\t" || text[j] === "\n" || text[j] === "\r")) {
      j++;
    }
    const next = j < text.length ? text[j] : "";
    if (next === "," || next === "}" || next === "]" || next === ":" || next === "") {
      // Faktyczny koniec stringu.
      out += ch;
      inString = false;
    } else {
      // Wewnętrzny niezaescapowany cudzysłow — escapuj.
      out += '\\"';
    }
  }
  return out;
}

/**
 * Usuwa przecinki końcowe przed `]` / `}` poza stringami JSON.
 * String-aware (śledzi cudzysłowy i escapy), żeby nie ruszać przecinków
 * wewnątrz wartości typu `"text, with comma"`.
 */
function stripTrailingCommas(text: string): string {
  let out = "";
  let inString = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      out += ch;
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === ",") {
      let j = i + 1;
      while (j < text.length && (text[j] === " " || text[j] === "\t" || text[j] === "\n" || text[j] === "\r")) {
        j++;
      }
      if (j < text.length && (text[j] === "]" || text[j] === "}")) {
        // pomiń przecinek końcowy
        continue;
      }
    }
    out += ch;
  }
  return out;
}

/** Próbuje sparsować surową odpowiedź modelu jako wartość JSON. */
export function safeParseJSON(raw: string): JsonParseResult {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return { ok: false, error: "Pusta odpowiedź modelu." };
  }

  const candidates: string[] = [];
  candidates.push(raw.trim());

  const fenced = extractFromCodeFence(raw);
  if (fenced) candidates.push(fenced);

  const span = extractObjectSpan(raw);
  if (span) candidates.push(span);

  for (const candidate of candidates) {
    const direct = tryParse(candidate);
    if (direct.ok) return direct;
  }

  // Próba naprawcza — sanityzacja przecinków końcowych dla każdego kandydata.
  for (const candidate of candidates) {
    const sanitized = stripTrailingCommas(candidate);
    if (sanitized !== candidate) {
      const result = tryParse(sanitized);
      if (result.ok) return result;
    }
  }

  // Próba naprawcza — escape wewnętrznych prostych cudzysłowów, potem
  // dodatkowo strip przecinków na wypadek zbiegu obu problemów.
  for (const candidate of candidates) {
    const escaped = escapeInnerStraightQuotes(candidate);
    if (escaped !== candidate) {
      const result = tryParse(escaped);
      if (result.ok) return result;
      const stripped = stripTrailingCommas(escaped);
      if (stripped !== escaped) {
        const last = tryParse(stripped);
        if (last.ok) return last;
      }
    }
  }

  return { ok: false, error: "Nie udało się sparsować odpowiedzi modelu jako JSON." };
}
