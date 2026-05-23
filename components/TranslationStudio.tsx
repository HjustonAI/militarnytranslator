"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { CircleAlert, Sparkles } from "lucide-react";
import { ProductHeader } from "./ProductHeader";
import { Collapsible } from "./inputs/Collapsible";
import { ContentTypeDropdown } from "./inputs/ContentTypeDropdown";
import { LanguageDropdown } from "./inputs/LanguageDropdown";
import { ProfileSummary } from "./inputs/ProfileSummary";
import { SamplePicker } from "./inputs/SamplePicker";
import { SourceTextarea } from "./inputs/SourceTextarea";
import { Button } from "./primitives/Button";
import { StrategyCard } from "./outputs/StrategyCard";
import { EmptyState } from "./states/EmptyState";
import { ErrorState } from "./states/ErrorState";
import { LoadingState } from "./states/LoadingState";
import { SuccessState } from "./states/SuccessState";
import { DEFAULT_LANG, getLanguage } from "@/lib/languages";
import { DEFAULT_PROFILE, getProfile } from "@/lib/profiles";
import type {
  AppMode,
  LangCode,
  ProfileId,
  Sample,
  TranslateError,
  TranslationResult,
} from "@/lib/types";

/**
 * Sugerowany język po wczytaniu próbki — celuje w gotowe demo-fixture Fazy 3.1.
 * Pozostałe próbki zachowują aktualnie wybrany język użytkownika.
 */
const PREFERRED_LANG: Partial<Record<string, LangCode>> = {
  "product-long-bergen": "de",
  "marketing-bergen-campaign": "en-UK",
  "ui-system-strings": "de",
  "legal-returns-clause": "en-UK",
};

interface Props {
  initialMode: AppMode;
}

