/**
 * Realistyczne polskie próbki wejściowe (doc/05).
 *
 * Zasilają dropdown „Wczytaj przykład" — po wybraniu próbki UI ustawia
 * tekst źródłowy oraz sugerowany profil. Ułatwia to demo bez wymyślania
 * własnego tekstu. Próbki pokrywają 10 typów treści (bez `custom_prompt`,
 * który nie ma stałej formy contentu).
 */

import type { Sample } from "../types";

export const SAMPLES: Sample[] = [
  {
    id: "product-long-bergen",
    label: "Plecak Bergen — opis produktu",
    description: "Długi opis produktu",
    profile: "product_long",
    source: `Helikon-Tex Bergen Backpack 18L to plecak inspirowany klasycznymi konstrukcjami brytyjskich plecaków patrolowych. Idealnie sprawdzi się jako codzienny plecak typu EDC, bagaż podręczny w podróży lub plecak na krótką wyprawę. Główna komora o pojemności 18 litrów otwierana jest na całej długości suwakiem YKK, co ułatwia dostęp do zawartości. Wewnątrz znajduje się przegroda na laptopa 13” oraz organizer z miejscem na drobne akcesoria.

Materiał: Cordura 500D w kolorze MultiCam Black, wyposażona w nylonowe taśmy MOLLE/PALS umożliwiające mocowanie dodatkowych modułów. Plecak waży 950 g, jest kompatybilny z bukłakami hydracyjnymi do 2 L (port hydracyjny w przegrodzie głównej).

Wymiary: 45 × 27 × 18 cm. Maksymalne obciążenie: 12 kg. Plecak posiada wzmocnione szelki z regulacją, pas piersiowy oraz uchwyt transportowy. Konstrukcja zgodna ze standardem MIL-STD-810G w zakresie odporności na warunki atmosferyczne.

Dla kogo: użytkownicy ceniący jakość Helikon-Tex, klienci szukający kompaktowego plecaka taktycznego do codziennego użytku lub jako bagażu podręcznego do samolotu (zgodny z większością regulacji cabin baggage).`,
  },
  {
    id: "product-short-utp-table",
    label: "Spodnie UTP — tabela rozmiarów",
    description: "Tabela i parametry techniczne",
    profile: "product_short",
    source: `Tabela rozmiarowa — spodnie taktyczne Helikon-Tex UTP:

| Rozmiar | Obwód pasa (cm) | Obwód bioder (cm) | Długość nogawki (cm) |
|---------|------------------|--------------------|----------------------|
| S Short | 76–80 | 92–96 | 76 |
| S Regular | 76–80 | 92–96 | 81 |
| M Short | 84–88 | 100–104 | 76 |
| M Regular | 84–88 | 100–104 | 81 |
| L Regular | 92–96 | 108–112 | 81 |
| L Long | 92–96 | 108–112 | 86 |
| XL Long | 100–104 | 116–120 | 86 |

Parametry:
- Skład materiału: 65% poliester, 35% bawełna (rip-stop)
- Gramatura: 235 g/m²
- Liczba kieszeni: 10 (w tym 2 cargo, 2 tylne, 2 boczne, 2 wewnętrzne, 2 na kolana)
- Wzmocnienia: kolana, siedzisko
- Pranie: maks. 40°C, bez wybielania, bez prania chemicznego
- Zgodność: PN-EN ISO 13688 (odzież ochronna)`,
  },
  {
    id: "seo-backpacks-category",
    label: "Plecaki taktyczne — kategoria",
    description: "Nazwa i opis kategorii (SEO)",
    profile: "seo",
    source: `Nazwa kategorii: Plecaki taktyczne i militarne

Opis kategorii (meta description, ~155 znaków):
Plecaki taktyczne 20–80 L, modele MOLLE, bukłaki hydracyjne, plecaki survivalowe i patrolowe. Sprzęt sprawdzonych marek dla wojska, służb i miłośników outdooru.

Opis kategorii (długi, do strony kategorii, ~400–600 znaków):
W kategorii plecaki taktyczne znajdziesz modele o pojemności od 20 do 80 litrów, z systemem mocowań MOLLE/PALS, kieszeniami na bukłak hydracyjny i wzmocnionymi szelkami. Oferujemy plecaki marek Helikon-Tex, 5.11 Tactical, Mil-Tec, Pentagon, M-Tac oraz Direct Action. W zależności od potrzeb wybierzesz plecak patrolowy (EDC), plecak typu assault, plecak survivalowy lub duży plecak ekspedycyjny. Dostępne kolory: czarny, coyote, olive green, MultiCam, ranger green.`,
  },
  {
    id: "guide-tactical-flashlight",
    label: "Jak wybrać latarkę taktyczną",
    description: "Artykuł poradnikowy",
    profile: "guide",
    source: `Jak wybrać latarkę taktyczną — przewodnik dla początkujących

Wybór dobrej latarki taktycznej zaczyna się od trzech pytań: jak długi czas pracy potrzebujesz, jaką maksymalną moc świecenia (lumeny) chcesz uzyskać i czy zależy ci na zasilaniu standardowymi bateriami AA, czy akumulatorem 18650.

1. Strumień świetlny (lumeny)
Dla zastosowań EDC wystarczy 500–800 lumenów. Dla zastosowań taktycznych lub poszukiwawczych warto sięgnąć po model 1000+ lumenów. Pamiętaj, że wyższy strumień oznacza krótszy czas pracy na pełnej mocy.

2. Czas pracy
Sprawdź czas pracy w trybie ECO i w trybie maksymalnym. Modele typu Fenix PD36R potrafią świecić ponad 40 godzin w trybie ECO i około 90 minut na pełnej mocy.

3. Wytrzymałość
Szukaj certyfikatu IP68 (pełna ochrona przed pyłem i zanurzeniem) oraz odporności na upadek z 1 m (zgodność z normami ANSI FL1).

4. Mocowanie
Jeśli planujesz montować latarkę na broni długiej, wybierz model z mocowaniem na szynie Picatinny. Dla noszenia w kieszeni — model z klipsem i ergonomicznym wyłącznikiem ogonowym.

Polecane modele do 500 zł: Fenix PD36R, Olight Warrior Mini 3, Nitecore P10iX. Dla bardziej wymagających: Surefire E2D, Streamlight ProTac HL-X.

Rekomendacja redakcyjna: dla większości użytkowników najlepszym wyborem będzie Fenix PD36R — łączy realne 1600 lumenów, ładowanie USB-C i certyfikat IP68.`,
  },
  {
    id: "marketing-bergen-campaign",
    label: "Bergen — newsletter, ADS, SMS",
    description: "Treści marketingowe",
    profile: "marketing",
    source: `Newsletter (subject + lead + CTA):

Temat: Nowy Helikon-Tex Bergen już dostępny — odbierz -15% na pierwsze zamówienie

Wprowadzenie:
Klasyka brytyjskich plecaków patrolowych w nowej odsłonie. Bergen 18L z systemem MOLLE i materiałem Cordura 500D właśnie trafił do naszej oferty. Jeśli szukasz solidnego plecaka na codzień, do pracy w terenie albo jako bagażu podręcznego — Bergen to plecak, który ostatnio polecaliśmy najczęściej.

CTA: Zobacz Bergen 18L

—

ADS (Facebook/Google) — 3 warianty:

Wariant 1 (90 znaków):
Plecak taktyczny Bergen 18L. Cordura 500D, MOLLE, ważny test wytrzymałości.

Wariant 2 (90 znaków):
Helikon-Tex Bergen 18L — patrolowy klasyk wraca. Zobacz pełną specyfikację.

Wariant 3 (90 znaków):
Cordura 500D. MOLLE. 950 g. Bergen 18L w Militaria.pl — sprawdź.

—

SMS (max 160 znaków):
Militaria.pl: Helikon-Tex Bergen 18L już dostępny. Z kodem WELCOME15 -15% na pierwsze zamówienie. Wazne do 31.05. Sprawdz: militaria.pl/bergen`,
  },
  {
    id: "ui-system-strings",
    label: "Przyciski i komunikaty UI",
    description: "Mikrocopy interfejsu",
    profile: "ui_system",
    source: `Buttony (pojedyncze, po jednej linii, nie tłumaczyć placeholderów):

- Dodaj do koszyka
- Kup teraz
- Zapłać {amount} zł
- Kontynuuj zakupy
- Sprawdź dostępność
- Zaloguj się
- Załóż konto
- Wybierz rozmiar
- Pokaż więcej

—

Komunikaty:
- Twoje zamówienie #{orderId} zostało przyjęte. Wysłaliśmy potwierdzenie na adres {email}.
- Brak produktu w wybranym rozmiarze. Powiadomimy Cię, gdy będzie dostępny.
- Nie udało się przetworzyć płatności. Spróbuj ponownie lub wybierz inną metodę.
- Twój koszyk wygaśnie za {minutes} min.

—

Banery:
- Darmowa dostawa od 299 zł
- -20% na akcesoria w ten weekend
- Nowość: kolekcja Helikon-Tex jesień 2026

—

Placeholdery w formularzu:
- Wpisz kod pocztowy
- Adres e-mail
- Numer telefonu (opcjonalnie)`,
  },
  {
    id: "informational-faq",
    label: "FAQ, płatności, O nas",
    description: "Treści informacyjne",
    profile: "informational",
    source: `FAQ — wybrane pytania:

Pytanie: Jak długo trwa dostawa?
Odpowiedź: Standardowa dostawa kurierska na terenie Polski trwa 1–2 dni robocze. Dostawa do paczkomatu InPost — 1 dzień roboczy. Dostawa zagraniczna do krajów UE — od 3 do 7 dni roboczych, w zależności od kraju.

Pytanie: Czy mogę zwrócić zamówiony produkt?
Odpowiedź: Tak. Masz 30 dni na zwrot bez podania przyczyny. Wystarczy, że wypełnisz formularz zwrotu w panelu klienta i odeślesz produkt w oryginalnym opakowaniu.

—

Płatności:
Akceptujemy płatność szybkim przelewem (PayU), kartą (Visa, MasterCard), BLIK, PayPal oraz przelewem tradycyjnym. Płatność za pobraniem dostępna jest dla zamówień do 1000 zł na terenie Polski.

—

O nas (skrót):
Militaria.pl to polski sklep z asortymentem dla wojska, służb mundurowych, miłośników outdooru i survivalu. Działamy od 2003 roku. Mamy 4 magazyny w Polsce i obsługujemy klientów na kilkunastu rynkach europejskich.`,
  },
  {
    id: "legal-returns-clause",
    label: "Regulamin — zwroty (§ 6)",
    description: "Fragment regulaminu",
    profile: "legal",
    source: `§ 6. Zwroty i odstąpienie od umowy

1. Konsument, który zawarł umowę na odległość, ma prawo odstąpić od niej w terminie 30 dni od dnia odbioru towaru, bez podania przyczyny i bez ponoszenia kosztów, z wyjątkiem kosztów określonych w ust. 3.

2. Aby skorzystać z prawa odstąpienia od umowy, Konsument powinien poinformować Sprzedawcę o swojej decyzji w drodze jednoznacznego oświadczenia (np. pismo wysłane pocztą, faksem lub pocztą elektroniczną). Konsument może skorzystać z wzoru formularza odstąpienia od umowy, jednak nie jest to obowiązkowe.

3. Bezpośrednie koszty zwrotu towaru ponosi Konsument. Sprzedawca zwraca Konsumentowi wszystkie otrzymane od niego płatności, w tym koszty dostarczenia towaru (z wyjątkiem dodatkowych kosztów wynikających z wybranego przez Konsumenta sposobu dostarczenia innego niż najtańszy zwykły sposób dostarczenia oferowany przez Sprzedawcę).

4. Prawo odstąpienia od umowy nie przysługuje w przypadkach określonych w art. 38 ustawy z dnia 30 maja 2014 r. o prawach konsumenta (Dz.U. 2014 poz. 827).`,
  },
  {
    id: "infographic-vest-guide",
    label: "Jak wybrać kamizelkę",
    description: "Tekst na infografikę",
    profile: "infographic",
    source: `Nagłówek: Jak wybrać kamizelkę taktyczną

Punkty (5 sztuk, każdy do 6 słów):
1. Określ swój rozmiar mierząc obwód klatki
2. Wybierz typ: szybkozłączka czy zapięcie boczne
3. Sprawdź MOLLE — liczbę rzędów na froncie
4. Materiał: Cordura 500D lub 1000D
5. Waga bazowa: mniej niż 1500 g

CTA na końcu: Zobacz wszystkie kamizelki`,
  },
  {
    id: "universal-autumn-layers",
    label: "Warstwy odzieży jesienią",
    description: "Tłumaczenie ogólne",
    profile: "universal",
    source: `Sezon jesienny to czas, w którym warto zwrócić uwagę na odpowiednie warstwy odzieży. W naszej ofercie znajdziesz polary, kurtki softshell i kurtki przeciwdeszczowe — produkty marek Helikon-Tex, Pentagon i M-Tac. Wszystkie modele zostały przetestowane w warunkach polowych przez nasz zespół.

Pamiętaj o zasadzie trzech warstw:
- warstwa bazowa odprowadza wilgoć,
- warstwa środkowa izoluje,
- warstwa zewnętrzna chroni przed wiatrem i deszczem.

Zapraszamy do zapoznania się z aktualną ofertą.`,
  },
];

/** Domyślna próbka wczytywana w UI (opis produktu — Bergen). */
export const DEFAULT_SAMPLE: Sample = SAMPLES[0]!;

/** Zwraca próbkę o danym identyfikatorze lub `undefined`. */
export function getSample(id: string): Sample | undefined {
  return SAMPLES.find((sample) => sample.id === id);
}
