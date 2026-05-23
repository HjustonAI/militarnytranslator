"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface DropdownItem<T> {
  value: T;
  label: ReactNode;
  /** Etykieta grupy do której należy ten item (pogrupowane wyświetlanie). */
  groupLabel?: string;
  disabled?: boolean;
}

interface DropdownProps<T> {
  /** Etykieta pokazywana, gdy nic nie wybrano. */
  placeholder: string;
  value: T;
  items: DropdownItem<T>[];
  onChange: (value: T) => void;
  /** Niestandardowe renderowanie wybranego elementu na przycisku. */
  renderSelected?: (item: DropdownItem<T>) => ReactNode;
  /** Niestandardowe renderowanie elementu na liście. */
  renderItem?: (item: DropdownItem<T>) => ReactNode;
  ariaLabel?: string;
  panelMaxHeight?: number;
  className?: string;
}

/**
 * Generyczny dropdown z grupowaniem, zamykany kliknięciem poza komponentem
 * oraz klawiszem Esc. Bez wewnętrznej nawigacji klawiszami strzałek — dla
 * tej skali pracy wystarczająca dostępność (role + aria-selected).
 */
export function Dropdown<T extends string>({
  placeholder,
  value,
  items,
  onChange,
  renderSelected,
  renderItem,
  ariaLabel,
  panelMaxHeight = 360,
  className,
}: DropdownProps<T>) {
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

  const selected = items.find((item) => item.value === value);

  // Grupowanie z zachowaniem kolejności pierwszego wystąpienia.
  const groupOrder: (string | undefined)[] = [];
  const groups = new Map<string | undefined, DropdownItem<T>[]>();
  for (const item of items) {
    const key = item.groupLabel;
    if (!groups.has(key)) {
      groups.set(key, []);
      groupOrder.push(key);
    }
    groups.get(key)!.push(item);
  }

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex w-full items-center justify-between gap-2 rounded border border-border bg-surface px-3 py-2 text-left text-sm transition hover:border-ink-400 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        <span className="min-w-0 flex-1">
          {selected
            ? renderSelected
              ? renderSelected(selected)
              : selected.label
            : <span className="text-ink-500">{placeholder}</span>}
        </span>
        <ChevronDown
          className={clsx("h-4 w-4 flex-shrink-0 text-ink-500 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-auto rounded-lg border border-border bg-surface shadow-md"
          style={{ maxHeight: panelMaxHeight }}
        >
          {groupOrder.map((groupLabel) => (
            <div key={groupLabel ?? "_default"} className="py-1">
              {groupLabel && (
                <div className="px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
                  {groupLabel}
                </div>
              )}
              {groups.get(groupLabel)!.map((item) => (
                <button
                  key={String(item.value)}
                  type="button"
                  role="option"
                  aria-selected={item.value === value}
                  disabled={item.disabled}
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={clsx(
                    "block w-full px-3 py-2 text-left text-sm transition",
                    item.value === value
                      ? "bg-accent-soft text-accent"
                      : "text-ink-800 hover:bg-surface-2",
                    item.disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {renderItem ? renderItem(item) : item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
