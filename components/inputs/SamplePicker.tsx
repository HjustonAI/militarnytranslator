"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { SAMPLES } from "@/lib/samples";
import type { Sample } from "@/lib/types";

interface Props {
  onLoad: (sample: Sample) => void;
}

/** „Wczytaj przykład" — przycisk z menu wszystkich próbek (lib/samples). */
export function SamplePicker({ onLoad }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center gap-2 rounded border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink-800 transition hover:border-ink-400 hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        <BookOpen className="h-4 w-4 text-ink-500" aria-hidden />
        <span>Wczytaj przykład</span>
        <ChevronDown
          className={clsx("h-4 w-4 text-ink-500 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-1 w-[340px] overflow-hidden rounded-lg border border-border bg-surface shadow-md"
        >
          <ul className="max-h-[420px] overflow-auto py-1">
            {SAMPLES.map((sample) => (
              <li key={sample.id}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onLoad(sample);
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left transition hover:bg-surface-2"
                >
                  <div className="text-sm font-medium text-ink-900">{sample.label}</div>
                  <div className="text-[11px] text-ink-500">{sample.description}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
