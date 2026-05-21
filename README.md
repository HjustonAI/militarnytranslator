Poniżej masz wykonaną **jednostronicową koncepcję rozwiązania**. To jest wersja robocza, którą możemy później skrócić do README albo rozwinąć w specyfikację pod vibe coding.

---

# Militaria Translation Studio

**AI-assisted localization tool for e-commerce content**

## 1. Problem biznesowy

Militaria.pl działa na kilkunastu rynkach europejskich i potrzebuje tłumaczeń wielu różnych typów treści: od opisów produktów, przez SEO, marketing, UI, FAQ, aż po treści prawne. Zadanie nie polega więc na prostym tłumaczeniu tekstu z języka polskiego na inny język, ale na **lokalizacji treści e-commerce z zachowaniem kontekstu, stylu, terminologii i celu biznesowego**.

Opis produktu, przycisk w checkout, newsletter i regulamin wymagają zupełnie innych reguł tłumaczenia. Dlatego prototyp traktuje tłumaczenie jako proces kontrolowany: użytkownik wybiera typ treści, język docelowy i opcjonalne reguły, a narzędzie dobiera odpowiedni profil tłumaczeniowy. W zadaniu wskazano, że narzędzie ma obsłużyć 9 języków europejskich i różne typy contentu, a także być czymś więcej niż translacją słowo-w-słowo. 

---

## 2. Użytkownik

Docelowym użytkownikiem jest pracownik działu e-commerce, contentu, marketingu, SEO, obsługi rynku zagranicznego lub osoba odpowiedzialna za publikację treści produktowych.

Użytkownik nie musi znać prompt engineeringu ani technicznych zasad pracy z LLM. Powinien móc wejść do prostego panelu, wkleić tekst, wybrać typ treści i język, a następnie otrzymać tłumaczenie wraz z informacją, jak zostało przygotowane oraz na co powinien zwrócić uwagę przed publikacją.

---

## 3. Główna teza rozwiązania

**W dużym e-commerce tłumaczenie nie powinno być jednym uniwersalnym procesem.**

Ten sam model językowy może dawać różną jakość w zależności od tego, czy dostanie kontekst i jasne reguły. Dlatego Militaria Translation Studio wykorzystuje **profile tłumaczeniowe zależne od typu treści i rynku docelowego**. Każdy profil definiuje inny poziom kreatywności, formalności, precyzji, długości wypowiedzi i kontroli terminologii.

Celem prototypu jest pokazanie, że jakość tłumaczeń można poprawić nie przez samo „podłączenie AI”, ale przez zaprojektowanie procesu: wybór profilu, instrukcje systemowe, glosariusz, zasady ochrony terminów oraz kontrolę jakości.

---

## 4. Jak działa rozwiązanie

Podstawowy flow użytkownika:

1. Użytkownik wybiera **typ treści**.
2. Wybiera **język docelowy**: EN-US, EN-UK, DE, FR, UK, RO, CS, HU lub FI.
3. Wkleja **tekst źródłowy po polsku**.
4. Opcjonalnie dodaje **glosariusz branżowy** lub własną instrukcję.
5. System dobiera odpowiedni **profil tłumaczeniowy**.
6. AI generuje tłumaczenie.
7. Narzędzie pokazuje:

   * gotowe tłumaczenie,
   * notatki jakościowe,
   * zachowane terminy,
   * potencjalne ryzyka,
   * rekomendacje dla człowieka przed publikacją.
8. Użytkownik kopiuje wynik do dalszego procesu.

---

## 5. Profile tłumaczeniowe

Rdzeniem narzędzia są **Content Translation Profiles**. To one odróżniają prototyp od zwykłego translatora.

| Profil            | Zastosowanie                                | Główna zasada                                                  |
| ----------------- | ------------------------------------------- | -------------------------------------------------------------- |
| **Product Long**  | opisy producentów, długie opisy produktowe  | naturalny styl sprzedażowy, ale bez zmiany parametrów i faktów |
| **Product Short** | tabele rozmiarowe, instrukcje, porównywarki | zwięzłość, precyzja, zachowanie jednostek i struktury          |
| **SEO**           | nazwy kategorii, opisy kategorii            | lokalizacja pod intencję wyszukiwania, nie tłumaczenie 1:1     |
| **Guide**         | artykuły poradnikowe                        | czytelny, ekspercki styl dopasowany do użytkownika końcowego   |
| **Marketing**     | newslettery, ADS, SMS, maile                | transkreacja, perswazja, naturalne CTA                         |
| **UI/System**     | checkout, przyciski, banery, komunikaty     | krótkie, jednoznaczne mikrocopy, naturalne dla danego rynku    |
| **Informational** | FAQ, O nas, płatności                       | jasność, zaufanie, neutralny styl                              |
| **Legal**         | regulaminy, polityki, bezpieczeństwo        | niska kreatywność, ostrożność, zachowanie sensu prawnego       |
| **Infographic**   | teksty na infografiki                       | krótko, rytmicznie, z zachowaniem sensu                        |
| **Universal**     | zwykłe tłumaczenie                          | brak specjalizacji, ogólne tłumaczenie                         |
| **Custom Prompt** | własna instrukcja użytkownika               | pełna kontrola nad zachowaniem AI                              |

