import { TranslationStudio } from "@/components/TranslationStudio";
import { resolveMode } from "@/lib/env";

/**
 * Strona główna — server component, wyznacza tryb (demo/api) po stronie
 * serwera i przekazuje go do interaktywnego workbencha.
 */
export default function Page() {
  const mode = resolveMode();
  return <TranslationStudio initialMode={mode} />;
}
