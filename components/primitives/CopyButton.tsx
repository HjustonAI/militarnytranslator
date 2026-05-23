"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

/** Kopiuje wyłącznie wartość `text` — nie metadane wyniku (doc/13). */
export function CopyButton({ text, className, label = "Kopiuj" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* schowek niedostępny — bezgłośne pominięcie */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:border-ink-400 hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        className,
      )}
      aria-live="polite"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
      <span>{copied ? "Skopiowano" : label}</span>
    </button>
  );
}
