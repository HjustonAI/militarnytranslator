interface Props {
  value: string;
  onChange: (value: string) => void;
}

/** Pole tekstu źródłowego z licznikiem znaków. */
export function SourceTextarea({ value, onChange }: Props) {
  return (
    <div className="flex flex-col">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Wklej tekst po polsku — opis produktu, fragment regulaminu, treść maila, mikrocopy z przycisku."
        spellCheck
        rows={10}
        className="min-h-[240px] w-full resize-y rounded-lg border border-border bg-surface px-3.5 py-3 text-[15px] leading-relaxed text-ink-900 transition focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      />
      <div className="mt-1.5 flex justify-end text-[11px] text-ink-500">
        <span className="font-mono tabular-nums">
          {value.length.toLocaleString("pl-PL")} znaków
        </span>
      </div>
    </div>
  );
}
