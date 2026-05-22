/**
 * Militaria Translation Studio — kanoniczne typy domenowe.
 *
 * Kontrakt odpowiedzi (`TranslationResult`) jest zgodny z doc/13
 * (handoff UI v2.0) i stanowi jedyne źródło prawdy dla UI oraz API.
 */

/* ------------------------------------------------------------------ */
/* Identyfikatory                                                      */
/* ------------------------------------------------------------------ */

/** 11 profili tłumaczeniowych — rdzeń produktu (doc/01, doc/02). */
export type ProfileId =
  | "product_long"
  | "product_short"
  | "seo"
  | "guide"
  | "marketing"
  | "ui_system"
  | "informational"
  | "legal"
  | "infographic"
  | "universal"
  | "custom_prompt";

/** 9 języków docelowych (doc/03). Język źródłowy jest zawsze polski. */
export type LangCode =
  | "en-US"
  | "en-UK"
  | "de"
  | "fr"
  | "uk"
  | "ro"
  | "cs"
  | "hu"
  | "fi";

export type RiskLevel = "low" | "medium" | "high";
export type Severity = "info" | "warning" | "critical";
export type QualityNoteKind = "ok" | "info";

/** Tryb działania aplikacji — rozstrzygany po stronie serwera. */
export type AppMode = "demo" | "api";

/* ------------------------------------------------------------------ */
/* Profile treści                                                      */
/* ------------------------------------------------------------------ */

export type ProfileTone =
  | "neutral"
  | "professional"
  | "warm"
  | "persuasive"
  | "expert"
  | "formal"
  | "concise"
  | "user-defined";

/** Oś sterująca 1–5 (kreatywność / ścisłość). */
export type Intensity = 1 | 2 | 3 | 4 | 5;

/** Grupa profilu — używana do wizualnego grupowania w dropdownie „Typ treści". */
export type ProfileGroup =
  | "Produktowe"
  | "SEO"
  | "Treści"
  | "Marketing"
  | "UI / System"
  | "Informacyjne"
  | "Prawne"
  | "Uniwersalne";

export interface TranslationProfile {
  id: ProfileId;
  /** Etykieta PL w UI, np. „Opis produktu — długi". */
  displayName: string;
  /** Techniczny badge, np. „PRODUCT_LONG". */
  badge: string;
  /** Grupa do dropdownu „Typ treści". */
  group: ProfileGroup;
  /** Krótka podpowiedź PL pod etykietą w dropdownie. */
  hint: string;
  /** Konkretne przykłady zastosowań (PL). */
  useCases: string[];
  /** Jedno zdanie PL — po co tłumaczymy ten typ treści. */
  goal: string;
  tone: ProfileTone;
  /** 1 = dosłownie, 5 = transkreacja. */
  creativity: Intensity;
  /** 1 = elastycznie, 5 = niczego nie ruszamy. */
  strictness: Intensity;
  /** Wytyczna długości outputu względem źródła (PL). */
  lengthGuidance: string;
  /** StrategyCard „Optymalizujemy" — cel tłumaczenia (PL). */
  optimizeFor: string;
  /** StrategyCard „Chronimy" — co musi zostać 1:1 (PL). */
  protect: string[];
  /** Czego unikać przy tłumaczeniu (PL). */
  avoid: string[];
  /** Co weryfikujemy w outputie (PL). */
  qualityChecks: string[];
  /** Instrukcja profilowa wstrzykiwana do prompta (EN). */
  systemInstruction: string;
  /** true wyłącznie dla `custom_prompt` — wymaga instrukcji użytkownika. */
  customInstructionsRequired: boolean;
  /** true dla `legal` — zawsze sugeruje przegląd człowieka. */
  alwaysSuggestHumanReview: boolean;
}

/* ------------------------------------------------------------------ */
/* Reguły językowe                                                     */
/* ------------------------------------------------------------------ */

export interface LanguageRule {
  code: LangCode;
  /** Krótka etykieta, np. „EN-US". */
  short: string;
  /** Pełna nazwa, np. „English (US)". */
  displayName: string;
  /** Emoji flagi. */
  flag: string;
  /** Krótki kontekst rynku (PL). */
  marketNotes: string;
  /** Preferowany rejestr / ton rynku (PL). */
  toneGuidance: string;
  /** Konwencje e-commerce: cart vs basket itd. (PL). */
  ecommerceNotes: string;
  /** Typowe pułapki tłumaczeniowe (PL). */
  commonRisks: string[];
  /** Konkretne kalki z polskiego do unikania (PL). */
  polishCalqueWarnings: string[];
  /** Twarde, obowiązkowe ostrzeżenie dla LLM (CS, UK, RO, HU) — w języku angielskim. */
  criticalWarning?: string;
  /** Rozróżnienia ortograficzne / leksykalne (np. EN-US vs EN-UK). */
  specialDistinction?: string;
}

