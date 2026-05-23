import { ShieldCheck } from "lucide-react";

/** Pełnoszerokościowy baner sugerujący przegląd człowieka (doc/13 §07). */
export function HumanReviewBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet-700" aria-hidden />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-violet-900">Zalecany przegląd człowieka</div>
        <div className="mt-0.5 text-xs text-violet-800">
          Treść wymaga sprawdzenia przed publikacją — profil oznaczył ją jako wrażliwą.
        </div>
      </div>
    </div>
  );
}
