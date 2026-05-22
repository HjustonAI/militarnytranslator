/**
 * Reguły językowe dla 9 rynków docelowych (doc/03).
 *
 * Zasada przewodnia: lepiej dać LLM-owi konkretne, ostrożne wskazówki
 * (czego unikać), niż udawać znajomość każdej subtelności rynku.
 * Sekcja `criticalWarning` jest obowiązkowa dla CS, UK, RO i HU (doc/07).
 */

import type { LangCode, LanguageRule } from "./types";

export const LANGUAGES: LanguageRule[] = [
  {
    code: "en-US",
    short: "EN-US",
    displayName: "English (US)",
    flag: "🇺🇸",
    marketNotes: `Bardzo konkurencyjny, dynamiczny e-commerce. Krótka, bezpośrednia komunikacja, akcent na korzyść dla klienta, a nie na samą cechę produktu.`,
    toneGuidance: `Konwersacyjny, ale profesjonalny. Mniej formalności niż DE/FR. Dozwolone skróty typu „you'll", „we've".`,
    ecommerceNotes: `cart (nie basket), shipping, checkout, add to cart, place order, ZIP code. Daty MM/DD/YYYY. Jednostek nie konwertujemy.`,
    commonRisks: [
      `Przesadny brytyjski rejestr.`,
      `Polskie „Państwa" tłumaczone jako „Sir/Madam" zamiast naturalnego „you".`,
      `Nadmierna formalność w mikrocopy UI.`,
    ],
    polishCalqueWarnings: [
      `„wysoka jakość" → „high-quality" / „premium" / „top-tier", nie „high quality" jako dwa osobne słowa.`,
      `„praktyczny" → częściej „handy" / „versatile" niż „practical".`,
      `„W naszym sklepie" w nagłówku — zwykle naturalniej bez podmiotu.`,
    ],
    specialDistinction: `Pisownia US: color, favorite, organize, gray. Leksyka: cart, ZIP code, flashlight, sneakers. Ton swobodniejszy niż EN-UK.`,
  },
  {
    code: "en-UK",
    short: "EN-UK",
    displayName: "English (UK)",
    flag: "🇬🇧",
    marketNotes: `Bardziej formalny niż EN-US, ale daleko mu do DE. Etykieta i grzeczność są zauważalne — „please", „thank you" jako standard w komunikacji klienckiej.`,
    toneGuidance: `Uprzejmie profesjonalny. Mniej idiomów, więcej powściągliwości. Ciepło bez nachalności typowej dla US.`,
    ecommerceNotes: `basket (nie cart), delivery (nie shipping), postcode (nie ZIP), trainers, torch (nie flashlight — istotne dla militariów). Daty DD/MM/YYYY, jednostki SI.`,
    commonRisks: [
      `Amerykanizmy: color, organize, cart, flashlight, sneakers.`,
      `Przesadnie sztywny rejestr w treściach marketingowych.`,
      `„cheap" zamiast „affordable" — w UK „cheap" brzmi pejoratywnie.`,
    ],
    polishCalqueWarnings: [
      `„nowoczesny" → w kontekście stylu często „contemporary", nie tylko „modern".`,
      `„sprzęt" → „equipment" lub „kit" (w outdoor/survival „kit" pasuje naturalnie).`,
    ],
    specialDistinction: `Pisownia UK: colour, favourite, organise, grey. Leksyka: basket, postcode, trainers, torch. Ton bardziej powściągliwy niż EN-US.`,
  },
  {
    code: "de",
    short: "DE",
    displayName: "Deutsch",
    flag: "🇩🇪",
    marketNotes: `Rynek wymagający pod kątem precyzji opisów i danych technicznych. Klient niemiecki czyta opis dokładnie.`,
    toneGuidance: `Formalny, rzeczowy. „Sie" jako standard w komunikacji handlowej; „Du" tylko w wyraźnie młodzieżowym marketingu.`,
    ecommerceNotes: `Warenkorb, Zur Kasse / Bestellung abschließen, Versand, Lieferung, Postleitzahl. Daty DD.MM.YYYY. Długie słowa złożone są naturalne — nie redukujemy ich sztucznie.`,
    commonRisks: [
      `Tłumaczenie „Państwa" jako „Eure" — błąd; standardem jest „Ihre".`,
      `Zbyt swobodny, anglosaski ton.`,
      `Tłumaczenie kalibrów, norm i certyfikatów, które w branży zostają w oryginale (np. „MIL-STD-810G").`,
    ],
    polishCalqueWarnings: [
      `„wysoka jakość" → „hochwertig", nie kalka „hohe Qualität".`,
      `„najlepsza cena" → ostrożnie z superlatywami (ograniczenia prawne); raczej „attraktiver Preis".`,
      `„polecamy" → „Wir empfehlen" tylko w prozie, nie w UI.`,
    ],
  },
  {
    code: "fr",
    short: "FR",
    displayName: "Français",
    flag: "🇫🇷",
    marketNotes: `Klient francuski docenia elegancję języka i precyzję. Niechętny anglicyzmom tam, gdzie istnieje francuski odpowiednik.`,
    toneGuidance: `Uprzejmie profesjonalny, „vous" jako standard. Mniej superlatywów niż EN-US.`,
    ecommerceNotes: `Panier, Passer commande / Valider la commande, Livraison, Code postal. Daty DD/MM/YYYY, przecinek dziesiętny (1,5 kg). Spacja przed : ? ! ; (w UI bywa rozluźniana).`,
    commonRisks: [
      `Pomijanie spacji niełamliwej przed interpunkcją podwójną.`,
      `Anglicyzmy tam, gdzie jest rodzimy odpowiednik (np. „shopping" zamiast „achats").`,
      `Zbyt sprzedażowy ton.`,
    ],
    polishCalqueWarnings: [
      `„sprawdź" jako CTA → „découvrez" / „voir" zależnie od kontekstu, nie „check".`,
      `„dla każdego" → „pour tous"; „pour chacun" brzmi nienaturalnie.`,
    ],
  },
  {
    code: "uk",
    short: "UK",
    displayName: "Українська",
    flag: "🇺🇦",
    marketNotes: `Rynek militaria/outdoor jest szczególnie wrażliwy (kontekst wojenny). Klient często ma doświadczenie wojskowe — szanujemy fachowość.`,
    toneGuidance: `Profesjonalny, rzeczowy, ciepły. Forma grzecznościowa „Ви". Powaga zamiast marketingowego entuzjazmu.`,
    ecommerceNotes: `Кошик, Оформити замовлення, Доставка, Поштовий індекс. Marki zostają w łacince (bez transliteracji).`,
    commonRisks: [
      `Wpadanie w rosyjską ortografię i leksykę.`,
      `Tłumaczenie terminów wojskowych ad hoc — branżowe terminy (MOLLE, IFAK, plate carrier) zostają po angielsku.`,
    ],
    polishCalqueWarnings: [
      `„profesjonalny sprzęt" → „професійне спорядження", nie „професійне обладнання".`,
      `„bezpieczeństwo" → „безпека", nie rosyjskie „безопасность".`,
    ],
    criticalWarning: `Translate into Ukrainian. Do NOT use Russian vocabulary, spelling or grammar, even if it looks similar. If unsure, prefer the Ukrainian form used in modern Ukrainian e-commerce.`,
  },
  {
    code: "ro",
    short: "RO",
    displayName: "Română",
    flag: "🇷🇴",
    marketNotes: `Dynamiczny, szybko rosnący e-commerce. Rejestr mieszany — formalny w treściach instytucjonalnych, swobodniejszy w marketingu.`,
    toneGuidance: `Uprzejmy, neutralny. „Dumneavoastră" w komunikacji handlowej; w UI zaimki bywają pomijane.`,
    ecommerceNotes: `Coș, Finalizează comanda, Livrare, Cod poștal. Daty DD.MM.YYYY, przecinek dziesiętny.`,
    commonRisks: [
      `Brak diakrytyków (np. „sa" zamiast „să").`,
      `Mieszanie cedilli (ş/ţ) z poprawnymi formami z przecinkiem (ș/ț).`,
      `Anglicyzmy zamiast słów rodzimych („shopping" → „cumpărături").`,
    ],
    polishCalqueWarnings: [
      `„polecamy" jako CTA → w UI raczej „descoperă" / „vezi" niż „recomandăm".`,
      `„dostawa już od" → „livrare începând cu", nie „livrare de la".`,
    ],
    criticalWarning: `Translate into Romanian using full diacritics: ă, â, î, ș, ț (comma below, NOT cedilla — never ş or ţ).`,
  },
  {
    code: "cs",
    short: "CS",
    displayName: "Čeština",
    flag: "🇨🇿",
    marketNotes: `Klient czeski jest wyczulony na poprawność językową i diakrytykę — szybko wychwytuje słabe tłumaczenie maszynowe.`,
    toneGuidance: `Profesjonalny, lekko ciepły, formalne „Vy" jako standard. W marketingu można rozluźnić, ale nie do poziomu US.`,
    ecommerceNotes: `Košík, Pokladna / Dokončit objednávku, Doprava, PSČ. Daty DD.MM.YYYY, przecinek dziesiętny.`,
    commonRisks: [
      `Brak diakrytyków.`,
      `Mylenie czeskiego ze słowackim.`,
      `Fałszywi przyjaciele PL↔CS — czeski wygląda podobnie, ale wiele słów znaczy co innego.`,
    ],
    polishCalqueWarnings: [
      `„sklep" → „obchod" / „e-shop", NIGDY „sklep" (po czesku = piwnica).`,
      `„szukać" → „hledat", NIGDY „šukat" (wulgaryzm).`,
      `„pewny" → „jistý", nie „pewný".`,
    ],
    criticalWarning: `Translate into Czech. Beware of Polish-Czech false friends. NEVER use "šukat" or any of its forms — it is profane in Czech. Polish "szukać" must become Czech "hledat". Polish "sklep" must become Czech "obchod" or "e-shop" (Czech "sklep" means "cellar").`,
  },
  {
    code: "hu",
    short: "HU",
    displayName: "Magyar",
    flag: "🇭🇺",
    marketNotes: `Język aglutynacyjny, strukturalnie bardzo różny od polskiego. Klient węgierski docenia naturalność, nie kalkę.`,
    toneGuidance: `Uprzejmy, profesjonalny. Forma grzecznościowa „Ön" w komunikacji handlowej; „Te" w marketingu młodzieżowym.`,
    ecommerceNotes: `Kosár, Pénztár / Megrendelés véglegesítése, Szállítás, Irányítószám. Daty YYYY.MM.DD., przecinek dziesiętny.`,
    commonRisks: [
      `Brak długich umlautów „ő" i „ű" (zastępowane przez „ö"/„ü").`,
      `Zachowywanie polskiej składni i szyku zdania.`,
      `Dosłowne tłumaczenie zaimków dzierżawczych — po węgiersku posesywność wyraża sufiks.`,
    ],
    polishCalqueWarnings: [
      `„twoje zamówienie" → „a rendelése" / „a rendelésed" (sufiks), nie osobne „twoje".`,
      `„w naszym sklepie znajdziesz" → naturalne „Üzletünkben megtalálja…".`,
    ],
    criticalWarning: `Translate into natural Hungarian. Use possessive suffixes instead of separate possessive pronouns. Preserve every long umlaut (ő, ű) — never substitute with ö or ü.`,
  },
  {
    code: "fi",
    short: "FI",
    displayName: "Suomi",
    flag: "🇫🇮",
    marketNotes: `Język aglutynacyjny, bardzo różny od polskiego. Klient fiński preferuje zwięzłość i konkret, mniej superlatywów.`,
    toneGuidance: `Rzeczowy, zwięzły, ciepły bez przesady — mniej słów znaczy lepiej. W militaria/outdoor domyślnie forma „te". Używaj fińskich sufiksów przypadków zamiast kalk polskich przyimków; nie wymyślaj nieistniejących złożeń.`,
    ecommerceNotes: `Ostoskori, Kassalle / Vahvista tilaus, Toimitus, Postinumero. Daty DD.MM.YYYY, przecinek dziesiętny.`,
    commonRisks: [
      `Dosłowne tłumaczenie polskich konstrukcji przyimkowych.`,
      `Zbyt długie zdania — fiński jest gęsty, krótkie zdania są naturalniejsze.`,
      `Nieuważne traktowanie podwójnych samogłosek (zmieniają przypadek, to nie literówka).`,
    ],
    polishCalqueWarnings: [
      `„w naszym sklepie" → „meiltä" / „kaupastamme", nie kalka.`,
      `„dla każdego" → „kaikille", nie „jokaiselle".`,
      `„sprawdź" → „Katso", nie kalka.`,
    ],
  },
];

const LANGUAGE_BY_CODE: Record<LangCode, LanguageRule> = Object.fromEntries(
  LANGUAGES.map((lang) => [lang.code, lang]),
) as Record<LangCode, LanguageRule>;

/** Wszystkie kody języków w kolejności prezentacji w UI. */
export const LANG_CODES: LangCode[] = LANGUAGES.map((lang) => lang.code);

/** Domyślny język docelowy (doc/05 — preset próbek). */
export const DEFAULT_LANG: LangCode = "en-US";

/** Zwraca regułę językową dla danego kodu. */
export function getLanguage(code: LangCode): LanguageRule {
  return LANGUAGE_BY_CODE[code];
}
