/**
 * Adapter demonstracyjny (mock) — działa bez klucza API (doc/07 §11, doc/13 §09).
 *
 * Generuje deterministyczną, ustrukturyzowaną odpowiedź dla dowolnego wejścia.
 * Nie woła żadnego modelu. Strategia pola `translation`:
 *
 *  1. Znana próbka (lib/samples) + dostępny gotowy przekład -> realistyczne,
 *     wcześniej przygotowane tłumaczenie demonstracyjne (przekonujące demo).
 *  2. Pozostałe wejścia -> bezpieczny podgląd: tekst źródłowy z podstawionymi
 *     terminami glosariusza dla języka docelowego (transformacja oparta tylko
 *     na znanych parach termin->tłumaczenie; liczby, marki i placeholdery
 *     pozostają nietknięte).
 *
 * Charakter demonstracyjny zawsze sygnalizuje ostrzeżenie informacyjne
 * `DEMO_MODE` oraz `meta.model` = "mock" — bez etykiety „[MOCK]" w treści.
 */

import { BASELINE_GLOSSARY, injectGlossary, textContainsTerm } from "../glossary/injectGlossary";
import { parseUserGlossary } from "../glossary/parseUserGlossary";
import { SAMPLES } from "../samples";
import { extractNumbers } from "../validate/diffNumbers";
import type {
  GlossaryCategory,
  GlossaryEntry,
  LangCode,
  PreservedTerm,
  ProfileId,
  QualityNote,
  Sample,
  TranslationResult,
  Warning,
} from "../types";
import type { LlmAdapter, LlmCallInput, LlmCallOutput } from "./adapter";

const MIN_DELAY_MS = 800;
const MAX_DELAY_MS = 1600;
const MAX_PRESERVED_TERMS = 12;

const PRESERVED_CATEGORY_LABEL: Partial<Record<GlossaryCategory, string>> = {
  brand: "Marka",
  model: "Model",
  protected: "Standard",
  spec: "Parametr",
};

const STYLE_RATIONALE: Record<ProfileId, string> = {
  product_long:
    "Profil opisu produktu (długi): zachowano parametry techniczne i nazwy własne, ton sprzedażowy dopasowany do rynku docelowego.",
  product_short:
    "Profil opisu krótkiego: priorytetem jest precyzja i zachowanie struktury tabel oraz list, bez ozdobników stylistycznych.",
  seo: "Profil SEO: treść dopasowana do intencji wyszukiwania rynku docelowego, z zachowaniem zakresu kategorii.",
  guide:
    "Profil poradnika: ekspercki, edukacyjny ton z zachowaniem struktury sekcji i rekomendacji autora.",
  marketing:
    "Profil marketingowy: transkreacja nastawiona na efekt perswazyjny, z zachowaniem CTA, rabatów i kodów promocyjnych.",
  ui_system:
    "Profil UI: krótkie, jednoznaczne mikrocopy zgodne z konwencjami rynku, placeholdery nietknięte.",
  informational:
    "Profil informacyjny: neutralny, budujący zaufanie ton, bez języka sprzedażowego.",
  legal:
    "Profil prawny: tłumaczenie ostrożne i formalne, bez parafrazy zmieniającej sens; zalecany przegląd człowieka.",
  infographic:
    "Profil infografiki: krótkie, rytmiczne linie z zachowaniem liczby punktów i sensu.",
  universal:
    "Profil uniwersalny: solidne, naturalne tłumaczenie bez agresywnej lokalizacji.",
  custom_prompt:
    "Profil własnej instrukcji: zastosowano wytyczne użytkownika w granicach zasad bezpieczeństwa (safety floor).",
};

const PROFILE_NOTE: Record<ProfileId, string> = {
  product_long: "Zachowano liczby, jednostki i nazwy własne produktu.",
  product_short: "Zachowano strukturę tabel, listy i jednostki techniczne.",
  seo: "Sprawdź długość nazwy kategorii i meta description pod kątem limitów.",
  guide: "Zachowano hierarchię nagłówków i nazwy modeli.",
  marketing: "Zweryfikuj wezwania do działania (CTA), rabaty i kody promocyjne.",
  ui_system: "Placeholdery i znaczniki pozostawiono bez zmian.",
  informational: "Zachowano nazwy metod płatności, kurierów oraz dane kontaktowe.",
  legal: "Zachowano numerację paragrafów i ustępów.",
  infographic: "Zachowano liczbę punktów i ich kolejność.",
  universal: "Zachowano strukturę akapitów i nazwy własne.",
  custom_prompt: "Instrukcja użytkownika została uwzględniona w granicach safety floor.",
};

