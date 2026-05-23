import clsx from "clsx";
import { getProfile } from "@/lib/profiles";
import type { ProfileId } from "@/lib/types";

interface Props {
  profileId: ProfileId;
}

/** Karta wybranego profilu — etykieta PL, badge, paski intensywności, hint. */
export function ProfileSummary({ profileId }: Props) {
  const profile = getProfile(profileId);

  return (
    <div className="rounded-lg border border-border-soft bg-surface p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink-900">{profile.displayName}</h3>
        <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-ink-600">
          {profile.badge}
        </code>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink-600">{profile.hint}</p>
      <div className="mt-3 space-y-1.5 text-xs">
        <Bar label="Kreatywność" value={profile.creativity} />
        <Bar label="Ścisłość" value={profile.strictness} />
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-ink-700">
        <span><span className="text-ink-500">Ton:</span> {profile.tone}</span>
        <span className="text-ink-400">·</span>
        <span className="text-ink-600">{profile.optimizeFor}</span>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-ink-500">{label}</span>
      <span className="flex flex-1 gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={clsx("h-1.5 flex-1 rounded-sm", i < value ? "bg-accent" : "bg-stone-100")}
          />
        ))}
      </span>
      <span className="font-mono tabular-nums text-ink-600">{value}/5</span>
    </div>
  );
}
