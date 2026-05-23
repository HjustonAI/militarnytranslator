# Militaria Translation Studio

## Co to jest

Lokalny prototyp narzędzia AI do **kontekstowego tłumaczenia treści e-commerce**
z polskiego na 9 języków europejskich: EN-US, EN-UK, DE, FR, UK, RO, CS, HU, FI.
Zbudowany jako odpowiedź na zadanie rekrutacyjne na stanowisko AI Automation
Specialist w Militaria.pl.

Jednoekranowy workbench dla nietechnicznego pracownika działu e-commerce / contentu /
SEO. Operator wybiera typ treści i język docelowy, wkleja polski tekst, opcjonalnie
dodaje glosariusz lub własną instrukcję, a w wyniku dostaje gotowe tłumaczenie razem
z listą zachowanych terminów, notatkami jakościowymi, ostrzeżeniami, oceną ryzyka
i sugestią przeglądu człowieka.

Główna teza: **tłumaczenie w dużym e-commerce powinno być sterowanym procesem,
a nie pojedynczym wywołaniem AI** — inaczej tłumaczy się opis produktu, inaczej
regulamin, a inaczej SMS marketingowy.

## Jak uruchomić

Wymagania: Node 20+ i npm.

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod [http://localhost:3000](http://localhost:3000)
i działa **bez żadnej konfiguracji** — domyślnie startuje w trybie demo.

## Tryb demo i tryb API

Tryb wybierany jest po stronie serwera na podstawie zmiennych środowiskowych:

| Konfiguracja                                       | Tryb     |
| -------------------------------------------------- | -------- |
| brak `ANTHROPIC_API_KEY` lub `MOCK_MODE=1`         | **demo** |
| `ANTHROPIC_API_KEY` ustawiony i `MOCK_MODE` ≠ `1`  | **api**  |

W **trybie demo** aplikacja zwraca gotowe tłumaczenia dla znanych próbek
(np. Bergen → DE, kampania marketingowa → EN-UK) oraz bezpieczny podgląd
z podstawieniem glosariusza dla dowolnego innego wejścia — wraz z ostrzeżeniem
informującym, że to demo. Dzięki temu prototyp można ocenić od razu, bez własnego
klucza API.

W **trybie API** zapytania trafiają do modelu Anthropic (domyślnie Claude Sonnet).
Klucz konfiguruje się w `.env.local`:

```bash
cp .env.example .env.local
# uzupełnij ANTHROPIC_API_KEY=...
```

Aktualny tryb jest widoczny w nagłówku jako badge **Tryb: Demo** lub **Tryb: API**.

## Jak działa

1. Wybierz **typ treści** (11 profili: opis produktu, SEO, marketing, UI, prawne, …).
2. Wybierz **język docelowy** (9 języków).
3. Wklej **tekst źródłowy** po polsku.
4. Opcjonalnie dodaj **glosariusz** (`termin => tłumaczenie` na linię) lub **własną instrukcję**.
5. Kliknij **Tłumacz** (skrót `Ctrl/Cmd + Enter`).
6. Po prawej zobaczysz tłumaczenie wraz z listą zachowanych terminów, notatkami
   jakościowymi, ostrzeżeniami, oceną ryzyka i — jeśli to potrzebne — banerem
   zalecanego przeglądu człowieka. Wynik kopiujesz jednym kliknięciem
   (`Ctrl/Cmd + Shift + C`).

## Kluczowe decyzje

1. **Content Translation Profiles.** Rdzeń produktu — 11 profili (`product_long`,
   `product_short`, `seo`, `guide`, `marketing`, `ui_system`, `informational`,
   `legal`, `infographic`, `universal`, `custom_prompt`). Każdy ma własny ton,
   ścisłość, kreatywność, listę chronionych terminów i instrukcję systemową —
   inaczej tłumaczy się kartę produktu, inaczej regulamin, a inaczej SMS.
2. **Universal Safety Floor.** Niezależnie od profilu i instrukcji użytkownika
   model musi zachować 1:1 liczby, jednostki, kalibry, marki, modele, SKU/EAN/GTIN,
   placeholdery (`{var}`, `%s`, `{{name}}`), tagi HTML/Markdown, URL-e i numery
   telefonu. Nigdy nie zmyśla cech ani obietnic, których nie ma w źródle.
3. **Glosariusz branżowy.** Baseline (~135 wpisów: marki, modele, standardy
   MOLLE / MIL-STD / IP / NIJ, terminy outdoor/militaria, UI, SEO, prawne) jest
   wstrzykiwany do promptu tylko dla terminów obecnych w źródle. Operator może
   dodać własne wpisy per zgłoszenie; mają one priorytet nad baseline'em.
4. **Strukturalny wynik JSON.** Model zwraca obiekt walidowany schematem Zod:
   `translation`, `qualityNotes`, `preservedTerms`, `warnings`, `styleRationale`,
   `glossaryApplied`, `riskLevel`, `suggestedHumanReview`. Po stronie serwera
   uruchamiają się deterministyczne walidacje (diff liczb, placeholderów,
   chronionych terminów) — dopisują ostrzeżenia, których model mógł nie zgłosić.
5. **Human-in-the-loop.** Profil prawny zawsze sugeruje przegląd człowieka.
   Każde ostrzeżenie krytyczne (utracony placeholder, fałszywy przyjaciel PL ↔ CS,
   brakująca jednostka) podnosi poziom ryzyka i wymusza baner przeglądu.

## Zakres MVP

- jednoekranowy workbench (dwie kolumny, polski UI),
- 11 profili treści, 9 języków docelowych,
- tryb demo (bez klucza API) oraz tryb API (Anthropic),
- glosariusz baseline + glosariusz operatora,
- 10 gotowych próbek („Wczytaj przykład") z 5 ręcznie przygotowanymi pełnymi tłumaczeniami demo,
- walidacja Zod + deterministyczne walidacje liczb, placeholderów i chronionych terminów,
- kontrolowane stany: pusty / ładowanie / sukces / błąd,
- skróty klawiszowe `Ctrl/Cmd + Enter` (tłumacz) i `Ctrl/Cmd + Shift + C` (kopiuj wynik).

## Poza zakresem

Świadomie nie zostały zaimplementowane (zgodnie z briefem zadania rekrutacyjnego):

- integracja z systemami Militaria.pl, PIM-em, CMS-em ani sklepem,
- baza danych, autoryzacja użytkowników, deployment,
- przetwarzanie wsadowe (CSV / XLSX, kolejka tłumaczeń),
- historia tłumaczeń i wersjonowanie,
- panel administracyjny glosariusza (CRUD),
- workflow akceptacji oraz dashboardy analityczne.

To prototyp pokazujący sposób myślenia o procesie lokalizacji, nie produkcyjna aplikacja.

## Możliwe rozwinięcie produkcyjne

- import / eksport CSV i XLSX oraz kolejka tłumaczeń wsadowych (np. 1 000 opisów / nocą),
- integracja z PIM-em, Sylius / Shopify / Magento przez webhook,
- centralny glosariusz z CRUD-em per dział (outdoor / taktyka / odzież),
- workflow akceptacji przez content managera (review queue),
- raporty kosztu, czasu i jakości tłumaczeń per rynek, profil i zespół.

Wdrożenie produkcyjne należy traktować jako **element procesu lokalizacji
wspierający ekspansję zagraniczną**, a nie jako „translator AI".

## Stack

Next.js 15 (App Router), TypeScript strict, Tailwind CSS 3.4, Zod,
`@anthropic-ai/sdk`, `lucide-react`. Pojedynczy endpoint `/api/translate`,
bez backendu i bazy danych. Skrypty npm: `dev`, `build`, `start`, `lint`, `typecheck`.
