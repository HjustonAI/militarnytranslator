import clsx from "clsx";
import type { AppMode } from "@/lib/types";

interface Props {
  mode: AppMode;
}

/** Sticky nagłówek aplikacji — tytuł, podtytuł i badge trybu (doc/13 §04). */
export function ProductHeader({ mode }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border-soft bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3.5">
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight text-ink-900">
            Militaria Translation Studio
          </h1>
          <p className="text-xs text-ink-500">
            Kontekstowe tłumaczenie treści e-commerce z kontrolą jakości
          </p>
        </div>
        <ModeBadge mode={mode} />
      </div>
    </header>
  );
}

function ModeBadge({ mode }: { mode: AppMode }) {
  const isDemo = mode === "demo";
  return (
    <span
      title={
        isDemo
          ? "Tryb demonstracyjny — odpowiedzi z lokalnych próbek (brak klucza API modelu)"
          : "Połączenie z modelem przez klucz API z pliku .env"
      }
      className={clsx(
        "inline-flex flex-shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
        isDemo
          ? "bg-amber-50 text-amber-800 ring-amber-200"
          : "bg-emerald-50 text-emerald-800 ring-emerald-200",
      )}
    >
      <span
        className={clsx("h-2 w-2 rounded-full", isDemo ? "bg-amber-500" : "bg-emerald-500")}
        aria-hidden
      />
      Tryb: {isDemo ? "Demo" : "API"}
    </span>
  );
}