/**
 * Gotowe tłumaczenia demonstracyjne dla znanych próbek (klucz: id próbki).
 * Przekłady ręcznie przygotowane tak, by zachować wszystkie liczby, jednostki,
 * marki, modele, standardy i placeholdery z tekstu źródłowego.
 */
const DEMO_FIXTURES: Record<string, Partial<Record<LangCode, string>>> = {
  "product-long-bergen": {
    de: `Der Helikon-Tex Bergen Backpack 18L ist ein Rucksack, der von klassischen britischen Patrouillenrucksäcken inspiriert ist. Er eignet sich hervorragend als alltäglicher EDC-Rucksack, als Handgepäck auf Reisen oder als Tagesrucksack für kurze Touren. Das Hauptfach mit 18 Litern Volumen lässt sich über die gesamte Länge mit einem YKK-Reißverschluss öffnen, was den Zugriff auf den Inhalt erleichtert. Im Inneren befinden sich ein Fach für einen 13"-Laptop sowie ein Organizer mit Platz für kleines Zubehör.

Material: Cordura 500D in der Farbe MultiCam Black, ausgestattet mit MOLLE/PALS-Nylonbändern zur Befestigung zusätzlicher Module. Der Rucksack wiegt 950 g und ist mit Trinkblasen bis 2 L kompatibel (Trinksystemanschluss im Hauptfach).

Maße: 45 × 27 × 18 cm. Maximale Belastung: 12 kg. Der Rucksack verfügt über verstärkte, verstellbare Schultergurte, einen Brustgurt und einen Tragegriff. Die Konstruktion entspricht dem Standard MIL-STD-810G hinsichtlich der Witterungsbeständigkeit.

Für wen geeignet: Nutzer, die die Qualität von Helikon-Tex schätzen, sowie Kunden, die einen kompakten taktischen Rucksack für den täglichen Gebrauch oder als Handgepäck im Flugzeug suchen (kompatibel mit den meisten Vorgaben für Kabinengepäck).`,
    "en-US": `The Helikon-Tex Bergen Backpack 18L is a backpack inspired by classic British patrol pack designs. It's a great fit as an everyday EDC backpack, as carry-on luggage when traveling, or as a daypack for short trips. The 18-liter main compartment opens along its full length with a YKK zipper, making it easy to reach your gear. Inside, there's a sleeve for a 13" laptop and an organizer with room for small accessories.

Material: Cordura 500D in MultiCam Black, fitted with nylon MOLLE/PALS webbing for attaching extra modules. The backpack weighs 950 g and is compatible with hydration bladders up to 2 L (hydration port in the main compartment).

Dimensions: 45 × 27 × 18 cm. Maximum load: 12 kg. It features reinforced, adjustable shoulder straps, a sternum strap, and a carry handle. The construction meets the MIL-STD-810G standard for weather resistance.

Who it's for: users who value Helikon-Tex quality, and shoppers looking for a compact tactical backpack for everyday use or as airplane carry-on (compatible with most cabin baggage rules).`,
  },
  "marketing-bergen-campaign": {
    "en-UK": `Newsletter (subject + lead + CTA):

Subject: The new Helikon-Tex Bergen is here — claim -15% off your first order

Intro:
A British patrol-pack classic, reimagined. The Bergen 18L — with its MOLLE system and Cordura 500D fabric — has just joined our range. If you're after a dependable backpack for everyday carry, fieldwork or as carry-on luggage, the Bergen is the one we've been recommending most.

CTA: Discover the Bergen 18L

—

ADS (Facebook/Google) — 3 variants:

Variant 1 (90 characters):
Bergen 18L tactical backpack. Cordura 500D, MOLLE — proven in the field.

Variant 2 (90 characters):
Helikon-Tex Bergen 18L — the patrol classic is back. See the full specification.

Variant 3 (90 characters):
Cordura 500D. MOLLE. 950 g. The Bergen 18L at Militaria.pl — take a look.

—

SMS (max 160 characters):
Militaria.pl: the Helikon-Tex Bergen 18L is now available. Use code WELCOME15 for -15% off your first order. Valid until 31.05. See: militaria.pl/bergen`,
  },
  "ui-system-strings": {
    de: `Buttons (jeweils eine Zeile, Platzhalter nicht übersetzen):

- In den Warenkorb
- Jetzt kaufen
- {amount} zł bezahlen
- Weiter einkaufen
- Verfügbarkeit prüfen
- Anmelden
- Konto erstellen
- Größe wählen
- Mehr anzeigen

—

Meldungen:
- Ihre Bestellung #{orderId} ist eingegangen. Wir haben eine Bestätigung an {email} gesendet.
- Der Artikel ist in der gewählten Größe nicht verfügbar. Wir benachrichtigen Sie, sobald er wieder verfügbar ist.
- Die Zahlung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut oder wählen Sie eine andere Methode.
- Ihr Warenkorb läuft in {minutes} Min. ab.

—

Banner:
- Kostenloser Versand ab 299 zł
- -20% auf Zubehör an diesem Wochenende
- Neu: Helikon-Tex Kollektion Herbst 2026

—

Platzhalter im Formular:
- Postleitzahl eingeben
- E-Mail-Adresse
- Telefonnummer (optional)`,
  },
  "legal-returns-clause": {
    "en-UK": `§ 6. Returns and withdrawal from the contract

1. A Consumer who has concluded a distance contract has the right to withdraw from it within 30 days of the date of receipt of the goods, without giving any reason and without incurring costs, except for the costs specified in paragraph 3.

2. To exercise the right of withdrawal from the contract, the Consumer should inform the Seller of their decision by means of an unequivocal statement (e.g. a letter sent by post, by fax, or by electronic mail). The Consumer may use the model withdrawal form, but this is not obligatory.

3. The direct costs of returning the goods shall be borne by the Consumer. The Seller shall reimburse the Consumer for all payments received from them, including the costs of delivering the goods (with the exception of additional costs arising from the Consumer's choice of a delivery method other than the cheapest standard delivery method offered by the Seller).

4. The right of withdrawal from the contract does not apply in the cases specified in Article 38 of the Act of 30 May 2014 on Consumer Rights (Journal of Laws 2014, item 827).`,
  },
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Normalizuje tekst do porównania próbek (białe znaki, wielkość liter). */
function normalizeForMatch(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Znajduje znaną próbkę, której tekst źródłowy odpowiada żądaniu. */
function findSample(source: string): Sample | undefined {
  const key = normalizeForMatch(source);
  return SAMPLES.find((sample) => normalizeForMatch(sample.source) === key);
}

/**
 * Bezpieczny podgląd: podstawia znane terminy glosariusza (`policy: translate`)
 * na formy języka docelowego. Liczby, marki, modele i placeholdery pozostają
 * nietknięte, bo nie należą do par podstawienia.
 */
function localizePreview(
  source: string,
  lang: LangCode,
  userGlossary: GlossaryEntry[],
): string {
  const pairs: { from: string; to: string }[] = [];

  for (const entry of BASELINE_GLOSSARY) {
    if (entry.policy !== "translate") continue;
    const to = entry.translations?.[lang];
    if (to) pairs.push({ from: entry.source, to });
  }
  for (const entry of userGlossary) {
    if (entry.policy === "translate" && entry.target) {
      pairs.push({ from: entry.source, to: entry.target });
    }
  }
  // Dłuższe frazy najpierw, aby uniknąć podstawień częściowych.
  pairs.sort((a, b) => b.from.length - a.from.length);

  let text = source;
  for (const { from, to } of pairs) {
    const pattern = escapeRegex(from).replace(/\s+/g, "\\s+");
    try {
      text = text.replace(
        new RegExp(`(?<![\\p{L}\\p{N}])${pattern}(?![\\p{L}\\p{N}])`, "giu"),
        to,
      );
    } catch {
      /* środowisko bez wsparcia lookbehind — pomijamy to podstawienie */
    }
  }
  return text;
}

/** Zbiera chronione terminy i liczby obecne w tekście źródłowym. */
function buildPreservedTerms(source: string): PreservedTerm[] {
  const terms: PreservedTerm[] = [];
  const seen = new Set<string>();

  for (const entry of BASELINE_GLOSSARY) {
    const label = PRESERVED_CATEGORY_LABEL[entry.category];
    if (!label) continue;
    const key = entry.source.toLowerCase();
    if (seen.has(key) || !textContainsTerm(source, entry.source)) continue;
    seen.add(key);
    terms.push({ term: entry.source, category: label, reason: "Termin chroniony — zachowany 1:1." });
    if (terms.length >= MAX_PRESERVED_TERMS) return terms;
  }

  for (const number of extractNumbers(source)) {
    const key = number.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    terms.push({ term: number, category: "Liczba", reason: "Wartość liczbowa zachowana 1:1." });
    if (terms.length >= MAX_PRESERVED_TERMS) break;
  }

  return terms;
}

/** Buduje deterministyczny wynik demonstracyjny dla danego żądania. */
function buildMockResult(input: LlmCallInput): TranslationResult {
  const { request } = input;
  const userGlossary = parseUserGlossary(request.glossary);
  const injection = injectGlossary(request.source, request.lang, userGlossary);

  // Gotowy przekład tylko gdy próbka i profil się zgadzają.
  const sample = findSample(request.source);
  const fixture =
    sample && sample.profile === request.profile
      ? DEMO_FIXTURES[sample.id]?.[request.lang]
      : undefined;
  const isFixture = typeof fixture === "string";

  const translation = isFixture
    ? fixture
    : localizePreview(request.source, request.lang, userGlossary);

  const qualityNotes: QualityNote[] = [
    { kind: "ok", text: PROFILE_NOTE[request.profile] },
  ];
  if (injection.matched.length > 0) {
    qualityNotes.push({
      kind: "ok",
      text: `Dopasowano ${injection.matched.length} wpisów glosariusza branżowego.`,
    });
  }

  const warnings: Warning[] = [
    isFixture
      ? {
          severity: "info",
          code: "DEMO_MODE",
          title: "Tryb demonstracyjny",
          body: "Wyświetlono gotowe, przykładowe tłumaczenie tej próbki. Włącz tryb API, aby tłumaczyć dowolny własny tekst.",
        }
      : {
          severity: "info",
          code: "DEMO_MODE",
          title: "Tryb demonstracyjny",
          body: "To przybliżony podgląd, a nie pełne tłumaczenie. Włącz tryb API (klucz w pliku .env.local), aby uzyskać właściwe tłumaczenie.",
        },
  ];
  if (request.profile === "legal") {
    warnings.push({
      severity: "warning",
      code: "LEGAL_REVIEW",
      title: "Treść prawna",
      body: "Tłumaczenia prawne wymagają weryfikacji przez specjalistę przed publikacją.",
    });
  } else if (request.profile === "marketing") {
    warnings.push({
      severity: "warning",
      code: "TRANSCREATION_CHECK",
      title: "Transkreacja",
      body: "Sprawdź zgodność wezwań do działania, rabatów i kodów promocyjnych z oryginałem.",
    });
  }

  const styleRationale = isFixture
    ? STYLE_RATIONALE[request.profile]
    : `${STYLE_RATIONALE[request.profile]} Podgląd demonstracyjny — włącz tryb API, aby uzyskać pełne tłumaczenie.`;

  return {
    profileUsed: request.profile,
    targetLang: request.lang,
    translation,
    riskLevel: "low",
    suggestedHumanReview: false,
    qualityNotes,
    preservedTerms: buildPreservedTerms(request.source),
    warnings,
    styleRationale,
    glossaryApplied: injection.matched,
  };
}

export const mockAdapter: LlmAdapter = {
  id: "mock",

  async call(input: LlmCallInput): Promise<LlmCallOutput> {
    const delay = MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
    await sleep(delay);
    return { raw: JSON.stringify(buildMockResult(input)), model: "mock" };
  },
};
