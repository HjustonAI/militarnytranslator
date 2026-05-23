import { Languages } from "lucide-react";
import { CopyButton } from "../primitives/CopyButton";
import { getLanguage } from "@/lib/languages";
import type { LangCode } from "@/lib/types";

interface Props {
  text: string;
  lang: LangCode;
}

/** Centralny box tłumaczenia z licznikami i przyciskiem kopiowania. */
export function TranslationOutput({ text, lang }: Props) {
  const language = getLanguage(lang);
  const charCount = text.length;
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-border-soft px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-ink-500" aria-hidden />
          <span className="text-sm font-medium text-ink-900">Tłumaczenie</span>
          <span aria-hidden className="text-base leading-none">{language.flag}</span>
          <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-ink-600">
            {language.short}
          </code>
        </div>
        <CopyButton text={text} />
      </div>
      <div className="whitespace-pre-wrap px-5 py-4 text-[15.5px] leading-relaxed text-ink-900">
        {text}
      </div>
      <div className="border-t border-border-soft bg-surface-2 px-4 py-2 font-mono text-[11px] tabular-nums text-ink-500">
        {charCount.toLocaleString("pl-PL")} znaków · ~{wordCount.toLocaleString("pl-PL")} słów ·
        <kbd className="ml-1 text-[10px]">⌘⇧C</kbd> aby skopiować
      </div>
    </div>
  );
}
