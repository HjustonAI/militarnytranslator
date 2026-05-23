/** Stan pusty — przed pierwszym tłumaczeniem (doc/13 §05). */
export function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-8 text-center">
      <h3 className="text-base font-semibold text-ink-900">Czekam na tekst</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
        Wybierz <strong className="font-medium text-ink-800">typ treści</strong> i{" "}
        <strong className="font-medium text-ink-800">język</strong>, wklej źródło po polsku,
        a następnie kliknij <span className="font-medium text-accent">Tłumacz</span>.
        Tłumaczenie pojawi się w tym miejscu razem z notatkami jakościowymi
        i listą zachowanych terminów.
      </p>
      <ol className="mx-auto mt-5 grid max-w-md gap-1.5 text-left text-xs text-ink-600">
        <Step n="01" text="Wybierz profil tłumaczeniowy" />
        <Step n="02" text="Wybierz język docelowy" />
        <Step n="03" text="Wklej tekst i kliknij Tłumacz" />
      </ol>
    </div>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <li className="flex items-baseline gap-3">
      <code className="font-mono text-[10px] font-semibold text-accent">{n}</code>
      <span>{text}</span>
    </li>
  );
}
