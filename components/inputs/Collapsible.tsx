"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface CollapsibleProps {
  title: ReactNode;
  defaultOpen?: boolean;
  /** Wymusza otwartą i niezamykalną sekcję (np. dla profilu custom_prompt). */
  forceOpen?: boolean;
  required?: boolean;
  children: ReactNode;
}

/** Zwijana sekcja — glosariusz, dodatkowe wskazówki, instrukcja własna. */
export function Collapsible({
  title,
  defaultOpen = false,
  forceOpen = false,
  required = false,
  children,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = forceOpen || open;

  return (
    <div className="rounded-lg border border-border-soft bg-surface">
      <button
        type="button"
        onClick={() => {
          if (!forceOpen) setOpen((v) => !v);
        }}
        aria-expanded={isOpen}
        disabled={forceOpen}
        className={clsx(
          "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-800",
          !forceOpen && "transition hover:bg-surface-2",
        )}
      >
        <span className="flex items-center gap-2">
          <span className="font-medium">{title}</span>
          {required ? (
            <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              wymagane
            </span>
          ) : (
            !forceOpen && <span className="text-xs text-ink-500">opcjonalnie</span>
          )}
        </span>
        {!forceOpen && (
          <ChevronDown
            className={clsx("h-4 w-4 text-ink-500 transition", isOpen && "rotate-180")}
            aria-hidden
          />
        )}
      </button>
      {isOpen && <div className="border-t border-border-soft px-3 py-3">{children}</div>}
    </div>
  );
}
