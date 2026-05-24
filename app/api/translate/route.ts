/**
 * POST /api/translate — endpoint tłumaczenia.
 *
 * Przepływ: walidacja żądania -> budowa promptu -> wywołanie adaptera
 * (mock lub Anthropic, zależnie od trybu) -> parsowanie i walidacja
 * odpowiedzi -> walidacje deterministyczne -> `TranslationResult`.
 * Każdy błąd zwracany jest jako kontrolowany JSON `{ kind, message, requestId }`.
 */

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getLlm } from "@/lib/llm";
import { buildPrompt } from "@/lib/prompt";
import { getProfile } from "@/lib/profiles";
import type { TranslateError, TranslateRequest, TranslationResult } from "@/lib/types";
import {
  buildFallbackResult,
  runDeterministicValidations,
  safeParseJSON,
  TranslateRequestSchema,
  TranslationResultSchema,
} from "@/lib/validate";

function errorResponse(
  kind: TranslateError["kind"],
  message: string,
  requestId: string,
  status: number,
): NextResponse {
  const body: TranslateError = { kind, message, requestId };
  return NextResponse.json(body, { status });
}

/** Klasyfikuje błąd adaptera modelu na podstawie statusu HTTP. */
function classifyError(error: unknown): TranslateError["kind"] {
  const status = (error as { status?: number } | null)?.status;
  if (status === 429) return "rate";
  if (status === 401 || status === 403) return "api";
  if (typeof status === "number" && status >= 500) return "api";
  return "network";
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = randomUUID();

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("api", "Nieprawidłowe ciało żądania — oczekiwano JSON.", requestId, 400);
    }

    const parsed = TranslateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("api", "Nieprawidłowe dane żądania tłumaczenia.", requestId, 400);
    }
    const translateRequest: TranslateRequest = parsed.data;

    if (translateRequest.source.trim().length === 0) {
      return errorResponse("api", "Tekst źródłowy jest pusty.", requestId, 400);
    }

    if (translateRequest.profile === "custom_prompt" && !translateRequest.instructions?.trim()) {
      return errorResponse(
        "api",
        "Profil własnej instrukcji wymaga podania instrukcji systemowej.",
        requestId,
        400,
      );
    }

    const prompt = buildPrompt(translateRequest);
    const llm = getLlm();

    const startedAt = Date.now();
    let raw: string;
    let model: string;
    try {
      const output = await llm.call({ request: translateRequest, prompt });
      raw = output.raw;
      model = output.model;
    } catch (error) {
      // Diagnostyka serwerowa — logujemy strukturę błędu adaptera (bez klucza
      // API i bez treści promptu/źródła), żeby triaż 502 nie wymagał zgadywania.
      const err = error as {
        name?: string;
        message?: string;
        status?: number;
        type?: string;
        error?: { type?: string; message?: string };
        response?: { status?: number };
      } | null;
      console.error("[translate] LLM call failed", {
        requestId,
        name: err?.name,
        message: err?.message,
        status: err?.status,
        type: err?.type,
        errorType: err?.error?.type,
        errorMessage: err?.error?.message,
        responseStatus: err?.response?.status,
        profile: translateRequest.profile,
        lang: translateRequest.lang,
        sourceLen: translateRequest.source.length,
        model: process.env.LLM_MODEL?.trim() || "default",
      });
      return errorResponse(
        classifyError(error),
        "Nie udało się uzyskać odpowiedzi modelu.",
        requestId,
        502,
      );
    }
    const durationMs = Date.now() - startedAt;

    const profile = getProfile(translateRequest.profile);
    let result: TranslationResult;

    const parsedJson = safeParseJSON(raw);
    const schemaResult = parsedJson.ok
      ? TranslationResultSchema.safeParse(parsedJson.value)
      : null;

    if (schemaResult?.success) {
      const base: TranslationResult = {
        ...schemaResult.data,
        profileUsed: translateRequest.profile,
        targetLang: translateRequest.lang,
      };
      result = runDeterministicValidations(base, translateRequest.source, profile);
    } else {
      // Diagnostyka strukturalnej walidacji — sanityzowane (bez API key, bez
      // pełnego źródła/promptu). Pomaga zlokalizować pole zrywające schemat.
      if (!parsedJson.ok) {
        console.error("[translate] structured-output JSON parse failed", {
          requestId,
          profile: translateRequest.profile,
          lang: translateRequest.lang,
          jsonError: parsedJson.error,
          rawHead: raw.slice(0, 500),
        });
      } else if (schemaResult && !schemaResult.success) {
        console.error("[translate] structured-output Zod validation failed", {
          requestId,
          profile: translateRequest.profile,
          lang: translateRequest.lang,
          issues: schemaResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            code: issue.code,
            message: issue.message,
          })),
          topLevelKeys:
            parsedJson.value && typeof parsedJson.value === "object"
              ? Object.keys(parsedJson.value as Record<string, unknown>)
              : null,
        });
      }
      // Model nie zwrócił poprawnego JSON-a — bezpieczna odpowiedź zastępcza.
      result = buildFallbackResult(translateRequest, raw);
    }

    result = { ...result, meta: { ...result.meta, model, durationMs } };

    return NextResponse.json(result);
  } catch {
    return errorResponse("unknown", "Wystąpił nieoczekiwany błąd serwera.", requestId, 500);
  }
}
