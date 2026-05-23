"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { GlossaryAppliedEntry } from "@/lib/types";

/** Liczebnik dla wpisów glosariusza (jeden / kilka / wiele). */
function pluralEntries(count: number): string {
  if (count === 1) return "wpis";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "wpisy";
  return "wpisów";
}

interface Props {
  entries: GlossaryAppliedEntry[];
}

/** Zwijana tabela `źródło → zastosowano jako` (doc/13 §07). */
export function GlossaryAppliedTable({ entries }: Props) {
  const [open, setOpen] = useState(false);
  if (entries.length === 0) return null;

  return (
    <div className="rounded-lg border border-border-soft bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-sm transition hover:bg-surface-2"
      >
        <span>
          <span className="font-medium text-ink-800">Glosariusz:</span>{" "}
          <span className="text-ink-600">
            zastosowano {entries.length} {pluralEntries(entries.length)}
          </span>
        </span>
        <ChevronDown
          className={clsx("h-4 w-4 text-ink-500 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <div className="overflow-hidden border-t border-border-soft">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-2 text-ink-500">
                <th className="px-3.5 py-2 text-left text-[10px] font-medium uppercase tracking-wider">
                  Źródło
                </th>
                <th className="px-3.5 py-2 text-left text-[10px] font-medium uppercase tracking-wider">
                  Zastosowano jako
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={`${entry.source}-${i}`} className="border-t border-border-soft">
                  <td className="px-3.5 py-1.5 font-mono text-ink-700">{entry.source}</td>
                  <td className="px-3.5 py-1.5 text-ink-800">{entry.appliedAs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