---

## 6. Dlaczego to jest lepsze niż zwykły translator

Prototyp ma przewagę nad ogólnym translatorem, ponieważ:

* dobiera strategię tłumaczenia do typu treści,
* rozróżnia potrzeby treści produktowych, SEO, marketingowych, UI i prawnych,
* wspiera różne warianty językowe, w tym EN-US i EN-UK,
* pozwala użyć glosariusza branżowego,
* chroni nazwy marek, modele, SKU, jednostki, liczby i parametry techniczne,
* może generować nie tylko tłumaczenie, ale też komentarz jakościowy,
* ogranicza kreatywność tam, gdzie liczy się precyzja,
* pozwala zwiększyć kreatywność tam, gdzie potrzebna jest transkreacja, np. w reklamach i newsletterach.

Najważniejsza różnica: zwykły translator odpowiada na pytanie **„jak przetłumaczyć ten tekst?”**, a ten prototyp odpowiada na pytanie **„jak przygotować tę treść do użycia na konkretnym rynku e-commerce?”**.

---

## 7. Zakres MVP

W prototypie powinno znaleźć się:

* lokalnie działająca aplikacja webowa,
* prosty interfejs dla nietechnicznego użytkownika,
* wybór typu treści,
* wybór języka docelowego,
* pole na tekst źródłowy,
* opcjonalne pole glosariusza,
* opcjonalne pole własnej instrukcji,
* generowanie tłumaczenia,
* sekcja „Quality Notes”,
* sekcja „Protected Terms / Preserved Elements”,
* możliwość skopiowania wyniku,
* README z opisem decyzji projektowych i instrukcją uruchomienia.

To odpowiada kryteriom zadania: narzędzie ma działać, realizować obietnice z README, pokazywać podejście do różnych typów treści, dawać jakość wyższą niż ogólny translator i być używalne przez pracownika bez wiedzy technicznej. 

---

## 8. Poza zakresem MVP

Świadomie nie buduję w prototypie:

* integracji z systemami Militaria.pl,
* bazy danych,
* logowania użytkowników,
* pełnego backendu produkcyjnego,
* deploymentu,
* wieloetapowego workflow akceptacji,
* masowego przetwarzania tysięcy produktów,
* historii wersji,
* panelu administracyjnego dla glosariusza.

Te elementy są ważne produkcyjnie, ale nie są potrzebne do pokazania sposobu myślenia i działającego prototypu. Samo zadanie wskazuje, że nie trzeba integrować się z systemami Militaria.pl, budować backendu ani bazy danych oraz że wystarczy działanie lokalne. 

---

## 9. Wizja produkcyjnego rozwinięcia

W wersji produkcyjnej narzędzie można rozwinąć w kierunku pełnego workflow lokalizacji treści:

* integracja z PIM, CMS lub systemem zarządzania produktami,
* import i eksport CSV/XLSX,
* tłumaczenia wsadowe dla wielu produktów,
* kolejka zadań tłumaczeniowych,
* centralny glosariusz marek, kategorii i terminów branżowych,
* historia wersji tłumaczeń,
* porównywanie zmian między wersjami,
* workflow akceptacji przez content managera,
* automatyczna walidacja liczb, jednostek, SKU i nazw modeli,
* scoring jakości tłumaczenia,
* raport kosztu i czasu per język, typ treści i dział,
* dashboard oszczędności czasu i efektów biznesowych.

Wdrożenie produkcyjne powinno być traktowane nie jako „translator AI”, ale jako element procesu e-commerce wspierający ekspansję zagraniczną, szybsze publikowanie produktów i standaryzację jakości treści.

---

## 10. Obietnica prototypu

**Militaria Translation Studio** ma pokazać, że proces tłumaczenia treści e-commerce można usprawnić przez kontrolowany pipeline AI: wybór typu treści, dopasowanie profilu tłumaczeniowego, uwzględnienie języka docelowego, ochronę terminologii, glosariusz, notatki jakościowe i prosty interfejs dla pracownika biznesowego.

Prototyp nie próbuje być pełnym systemem produkcyjnym. Jego celem jest udowodnienie, że kandydat potrafi przełożyć potrzebę biznesową na konkretne, działające narzędzie GenAI oraz świadomie zaprojektować proces automatyzacji z myślą o jakości, użytkowniku i dalszym wdrożeniu.
