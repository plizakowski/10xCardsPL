# Plan implementacji widoku Generate

## 1. Przegląd

Widok Generate konsoliduje główne funkcje aplikacji związane z zarządzaniem fiszkami – umożliwia generowanie fiszek za pomocą sztucznej inteligencji, ręczne tworzenie nowych fiszek oraz przeglądanie istniejących zestawów. Widok ma również prezentować podsumowanie stanu konta użytkownika i oferować intuicyjną, responsywną nawigację z odpowiednimi zabezpieczeniami (JWT).

## 2. Routing widoku

- Widok będzie dostępny pod ścieżką `/generate`.
- Po zalogowaniu użytkownika następuje domyślne przekierowanie do tego widoku.

## 3. Struktura komponentów

- **Layout/MainPage** – ogólna struktura widoku zawierająca nagłówek oraz główny obszar roboczy.
  - **Topbar** – pasek nawigacyjny, zawiera logo, menu nawigacyjne oraz informacje o koncie użytkownika.
  - **GenerateAIFlashcardsForm** – formularz do wprowadzania tekstu i wywoływania akcji generowania fiszek przez AI.
  - **GeneratedFlashcardsList** – sekcja wyświetlająca listę wygenerowanych fiszek z opcjami akceptacji, edycji lub odrzucenia.
  - **ManualFlashcardForm** (opcjonalnie) – formularz do ręcznego tworzenia nowych fiszek.
  - **FlashcardsOverview** – sekcja przeglądu i zarządzania istniejącymi fiszkami.

## 4. Szczegóły komponentów

### Topbar

- **Opis:** Pasek nawigacyjny umożliwiający dostęp do kluczowych funkcji aplikacji oraz prezentujący stan konta użytkownika.
- **Elementy:** Logo, menu nawigacyjne (linki do /generate, sesji nauki, ustawień itp.), przycisk wylogowania.
- **Interakcje:** Kliknięcia w elementy menu inicjują przejścia do odpowiednich widoków.
- **Walidacja:** Brak specyficznych walidacji – nacisk na responsywność i dostępność.
- **Typy & Propsy:** Proste typy strunowe przekazujące etykiety oraz ścieżki; callback do obsługi zdarzenia wylogowania.

### GenerateAIFlashcardsForm

- **Opis:** Formularz umożliwiający użytkownikowi wklejenie tekstu (od 1000 do 10000 znaków) i wywołanie usługi generującej fiszki przez AI.
- **Elementy:**
  - Pole tekstowe (textarea) z placeholderem i ograniczeniami długości.
  - Prosty przycisk "Generuj", który wywołuje akcję API.
  - Obszar na wyświetlanie komunikatów o błędach walidacji.
- **Interakcje:**
  - Aktualizacja stanu tekstu w czasie pisania.
  - Kliknięcie przycisku wywołujące funkcję API.
- **Walidacja:**
  - Lokalna walidacja minimalnej (1000 znaków) i maksymalnej (10000 znaków) długości tekstu.
  - Wyświetlanie komunikatów przy nieprawidłowych danych.
- **Typy & Propsy:**
  - Użycie typu `GenerateFlashcardsCommand` do wysyłki danych.
  - Propsy: wartość tekstu, funkcja ustawiająca stan tekstu, funkcja callback obsługująca wynik generowania.

### GeneratedFlashcardsList

- **Opis:** Prezentacja listy fiszek wygenerowanych przez API dla dalszej akceptacji lub edycji.
- **Elementy:**
  - Lista komponentów karty fiszki, gdzie każda karta wyświetla `front_text` i `back_text`.
  - Przyciski akcji: akceptacja, edycja, odrzucenie.
- **Interakcje:**
  - Kliknięcia przycisków inicjują odpowiednie akcje (np. zmiana statusu, otwarcie formularza edycji).
- **Walidacja:** Sprawdzenie poprawności załadowanych danych (obecność `flashcards`).
- **Typy & Propsy:**
  - Typy zgodne z `FlashcardDTO` oraz `FlashcardResponseDTO`.
  - Propsy: lista fiszek oraz funkcje callback dla akcji na poszczególnych fiszkach.

### ManualFlashcardForm (opcjonalnie)

- **Opis:** Formularz do ręcznego dodawania fiszek, umożliwiający wpisanie treści przodu i tyłu.
- **Elementy:**
  - Dwa pola input (dla przodu i tyłu fiszki).
  - Przycisk "Zapisz" do dodania nowej fiszki.
- **Interakcje:**
  - Wprowadzanie danych.
  - Walidacja pól przed wysłaniem.
- **Walidacja:** Pola wymagane, sprawdzenie niepustości.
- **Typy & Propsy:**
  - Użycie typu `CreateFlashcardCommand`.
  - Propsy: funkcja callback wywoływana przy zapisaniu fiszki.

## 5. Typy

