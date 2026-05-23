import { Loader2 } from "lucide-react";

interface Props {
  profileLabel: string;
  langLabel: string;
}

/** Stan ładowania — spinner + skeleton (doc/13 §06). */
export function LoadingState({ profileLabel, langLabel }: Props) {
  return (
    <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden />
        <div>
          <div className="text-sm font-semibold text-ink-900">Tłumaczę…</div>
          <div className="text-xs text-ink-600">
            Profil <span className="font-medium text-ink-800">{profileLabel}</span> · cel{" "}
            <span className="font-medium text-ink-800">{langLabel}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2" aria-hidden>
        <Skeleton width="95%" />
        <Skeleton width="80%" />
        <Skeleton width="88%" />
        <Skeleton width="60%" />
      </div>
    </div>
  );
}

function Skeleton({ width }: { width: string }) {
  return <div className="h-3 animate-pulse rounded bg-stone-100" style={{ width }} />;
}
