# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

Interfejs użytkownika składa się z jednego widoku, który łączy główne funkcjonalności: generowanie fiszek przez AI, ręczne tworzenie fiszek oraz przeglądanie/edycję istniejących fiszek. Struura obejmuje widoki uwoerzytelniania, generowania fisze listy fiszez modalem edycji, panel oraz wodok sesji powtórek. Nawigacja odbywa się poprzez topbar oparty na Navigation Menu od shadcn/ui. Całość jest responsywna, zgodna z WCAG AA, wykorzystuje React hooks i context do zarządzania stanem, a także implementuje inline walidację i komunikaty o błędach.

## 2. Lista widoków

- **Widok logowania/rejestracji**

  - Ścieżka widoku: `/login` lub `/register`
  - Główny cel: Umożliwienie autoryzacji użytkownika.
  - Kluczowe informacje do wyświetlenia: Formularze logowania/rejestracji, komunikaty walidacyjne i błędów.
  - Kluczowe komponenty: Formularz, przyciski, komunikaty walidacyjne.
  - UX, dostępność i względy bezpieczeństwa: Wsparcie dla klawiatury i czytelne etykiety, autoryzacja oparta na JWT, szyfrowanie danych.

- **Główny widok**

  - Ścieżka widoku: `/generate` (domyślne przekierowanie po logowaniu)
  - Główny cel: Zarządzanie i organizacja fiszek oraz dostęp do głównych funkcji aplikacji.
  - Kluczowe informacje do wyświetlenia: Przegląd funkcji (generowanie AI, ręczne tworzenie, przeglądanie fiszek), podsumowanie stanu konta.
  - Kluczowe komponenty: Topbar z Navigation Menu, karty/sekcje dla poszczególnych funkcji.
  - UX, dostępność i względy bezpieczeństwa: Intuicyjna nawigacja, responsywność, ochrona danych użytkownika przy użyciu JWT.

- **Widok generowania fiszek (AI)**

  - Ścieżka widoku: `/dashboard/ai-generate`
  - Główny cel: Umożliwienie użytkownikowi generowania fiszek przy pomocy sztucznej inteligencji.
  - Kluczowe informacje do wyświetlenia: Pole do wprowadzania tekstu, lista wygenerowanych propozycji fiszek, status fiszek (np. "w trakcie edycji").
  - Kluczowe komponenty: Formularz z polem tekstowym, lista fiszek, rating gwiazdkowy, przyciski akceptacji/odrzucenia.
  - UX, dostępność i względy bezpieczeństwa: Inline walidacja i komunikaty błędów, dostępność dla czytników ekranu, responsywność, walidacja danych przed wysłaniem.

- **Widok ręcznego tworzenia fiszki**

  - Ścieżka widoku: `/dashboard/manual-create`
  - Główny cel: Pozwolenie użytkownikowi na ręczne dodawanie nowych fiszek.
  - Kluczowe informacje do wyświetlenia: Formularz umożliwiający wprowadzenie "przodu" i "tyłu" fiszki.
  - Kluczowe komponenty: Formularz, przycisk zapisu.
  - UX, dostępność i względy bezpieczeństwa: Prostota obsługi, czytelność formularza, walidacja pól, zabezpieczenia przed błędami danych.

- **Widok przeglądania fiszek**

  - Ścieżka widoku: `/dashboard/flashcards`
  - Główny cel: Prezentacja listy istniejących fiszek z możliwością filtrowania i edycji.
  - Kluczowe informacje do wyświetlenia: Lista fiszek, filtry według statusu i źródła, opcje lazy loading, przyciski do edycji i usuwania.
  - Kluczowe komponenty: Lista/tabela fiszek, komponenty filtrujące, modal do szczegółowego podglądu.
  - UX, dostępność i względy bezpieczeństwa: Intuicyjne filtrowanie, dostępność dla urządzeń mobilnych, potwierdzenia działań, obsługa błędów inline.

