import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { GlossaryAppliedTable } from "../outputs/GlossaryAppliedTable";
import { HumanReviewBanner } from "../outputs/HumanReviewBanner";
import { RiskChip } from "../outputs/RiskChip";
import { TranslationOutput } from "../outputs/TranslationOutput";
import { WarningCard } from "../outputs/WarningCard";
import type { TranslationResult } from "@/lib/types";

interface Props {
  result: TranslationResult;
}

/** Stan sukcesu — wszystkie sekcje wyniku (doc/13 §07). */
export function SuccessState({ result }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RiskChip level={result.riskLevel} />
        {result.meta?.durationMs !== undefined && (
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
            {result.meta.model ?? "model"} · {(result.meta.durationMs / 1000).toFixed(1)} s
          </div>
        )}
      </div>

      {result.suggestedHumanReview && <HumanReviewBanner />}

      <TranslationOutput text={result.translation} lang={result.targetLang} />

      {result.qualityNotes.length > 0 && (
        <Card title={`Notatki jakościowe (${result.qualityNotes.length})`}>
          <ul className="space-y-1.5">
            {result.qualityNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-800">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden />
                <span>{note.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {result.preservedTerms.length > 0 && (
        <Card title={`Zachowane terminy (${result.preservedTerms.length})`}>
          <ul className="flex flex-wrap gap-1.5">
            {result.preservedTerms.map((term, i) => (
              <li
                key={`${term.term}-${i}`}
                title={`${term.category}${term.reason ? ` — ${term.reason}` : ""}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface px-2.5 py-0.5 text-xs text-ink-800"
              >
                <span className="font-mono text-[11px]">{term.term}</span>
                <span className="text-[10px] uppercase tracking-wide text-ink-500">
                  {term.category}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {result.warnings.length > 0 && (
        <Card title={`Ostrzeżenia (${result.warnings.length})`}>
          <ul className="space-y-2">
            {result.warnings.map((warning, i) => (
              <li key={i}>
                <WarningCard warning={warning} />
              </li>
            ))}
          </ul>
        </Card>
      )}

      {result.styleRationale && (
        <Card title="Dlaczego taki styl">
          <p className="text-sm italic leading-relaxed text-ink-700">{result.styleRationale}</p>
        </Card>
      )}

      <GlossaryAppliedTable entries={result.glossaryApplied} />
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border-soft bg-surface p-4">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
        {title}
      </div>
      {children}
    </div>
  );
}
