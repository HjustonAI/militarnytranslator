import { TranslationStudio } from "@/components/TranslationStudio";
import { resolveMode } from "@/lib/env";

/**
 * Tryb (demo/api) musi być rozstrzygany na żądanie, nie w buildzie —
 * inaczej `next build && next start` zamroziłby badge w nagłówku
 * na wartość z momentu kompilacji, niezależnie od późniejszych
 * zmian w `.env.local`.
 */
export const dynamic = "force-dynamic";

/**
 * Strona główna — server component, wyznacza tryb (demo/api) po stronie
 * serwera i przekazuje go do interaktywnego workbencha.
 */
export default function Page() {
  const mode = resolveMode();
  return <TranslationStudio initialMode={mode} />;
}
