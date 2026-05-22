/**
 * Adapter demonstracyjny (mock) — działa bez klucza API (doc/07 §11, doc/13 §09).
 *
 * Generuje deterministyczną, ustrukturyzowaną odpowiedź dla dowolnego wejścia.
 * Nie woła modelu i nie potrafi realnie przetłumaczyć tekstu, więc pole
 * `translation` zawiera czysty tekst źródłowy — bez etykiety „[MOCK]" i bez
 * banera w treści. Charakter demonstracyjny sygnalizują: badge „Tryb: Demo",
 * `meta.model` = "mock" oraz jedno ostrzeżenie informacyjne. Notatki,
 * ostrzeżenia, uzasadnienie i ryzyko zmieniają się zależnie od profilu
 * i dopasowanego glosariusza.
 */

import { BASELINE_GLOSSARY, injectGlossary, textContainsTerm } from "../glossary/injectGlossary";
import { parseUserGlossary } from "../glossary/parseUserGlossary";
import { extractNumbers } from "../validate/diffNumbers";
import type {
  GlossaryCategory,
  PreservedTerm,
  ProfileId,
  QualityNote,
  TranslationResult,
  Warning,
} from "../types";
import type { LlmAdapter, LlmCallInput, LlmCallOutput } from "./adapter";

const MIN_DELAY_MS = 800;
const MAX_DELAY_MS = 1600;
const MAX_PRESERVED_TERMS = 12;

const PRESERVED_CATEGORY_LABEL: Partial<Record<GlossaryCategory, string>> = {
  brand: "Marka",
  model: "Model",
  protected: "Standard",
  spec: "Parametr",
};

const STYLE_RATIONALE: Record<ProfileId, string> = {
  product_long:
    "Profil opisu produktu (długi): zachowano parametry techniczne i nazwy własne, ton sprzedażowy dopasowany do rynku docelowego.",
  product_short:
    "Profil opisu krótkiego: priorytetem jest precyzja i zachowanie struktury tabel oraz list, bez ozdobników stylistycznych.",
  seo: "Profil SEO: treść dopasowana do intencji wyszukiwania rynku docelowego, z zachowaniem zakresu kategorii.",
  guide:
    "Profil poradnika: ekspercki, edukacyjny ton z zachowaniem struktury sekcji i rekomendacji autora.",
  marketing:
    "Profil marketingowy: transkreacja nastawiona na efekt perswazyjny, z zachowaniem CTA, rabatów i kodów promocyjnych.",
  ui_system:
    "Profil UI: krótkie, jednoznaczne mikrocopy zgodne z konwencjami rynku, placeholdery nietknięte.",
  informational:
    "Profil informacyjny: neutralny, budujący zaufanie ton, bez języka sprzedażowego.",
  legal:
    "Profil prawny: tłumaczenie ostrożne i formalne, bez parafrazy zmieniającej sens; zalecany przegląd człowieka.",
  infographic:
    "Profil infografiki: krótkie, rytmiczne linie z zachowaniem liczby punktów i sensu.",
  universal:
    "Profil uniwersalny: solidne, naturalne tłumaczenie bez agresywnej lokalizacji.",
  custom_prompt:
    "Profil własnej instrukcji: zastosowano wytyczne użytkownika w granicach zasad bezpieczeństwa (safety floor).",
};

const PROFILE_NOTE: Record<ProfileId, string> = {
  product_long: "Zachowano liczby, jednostki i nazwy własne produktu.",
  product_short: "Zachowano strukturę tabel, listy i jednostki techniczne.",
  seo: "Sprawdź długość nazwy kategorii i meta description pod kątem limitów.",
  guide: "Zachowano hierarchię nagłówków i nazwy modeli.",
  marketing: "Zweryfikuj wezwania do działania (CTA), rabaty i kody promocyjne.",
  ui_system: "Placeholdery i znaczniki pozostawiono bez zmian.",
  informational: "Zachowano nazwy metod płatności, kurierów oraz dane kontaktowe.",
  legal: "Zachowano numerację paragrafów i ustępów.",
  infographic: "Zachowano liczbę punktów i ich kolejność.",
  universal: "Zachowano strukturę akapitów i nazwy własne.",
  custom_prompt: "Instrukcja użytkownika została uwzględniona w granicach safety floor.",
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Zbiera chronione terminy i liczby obecne w tekście źródłowym. */
function buildPreservedTerms(source: string): PreservedTerm[] {
  const terms: PreservedTerm[] = [];
  const seen = new Set<string>();

  for (const entry of BASELINE_GLOSSARY) {
    const label = PRESERVED_CATEGORY_LABEL[entry.category];
    if (!label) continue;
    const key = entry.source.toLowerCase();
    if (seen.has(key) || !textContainsTerm(source, entry.source)) continue;
    seen.add(key);
    terms.push({ term: entry.source, category: label, reason: "Termin chroniony — zachowany 1:1." });
    if (terms.length >= MAX_PRESERVED_TERMS) return terms;
  }

  for (const number of extractNumbers(source)) {
    const key = number.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    terms.push({ term: number, category: "Liczba", reason: "Wartość liczbowa zachowana 1:1." });
    if (terms.length >= MAX_PRESERVED_TERMS) break;
  }

  return terms;
}

/** Buduje deterministyczny wynik demonstracyjny dla danego żądania. */
function buildMockResult(input: LlmCallInput): TranslationResult {
  const { request } = input;
  const injection = injectGlossary(
    request.source,
    request.lang,
    parseUserGlossary(request.glossary),
  );

  const qualityNotes: QualityNote[] = [
    { kind: "ok", text: PROFILE_NOTE[request.profile] },
  ];
  if (injection.matched.length > 0) {
    qualityNotes.push({
      kind: "ok",
      text: `Dopasowano ${injection.matched.length} wpisów glosariusza branżowego.`,
    });
  }

  const warnings: Warning[] = [
    {
      severity: "info",
      code: "DEMO_MODE",
      title: "Tryb demonstracyjny",
      body: "Aplikacja działa bez klucza API modelu — odpowiedź wygenerowano lokalnie. Włącz tryb API, aby uzyskać pełne tłumaczenie.",
    },
  ];
  if (request.profile === "legal") {
    warnings.push({
      severity: "warning",
      code: "LEGAL_REVIEW",
      title: "Treść prawna",
      body: "Tłumaczenia prawne wymagają weryfikacji przez specjalistę przed publikacją.",
    });
  } else if (request.profile === "marketing") {
    warnings.push({
      severity: "warning",
      code: "TRANSCREATION_CHECK",
      title: "Transkreacja",
      body: "Sprawdź zgodność wezwań do działania, rabatów i kodów promocyjnych z oryginałem.",
    });
  }

  return {
    profileUsed: request.profile,
    targetLang: request.lang,
    translation: request.source,
    riskLevel: "low",
    suggestedHumanReview: false,
    qualityNotes,
    preservedTerms: buildPreservedTerms(request.source),
    warnings,
    styleRationale: STYLE_RATIONALE[request.profile],
    glossaryApplied: injection.matched,
  };
}

export const mockAdapter: LlmAdapter = {
  id: "mock",

  async call(input: LlmCallInput): Promise<LlmCallOutput> {
    const delay = MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
    await sleep(delay);
    return { raw: JSON.stringify(buildMockResult(input)), model: "mock" };
  },
};
