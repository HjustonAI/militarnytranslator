import type { ReactNode } from "react";
import { getLanguage } from "@/lib/languages";
import { getProfile } from "@/lib/profiles";
import type { LangCode, ProfileId } from "@/lib/types";

interface Props {
  profileId: ProfileId;
  lang: LangCode;
}

/** Trwała karta strategii — Profil, Język, Optymalizujemy, Chronimy (doc/13 §07). */
export function StrategyCard({ profileId, lang }: Props) {
  const profile = getProfile(profileId);
  const language = getLanguage(lang);

  return (
    <div className="rounded-lg border border-border-soft bg-surface p-4 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-accent">
        Zastosowana strategia
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Cell label="Profil">
          <div className="text-ink-900">{profile.displayName}</div>
          <code className="mt-1 inline-block rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-ink-600">
            {profile.badge}
          </code>
        </Cell>
        <Cell label="Język docelowy">
          <div className="flex items-center gap-2 text-ink-900">
            <span aria-hidden className="text-base leading-none">{language.flag}</span>
            <span>{language.displayName}</span>
            <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-ink-600">
              {language.short}
            </code>
          </div>
        </Cell>
        <Cell label="Optymalizujemy">
          <p className="text-ink-800">{profile.optimizeFor}</p>
        </Cell>
        <Cell label="Chronimy">
          <ul className="list-disc space-y-0.5 pl-4 text-ink-800 marker:text-ink-400">
            {profile.protect.slice(0, 3).map((item, i) => (
              <li key={i} className="leading-snug">{item}</li>
            ))}
          </ul>
        </Cell>
      </div>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}