/** Główny komponent workbencha — zarządza stanem i orkiestracją wywołań API. */
export function TranslationStudio({ initialMode }: Props) {
  const [profileId, setProfileId] = useState<ProfileId>(DEFAULT_PROFILE);
  const [lang, setLang] = useState<LangCode>(DEFAULT_LANG);
  const [source, setSource] = useState("");
  const [glossary, setGlossary] = useState("");
  const [instructions, setInstructions] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<TranslateError | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const profile = useMemo(() => getProfile(profileId), [profileId]);
  const language = useMemo(() => getLanguage(lang), [lang]);
  const isCustom = profile.customInstructionsRequired;

  const handleTranslate = useCallback(async (): Promise<void> => {
    setValidationError(null);
    if (source.trim().length === 0) {
      setValidationError("Wklej najpierw tekst po polsku, który chcesz przetłumaczyć.");
      return;
    }
    if (isCustom && instructions.trim().length === 0) {
      setValidationError(
        "Profil własnej instrukcji wymaga wpisania instrukcji systemowej w sekcji poniżej.",
      );
      return;
    }
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profileId,
          lang,
          source,
          glossary: glossary.trim() || undefined,
          instructions: instructions.trim() || undefined,
        }),
      });
      if (!response.ok) {
        const body = (await response.json()) as TranslateError;
        setError(body);
      } else {
        const body = (await response.json()) as TranslationResult;
        setResult(body);
      }
    } catch {
      setError({
        kind: "network",
        message: "Coś poszło nie tak po stronie sieci. Spróbuj ponownie.",
      });
    } finally {
      setPending(false);
    }
  }, [profileId, lang, source, glossary, instructions, isCustom]);

  const handleLoadSample = useCallback((sample: Sample): void => {
    setProfileId(sample.profile);
    setSource(sample.source);
    const preferred = PREFERRED_LANG[sample.id];
    if (preferred) setLang(preferred);
    setResult(null);
    setError(null);
    setValidationError(null);
  }, []);

  // Skróty klawiszowe — Cmd/Ctrl+Enter (tłumacz), Cmd/Ctrl+Shift+C (kopiuj wynik).
  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      const cmd = event.metaKey || event.ctrlKey;
      if (!cmd) return;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void handleTranslate();
      } else if (event.shiftKey && (event.key === "C" || event.key === "c")) {
        event.preventDefault();
        if (result?.translation) void navigator.clipboard.writeText(result.translation);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleTranslate, result]);

  const view: "empty" | "loading" | "success" | "error" = pending
    ? "loading"
    : error
      ? "error"
      : result
        ? "success"
        : "empty";

  const canSubmit =
    source.trim().length > 0 && (!isCustom || instructions.trim().length > 0);

  const resultSubtitle =
    view === "empty"
      ? "Wprowadź tekst i kliknij Tłumacz"
      : view === "loading"
        ? "Generuję…"
        : view === "success"
          ? "Tłumaczenie gotowe"
          : "Wystąpił błąd";

  return (
    <div className="min-h-screen">
      <ProductHeader mode={initialMode} />
      <main className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[minmax(440px,1fr)_minmax(520px,1.15fr)]">
        {/* LEFT — INPUT */}
        <section className="border-b border-border-soft bg-surface px-6 py-7 lg:border-b-0 lg:border-r">
          <div className="mx-auto max-w-[680px] space-y-5">
            <SectionHeader title="Wejście" subtitle="3 obowiązkowe pola · 2 opcjonalne" />

            <Field label="Typ treści">
              <ContentTypeDropdown value={profileId} onChange={setProfileId} />
            </Field>

            <Field label="Język docelowy">
              <LanguageDropdown value={lang} onChange={setLang} />
            </Field>

            <ProfileSummary profileId={profileId} />

            <Field
              label={
                <>
                  Tekst źródłowy <span className="font-normal text-ink-500">(PL)</span>
                </>
              }
            >
              <SourceTextarea value={source} onChange={setSource} />
            </Field>

            <Collapsible title="Dodatkowy glosariusz">
              <p className="mb-2 text-xs leading-relaxed text-ink-600">
                Format: termin polski =&gt; tłumaczenie. Jeden wpis na linię.
              </p>
              <textarea
                value={glossary}
                onChange={(event) => setGlossary(event.target.value)}
                placeholder="np. plecak => Rucksack"
                rows={4}
                className="w-full resize-y rounded border border-border bg-surface px-3 py-2 font-mono text-[12.5px] text-ink-900 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              />
            </Collapsible>

            <Collapsible
              title={isCustom ? "Twoja instrukcja systemowa" : "Dodatkowe wskazówki"}
              required={isCustom}
              forceOpen={isCustom}
            >
              <textarea
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                placeholder={
                  isCustom
                    ? "Opisz, jak ma zachować się model — np. styl, ton, długość, ograniczenia."
                    : "Opcjonalne uzupełnienie profilu — tylko gdy czegoś brakuje."
                }
                rows={isCustom ? 5 : 3}
                className="w-full resize-y rounded border border-border bg-surface px-3 py-2 text-sm text-ink-900 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              />
            </Collapsible>

            {validationError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
              >
                <CircleAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="lg"
                onClick={() => void handleTranslate()}
                disabled={!canSubmit}
                loading={pending}
                icon={!pending && <Sparkles className="h-4 w-4" aria-hidden />}
                className="min-w-[160px] flex-1"
              >
                <span>{pending ? "Tłumaczę…" : "Tłumacz"}</span>
                <kbd className="ml-1 hidden text-[10px] opacity-70 lg:inline">⌘↵</kbd>
              </Button>
              <SamplePicker onLoad={handleLoadSample} />
            </div>
          </div>
        </section>

        {/* RIGHT — RESULT */}
        <section className="bg-surface-2 px-6 py-7">
          <div className="mx-auto max-w-[680px] space-y-4">
            <SectionHeader title="Wynik" subtitle={resultSubtitle} />

            <StrategyCard profileId={profileId} lang={lang} />

            {view === "empty" && <EmptyState />}
            {view === "loading" && (
              <LoadingState profileLabel={profile.displayName} langLabel={language.short} />
            )}
            {view === "error" && error && (
              <ErrorState error={error} onRetry={() => void handleTranslate()} />
            )}
            {view === "success" && result && <SuccessState result={result} />}
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">
        {title}
      </div>
      <div className="text-xs text-ink-600">{subtitle}</div>
    </div>
  );
}

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-ink-700">{label}</div>
      {children}
    </div>
  );
}