/* ------------------------------------------------------------------ */
/* Glosariusz                                                          */
/* ------------------------------------------------------------------ */

export type GlossaryCategory =
  | "protected"
  | "brand"
  | "model"
  | "spec"
  | "product_term"
  | "ui_term"
  | "seo_term"
  | "legal_term"
  | "user";

export type GlossaryPolicy = "preserve" | "translate" | "transliterate" | "context";

/** Wpis glosariusza — definicja w `baseline.json` lub wpis użytkownika. */
export interface GlossaryEntry {
  source: string;
  category: GlossaryCategory;
  policy: GlossaryPolicy;
  /** Tłumaczenia per język — używane przez wpisy baseline (`policy: "translate"`). */
  translations?: Partial<Record<LangCode, string>>;
  /** Pojedyncze tłumaczenie niezależne od języka — używane przez wpisy użytkownika. */
  target?: string;
  notes?: string;
}

/** Wynik dopasowania glosariusza do tekstu źródłowego (`lib/glossary/injectGlossary`). */
export interface GlossaryInjection {
  /** Gotowa sekcja tekstu do wstrzyknięcia do prompta. */
  promptSection: string;
  /** Wpisy glosariusza wykryte w tekście źródłowym (baseline + użytkownik). */
  matched: GlossaryAppliedEntry[];
}

/* ------------------------------------------------------------------ */
/* Próbki demo                                                         */
/* ------------------------------------------------------------------ */

export interface Sample {
  id: string;
  /** Etykieta PL w dropdownie „Wczytaj przykład". */
  label: string;
  /** Krótki opis typu treści (PL). */
  description: string;
  /** Profil ustawiany automatycznie po wczytaniu próbki. */
  profile: ProfileId;
  /** Polski tekst źródłowy. */
  source: string;
}

/* ------------------------------------------------------------------ */
/* Kontrakt API / UI                                                   */
/* ------------------------------------------------------------------ */

/** Żądanie tłumaczenia wysyłane do `POST /api/translate`. */
export interface TranslateRequest {
  profile: ProfileId;
  lang: LangCode;
  source: string;
  /** Surowy glosariusz użytkownika, format „źródło => tłumaczenie" / linia. */
  glossary?: string;
  /** Instrukcja systemowa — wymagana, gdy `profile === "custom_prompt"`. */
  instructions?: string;
}

export interface QualityNote {
  kind: QualityNoteKind;
  text: string;
}

export interface PreservedTerm {
  term: string;
  /** Kategoria PL, np. „Marka", „Model", „Jednostka", „Standard". */
  category: string;
  /** Krótkie uzasadnienie PL. */
  reason: string;
}

export interface Warning {
  severity: Severity;
  title: string;
  body: string;
  /**
   * Wewnętrzny kod ostrzeżenia (np. „MISSING_NUMBER") — używany przez
   * deterministyczne przeliczanie ryzyka. Opcjonalny, nie wymagany przez UI.
   */
  code?: string;
}

/** Pojedyncze trafienie glosariusza w odpowiedzi (doc/13). */
export interface GlossaryAppliedEntry {
  source: string;
  appliedAs: string;
}

export interface TranslationMeta {
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  durationMs?: number;
}

/**
 * Kanoniczny kontrakt odpowiedzi (doc/13). UI renderuje każde pole
 * w dedykowanej sekcji prawej kolumny.
 */
export interface TranslationResult {
  profileUsed: ProfileId;
  targetLang: LangCode;
  /** Gotowy, kompletny tekst tłumaczenia. */
  translation: string;
  riskLevel: RiskLevel;
  suggestedHumanReview: boolean;
  qualityNotes: QualityNote[];
  preservedTerms: PreservedTerm[];
  warnings: Warning[];
  /** 1–3 zdania PL — dlaczego taki styl. */
  styleRationale: string;
  glossaryApplied: GlossaryAppliedEntry[];
  meta?: TranslationMeta;
}

/** Błąd tłumaczenia — używany w trybie API (doc/13). */
export interface TranslateError {
  kind: "api" | "rate" | "network" | "unknown";
  /** Komunikat wewnętrzny do logów. */
  message: string;
  requestId?: string;
}