- **GenerateFlashcardsCommand:**
  ```typescript
  {
    text: string;
  }
  ```
- **GenerateFlashcardsResponseDTO:**
  ```typescript
  { request_id: string, flashcards: FlashcardDTO[] }
  ```
- **FlashcardDTO / FlashcardResponseDTO:**  
  Zdefiniowane w `src/types.ts` – zawierają pola: `id`, `front_text`, `back_text`, `status`.
- **ViewModel:**  
  Przykładowy model do zarządzania stanem widoku, np.:
  ```typescript
  interface FlashcardsViewModel {
    inputText: string;
    isLoading: boolean;
    errorMessage: string | null;
    flashcards: FlashcardDTO[];
  }
  ```

## 6. Zarządzanie stanem

- Główne zmienne stanu (przy użyciu `useState`):
  - `inputText` – zawartość pola tekstowego.
  - `isLoading` – stan ładowania podczas wywoływania API.
  - `errorMessage` – komunikaty błędów (walidacja, błędy API).
  - `flashcards` – lista wygenerowanych fiszek.
- Opcjonalnie: custom hook `useFlashcards` do enkapsulacji logiki generowania, obsługi zdarzeń i aktualizacji stanu.

## 7. Integracja API

- **Endpoint:** POST `/api/ai/generate`
- **Żądanie:**
  ```json
  { "text": "Tekst źródłowy do analizy przez AI (1000-10000 znaków)" }
  ```
- **Odpowiedź:**
  ```json
  {
    "request_id": "uuid",
    "flashcards": [
      { "front_text": "Wygenerowane pytanie 1", "back_text": "Wygenerowana odpowiedź 1", "status": "w trakcie edycji" },
      { "front_text": "Wygenerowane pytanie 2", "back_text": "Wygenerowana odpowiedź 2", "status": "w trakcie edycji" }
    ]
  }
  ```
- **Implementacja:** Użycie funkcji `fetch` lub biblioteki axios. Należy obsłużyć statusy odpowiedzi:
  - 200: wyświetlenie wyników.
  - 400, 401, 429, 500: wyświetlenie odpowiednich komunikatów błędu.

## 8. Interakcje użytkownika

- Użytkownik wprowadza tekst w pole textarea z ograniczeniem długości.
- Po kliknięciu przycisku „Generuj” następuje wywołanie API.
- W trakcie oczekiwania wyświetlany jest spinner lub inny wskaźnik ładowania.
- Po otrzymaniu odpowiedzi użytkownik widzi listę wygenerowanych fiszek z możliwością akceptacji, edycji lub odrzucenia.
- W przypadku błędów wyświetlany jest odpowiedni komunikat.

## 9. Warunki i walidacja

- **Lokalna walidacja formularza:**
  - Tekst musi mieć minimum 1000 oraz maksimum 10000 znaków.
- **Weryfikacja odpowiedzi API:**
  - Status 200 – poprawne wyświetlenie danych.
  - Inne statusy – prezentacja komunikatów błędu i możliwość ponowienia próby.
- **Walidacja pól w formularzu ręcznym:**
  - Pola "Przód" i "Tył" nie mogą być puste.

## 10. Obsługa błędów

- Wyświetlanie komunikatów błędów przy niepoprawnych danych wejściowych (walidacja tekstu).
- Globalna obsługa błędów API (np. błędy 400, 401, 429, 500) przy użyciu dedykowanych alertów i logowanie błędów w konsoli.
- Umożliwienie ponownego wysłania żądania po wystąpieniu błędu.

## 11. Kroki implementacji

1. Utworzyć widok `/generate` (np. plik `src/pages/generate.tsx`) i skonfigurować routing.
2. Zaimplementować główny layout widoku wraz z komponentem **Topbar**.
3. Stworzyć komponent **GenerateAIFlashcardsForm**:
   - Dodać pole tekstowe z walidacją ograniczeń długości.
   - Zaimplementować przycisk, który wywołuje API.
4. Zaimplementować integrację z endpointem `/api/ai/generate`:
   - Wykonać wywołanie przy użyciu `fetch` lub axios.
   - Obsłużyć wyniki oraz komunikaty błędów.
5. Utworzyć komponent **GeneratedFlashcardsList** do wyświetlania wyników.
6. (Opcjonalnie) Dodać komponent **ManualFlashcardForm** dla ręcznego tworzenia fiszek.
7. Zarządzać stanem widoku przy użyciu hooków (`useState`) lub custom hooka (`useFlashcards`).
8. Połączyć wszystkie komponenty we wspólnym widoku, zapewniając spójność interfejsu.
9. Dodać style korzystając z Tailwind CSS oraz integrację z komponentami shadcn/ui.
10. Przeprowadzić testy interakcji, walidacji oraz obsługi błędów.
11. Dokumentować i przeprowadzić code review przed wdrożeniem.