- **Modal szczegółowego podglądu fiszki**

  - Ścieżka widoku: Wbudowany komponent modal (wyświetlany w widoku przeglądania fiszek)
  - Główny cel: Zapewnienie szczegółowego podglądu fiszki przed zatwierdzeniem lub edycją.
  - Kluczowe informacje do wyświetlenia: Pełne dane fiszki, opcje akceptacji, edycji lub odrzucenia.
  - Kluczowe komponenty: Modal, przyciski akcji, komponent rating gwiazdkowy.
  - UX, dostępność i względy bezpieczeństwa: Łatwość zamknięcia modal (np. przyciskiem lub klawiszem ESC), czytelny układ, odpowiednia nawigacja klawiaturowa.

- **Widok sesji nauki**
  - Ścieżka widoku: `/dashboard/study`
  - Główny cel: Umożliwienie nauki za pomocą fiszek zgodnie z algorytmem powtórek.
  - Kluczowe informacje do wyświetlenia: Aktualna fiszka, progress bar, możliwość oceny fiszki (np. gwiazdki).
  - Kluczowe komponenty: Komponent sesji nauki, przyciski do oceny, licznik postępów.
  - UX, dostępność i względy bezpieczeństwa: Intuicyjny progres, dostępność z klawiaturą, walidacja wyników, ochrona sesji użytkownika.

## 3. Mapa podróży użytkownika

1. Użytkownik rozpoczyna od odwiedzenia widoku logowania lub rejestracji.
2. Po pomyślnym zalogowaniu użytkownik zostaje przekierowany do głównego dashboardu, gdzie domyślnie aktywny jest widok generowania fiszek przez AI.
3. W widoku generowania fiszek AI użytkownik wprowadza tekst i wysyła zapytanie, a następnie przegląda wygenerowane propozycje fiszek.
4. Użytkownik może akceptować, edytować lub odrzucać fiszki inline oraz korzystać z modal do szczegółowego podglądu wybranej fiszki.
5. W razie potrzeby użytkownik przełącza się na widok ręcznego tworzenia fiszek, aby dodać własne karty.
6. Użytkownik może również przejść do widoku przeglądania fiszek, gdzie stosuje filtry według statusu i źródła, a lista fiszek jest ładowana z zastosowaniem lazy loadingu.
7. W trybie nauki użytkownik rozpoczyna sesję, ocenia fiszki i monitoruje swoje postępy.

## 4. Układ i struktura nawigacji

Nawigacja w aplikacji realizowana jest przez topbar oparty na Navigation Menu od shadcn/ui, który obejmuje:

- Logo lub nazwę produktu
- Linki do głównych sekcji: Generowanie AI, Ręczne tworzenie, Przegląd fiszek, Sesja nauki
- Ikonki profilu i ustawień, umożliwiające dostęp do opcji konta oraz wylogowania

Nawigacja jest responsywna – na mniejszych ekranach zmienia się w menu hamburgerowe. Po zalogowaniu użytkownik automatycznie trafia do widoku generowania fiszek.

## 5. Kluczowe komponenty

- **Topbar/Nawigacja**: Globalny komponent nawigacyjny umożliwiający dostęp do głównych sekcji aplikacji.
- **Modal**: Komponent wykorzystywany do szczegółowego podglądu i edycji fiszek przed zatwierdzeniem.
- **Formularze**: Komponenty formularzy do logowania, rejestracji, tworzenia fiszek oraz generowania fiszek przez AI.
- **Lista fiszek**: Komponent do wyświetlania i filtrowania fiszek z opcją lazy loadingu oraz edycji inline.
- **Rating gwiazdkowy**: Komponent oceny fiszek, umożliwiający szybką recenzję treści.
- **Komunikaty inline**: System wyświetlania błędów i walidacji bezpośrednio w interfejsie użytkownika.
- **Zarządzanie stanem**: Wykorzystanie React hooks i context (z możliwością migracji do Zustand) dla scentralizowanego zarządzania danymi aplikacji.
