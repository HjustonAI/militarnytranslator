import { AlertCircle } from "lucide-react";
import { Button } from "../primitives/Button";
import type { TranslateError } from "@/lib/types";

interface Props {
  error: TranslateError;
  onRetry: () => void;
}

const TITLES: Record<TranslateError["kind"], string> = {
  api: "Wystąpił błąd",
  rate: "Limit zapytań przekroczony",
  network: "Brak połączenia z modelem",
  unknown: "Wystąpił nieoczekiwany błąd",
};

/** Stan błędu — kontrolowane komunikaty zwracane przez `/api/translate` (doc/13 §08). */
export function ErrorState({ error, onRetry }: Props) {
  const title = TITLES[error.kind] ?? TITLES.unknown;

  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-rose-900">{title}</div>
          <div className="mt-1 text-sm text-rose-800">{error.message}</div>
          {error.requestId && (
            <code className="mt-2 inline-block rounded bg-white/60 px-1.5 py-0.5 font-mono text-[10px] text-rose-700">
              ID: {error.requestId}
            </code>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Button variant="primary" size="sm" onClick={onRetry}>
          Spróbuj ponownie
        </Button>
      </div>
    </div>
  );
}
