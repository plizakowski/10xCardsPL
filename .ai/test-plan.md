Oto kompleksowy plan testów dla projektu "Fiszki - Developer Learning Platform":

<analiza_projektu>
## Analiza Projektu "Fiszki - Developer Learning Platform"

### 1. Kluczowe komponenty i funkcjonalności projektu

#### A. Frontend (Astro + React)
*   **Rdzeń Aplikacji:**
    *   `astro.config.mjs`: Konfiguracja projektu Astro (SSR, integracje React, Tailwind).
    *   `package.json`: Zależności (Astro, React, Supabase, Tailwind, Shadcn/ui, OpenRouter/Azure OpenAI SDK), skrypty (dev, build, lint, format).
    *   `src/layouts/`: `MainLayout.astro` (główny układ stron z nawigacją), `Layout.astro` (podstawowy layout).
    *   `src/pages/`:
        *   `index.astro`: Strona główna.
        *   `generate.astro`: Strona do generowania fiszek (integruje `FlashcardsManager.tsx`).
        *   `study.astro`: Strona do nauki fiszek (integruje `StudyFlashcards.tsx`).
        *   `settings.astro`: Strona ustawień (obecnie statyczna).
*   **Komponenty Interaktywne (React - `src/components/`):**
    *   `FlashcardsManager.tsx`: Centralny komponent do zarządzania procesem generowania fiszek AI, ich przeglądania, akceptacji, odrzucania i edycji. Integruje `GenerateAIFlashcardsForm.tsx` i `GeneratedFlashcardsList.tsx`. Kluczowy dla przepływu tworzenia fiszek.
    *   `GenerateAIFlashcardsForm.tsx`: Formularz do wprowadzania tekstu przez użytkownika w celu wygenerowania fiszek przez AI. Komunikuje się z backendowym API AI.
    *   `GeneratedFlashcardsList.tsx`: Wyświetla listę fiszek zwróconych przez AI, umożliwia użytkownikowi akceptację, odrzucenie lub edycję każdej fiszki. Komunikuje się z API fiszek.
    *   `EditFlashcardDialog.tsx`: Modal (okno dialogowe) do edycji treści pojedynczej fiszki.
    *   `StudyFlashcards.tsx`: Komponent odpowiedzialny za sesję nauki. Powinien implementować logikę algorytmu Spaced Repetition (SM-2 wspomniany w README). Obecnie zawiera dane mockowe i TODO dla algorytmu.
*   **Komponenty UI (Astro/React - `src/components/`, `src/components/ui/`):**
    *   `Topbar.astro`: Górny pasek nawigacyjny z linkami do sekcji aplikacji, przełącznikiem motywu i przyciskiem wylogowania.
    *   `ThemeToggle.astro`: Komponent przełącznika motywu (jasny/ciemny).
    *   Komponenty Shadcn/ui (np. `Button`, `Card`, `Dialog`, `Textarea`): Używane do budowy interfejsu.
*   **Style i Typy:**
    *   `tailwind.config.mjs`, `src/styles/`: Konfiguracja i globalne style Tailwind CSS.
    *   `src/types.ts`: Definicje TypeScript dla DTO (Data Transfer Objects) i modeli używanych w komunikacji frontend-backend.

#### B. Backend (Astro API Routes + Supabase)
*   **API Endpoints (`src/pages/api/`):**
    *   `ai/generate.ts`: Endpoint POST do generowania fiszek z użyciem AI. Przyjmuje tekst, wykorzystuje `AIGenerationService` do interakcji z modelem AI (OpenRouter/Azure) i zapisuje wyniki w Supabase. Zabezpieczony walidacją Zod.
    *   `flashcards/index.ts`:
        *   `GET`: Pobiera listę fiszek użytkownika z paginacją i filtrowaniem.
        *   `POST`: Tworzy nową fiszkę (ręcznie lub na podstawie danych z AI).
    *   `flashcards/[id]/update.ts`: Endpoint POST (powinien być PUT/PATCH) do aktualizacji istniejącej fiszki.
    *   `generate-flashcards.ts`: Wydaje się być starszą/alternatywną implementacją generowania fiszek, bezpośrednio używającą Azure OpenAI SDK.
*   **Serwisy Logiki Biznesowej (`src/lib/services/`):**
    *   `aiGenerationService.ts`: Odpowiada za logikę generowania fiszek przez AI, w tym komunikację z `OpenAIService` i zapis do bazy danych.
    *   `openai.service.ts`: Abstrahuje komunikację z API modelu językowego (konfigurowalne dla Azure OpenAI lub OpenRouter). Tworzy odpowiednie payloady i obsługuje odpowiedzi.
    *   `flashcards.ts`: Zawiera logikę pobierania fiszek z Supabase (`getFlashcards`).
*   **Baza Danych (Supabase):**
    *   `supabase/migrations/`: Definicje schematu bazy danych PostgreSQL (tabele `flashcards`, `ai_requests`, typ `flashcard_status`, indeksy, RLS).
    *   `supabase/config.toml`: Konfiguracja lokalnego środowiska Supabase.
    *   `src/db/supabase.client.ts`: Inicjalizacja klienta Supabase.
    *   `src/db/database.types.ts`: Typy TypeScript wygenerowane na podstawie schematu bazy.
*   **Middleware (`src/middleware/`):**
    *   `index.ts`: Inicjalizuje i udostępnia klienta Supabase w `context.locals` dla endpointów Astro.
    *   `auth.ts`: Middleware do autentykacji użytkowników przy użyciu Supabase Auth. Chroni endpointy wymagające zalogowania.

#### C. Kluczowe Funkcjonalności (wg README i kodu)
*   **Generowanie Fiszki przez AI:** Użytkownik podaje tekst, AI generuje propozycje fiszek.
*   **Zarządzanie Fiszkami (CRUD):** Tworzenie, odczyt, aktualizacja, usuwanie fiszek.
*   **System Powtórek (Spaced Repetition):** Nauka fiszek z wykorzystaniem algorytmu (SM-2 planowany/częściowo zaimplementowany).
*   **Autentykacja Użytkownika:** Rejestracja, logowanie, ochrona danych (Supabase Auth).
*   **Przełączanie Motywu:** Jasny/ciemny tryb interfejsu.

### 2. Potencjalne obszary ryzyka
*   **Integracja AI:**
    *   **Niezawodność i Jakość Generowanych Treści:** Zmienność odpowiedzi AI, potencjalne błędy lub nieoptymalne fiszki.
    *   **Obsługa Błędów API AI:** Limity zapytań, niedostępność usługi, nieoczekiwane formaty odpowiedzi, przekroczenia czasu.
    *   **Koszty:** Użycie API AI może generować znaczące koszty, zwłaszcza przy dużej liczbie użytkowników lub długich tekstach.
    *   **Prompt Engineering i Bezpieczeństwo:** Ryzyko wstrzyknięcia szkodliwych promptów, jeśli dane od użytkownika nie są odpowiednio sanityzowane przed wysłaniem do AI.
*   **Backend i Baza Danych (Supabase):**
    *   **Poprawność RLS (Row Level Security):** Krytyczne dla izolacji danych użytkowników. Błędy w konfiguracji mogą prowadzić do wycieku danych.
    *   **Wydajność Bazy Danych:** Wzrost liczby fiszek i użytkowników może obciążyć bazę; konieczna optymalizacja zapytań i indeksów.
    *   **Migracje Schematu:** Błędy w migracjach mogą prowadzić do utraty danych lub niespójności.
    *   **Walidacja Danych na Endpointach:** Niespójna lub niekompletna walidacja (np. częściowo Zod, częściowo customowa) może prowadzić do błędnych danych w bazie.
    *   **Użycie `DEFAULT_USER_ID`:** W niektórych miejscach (np. `getFlashcards`, `aiGenerationService`) używany jest stały `DEFAULT_USER_ID` zamiast ID zalogowanego użytkownika, co jest poważnym błędem bezpieczeństwa i funkcjonalnym.
*   **Frontend (Astro/React):**
    *   **Zarządzanie Stanem:** Skomplikowany stan w `FlashcardsManager.tsx` może być trudny w utrzymaniu i podatny na błędy.
    *   **Interakcje Użytkownika:** Poprawność działania dynamicznych elementów (edycja, akceptacja, odrzucanie) i ich wpływ na stan aplikacji oraz dane backendowe.
    *   **Responsywność i Kompatybilność:** Aplikacja musi działać poprawnie na różnych przeglądarkach i rozmiarach ekranu.
    *   **Dostępność (a11y):** Mimo użycia `eslint-plugin-jsx-a11y`, konieczna jest weryfikacja zgodności z WCAG.
*   **Autentykacja i Autoryzacja:**
    *   **Bezpieczeństwo Supabase Auth:** Poprawna konfiguracja i obsługa sesji JWT.
    *   **Ochrona API:** Wszystkie wrażliwe endpointy muszą być chronione przez middleware `auth.ts`.
*   **Logika Biznesowa:**
    *   **Algorytm Spaced Repetition (SM-2):** Poprawność implementacji algorytmu jest kluczowa dla efektywności nauki. Rozbieżność między README (zaimplementowany) a kodem (`StudyFlashcards.tsx` ma TODO).
    *   **Spójność DTO:** Zapewnienie, że typy danych (`src/types.ts`) są konsekwentnie używane i interpretowane przez frontend i backend.

### 3. Specyficzne wymagania testowe wynikające ze stosu technologicznego
*   **Astro:**
    *   Testy renderowania stron statycznych i dynamicznych (SSR).
    *   Testy integracji wysp React (`client:load`, `client:idle`, itp.).
    *   Testy działania API Routes (endpointów) i przekazywania danych.
    *   Testy middleware (np. autentykacji, dodawania Supabase do kontekstu).
    *   Testy View Transitions (jeśli zaimplementowane).
*   **React:**
    *   Testy jednostkowe i integracyjne komponentów (np. przy użyciu React Testing Library).
    *   Testy hooków i zarządzania stanem.
    *   Testy interakcji użytkownika (zdarzenia, formularze).
*   **TypeScript:**
    *   Weryfikacja poprawności typowania w całym projekcie (częściowo pokrywane przez proces kompilacji i linting).
    *   Testy poprawności przekazywania danych między modułami zgodnie z zadeklarowanymi typami.
*   **Tailwind CSS:**
    *   Testy wizualne (np. regresyjne z użyciem narzędzi typu Percy/Chromatic) dla kluczowych widoków i komponentów.
    *   Testy responsywności na różnych breakpointach.
    *   Weryfikacja działania trybu ciemnego.
*   **Supabase (Backend & Baza Danych):**
    *   Testy integracyjne z API Supabase (autentykacja, zapytania do bazy, RLS).
    *   Testowanie polityk RLS poprzez symulowanie zapytań jako różni użytkownicy.
    *   Testy poprawności migracji bazy danych.
*   **PostgreSQL:**
    *   Weryfikacja schematu bazy, typów danych, ograniczeń (constraints).
    *   Testy integralności danych i relacji.
*   **OpenRouter/Azure OpenAI (Integracja AI):**
    *   Testy integracyjne z API AI, najlepiej z mockowaniem odpowiedzi API AI, aby zapewnić determinizm i uniknąć kosztów.
    *   Testowanie obsługi różnych kodów odpowiedzi API AI (sukces, błędy, limity).
    *   Testowanie jakości promptów i parsowania odpowiedzi.
*   **Docker/DigitalOcean:**
    *   Testy budowania obrazu Docker.
    *   Testy deploymentu na środowisko zbliżone do produkcyjnego.
    *   Testy działania aplikacji w kontenerze.

### 4. Priorytety testowania bazujące na ważności poszczególnych elementów repozytorium

1.  **Krytyczne (P0):** Funkcjonalności bez których aplikacja nie ma sensu lub które dotyczą bezpieczeństwa.
    *   **Autentykacja i Autoryzacja:** (`src/middleware/auth.ts`, Supabase Auth, ochrona endpointów). *Uzasadnienie: Podstawa bezpieczeństwa i personalizacji.*
    *   **Generowanie Fiszki AI (Backend):** (`src/pages/api/ai/generate.ts`, `src/lib/services/aiGenerationService.ts`, `src/lib/services/openai.service.ts`). *Uzasadnienie: Główna, unikalna propozycja wartości aplikacji.*
    *   **Zarządzanie Fiszkami - CRUD (Backend):** (`src/pages/api/flashcards/index.ts` (POST, GET), `src/pages/api/flashcards/[id]/update.ts`). *Uzasadnienie: Niezbędne do przechowywania i modyfikowania fiszek.*
    *   **Poprawność Działania RLS:** (Konfiguracja Supabase, migracje `supabase/migrations/`). *Uzasadnienie: Krytyczne dla bezpieczeństwa danych wielu użytkowników.*
    *   **Rdzeń Mechanizmu Nauki (Frontend/Backend Logic):** (`src/components/StudyFlashcards.tsx` - logika SM-2, powiązane API do pobierania fiszek do nauki i zapisywania postępów). *Uzasadnienie: Główny cel aplikacji - nauka.*
2.  **Wysokie (P1):** Kluczowe interfejsy użytkownika i przepływy.
    *   **Frontend Zarządzania Fiszkami AI:** (`src/components/FlashcardsManager.tsx`, `GenerateAIFlashcardsForm.tsx`, `GeneratedFlashcardsList.tsx`). *Uzasadnienie: Interfejs do głównej funkcjonalności.*
    *   **Edycja Fiszki:** (`src/components/EditFlashcardDialog.tsx` i powiązane API). *Uzasadnienie: Ważna funkcja modyfikacji danych.*
    *   **Struktura i Typy Danych:** (`src/types.ts`, `src/db/database.types.ts`). *Uzasadnienie: Spójność danych w aplikacji.*
    *   **Główne Strony Użytkownika:** (`src/pages/generate.astro`, `src/pages/study.astro`). *Uzasadnienie: Punkty wejścia do kluczowych funkcji.*
3.  **Średnie (P2):** Funkcje pomocnicze, konfiguracja, mniej krytyczne UI.
    *   **Konfiguracja Projektu:** (`astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`).
    *   **Podstawowe Komponenty UI Shadcn:** (`src/components/ui/`). *Uzasadnienie: Wpływają na wygląd, ale błędy rzadziej blokują całą funkcjonalność.*
    *   **Nawigacja i Layout:** (`src/layouts/MainLayout.astro`, `src/components/Topbar.astro`).
    *   **Przełączanie Motywu:** (`src/components/ThemeToggle.astro`).
    *   **Linting i Formatowanie:** (`eslint.config.js`, `.prettierrc.json`). *Uzasadnienie: Jakość kodu, niebezpośredni wpływ na użytkownika.*
4.  **Niskie (P3):** Dokumentacja, narzędzia deweloperskie, elementy niekrytyczne.
    *   **Dokumentacja:** (`README.md`, pliki w `.ai/`).
    *   **Strona Główna (`index.astro`), Ustawień (`settings.astro` - obecna implementacja):** Mają mniejszy wpływ na core'owe funkcje.
    *   **Narzędzia Pomocnicze:** (`.nvmrc`, `.gitignore`, Husky).

</analiza_projektu>

---

## Plan Testów dla Projektu "Fiszki - Developer Learning Platform"

### 1. Wprowadzenie

#### Cel planu testów
Celem niniejszego planu testów jest zdefiniowanie strategii, zakresu, zasobów i harmonogramu działań testowych dla aplikacji "Fiszki - Developer Learning Platform" (wersja 0.8.0 Beta). Plan ma na celu zapewnienie wysokiej jakości produktu poprzez wykrycie błędów, weryfikację zgodności z wymaganiami oraz ocenę ogólnej użyteczności i wydajności aplikacji.

#### Zakres testowania
Testowanie obejmie następujące obszary funkcjonalne i niefunkcjonalne:
*   **Funkcjonalności kluczowe:**
    *   Rejestracja i logowanie użytkowników (Supabase Auth).
    *   Generowanie fiszek z wykorzystaniem AI (interfejs, API, integracja z OpenRouter/Azure OpenAI).
    *   Ręczne tworzenie, przeglądanie, edycja i usuwanie fiszek (CRUD).
    *   System nauki oparty na algorytmie Spaced Repetition (SM-2).
    *   Obsługa statusów fiszek ('accepted', 'rejected', 'editing').
*   **Interfejs użytkownika (UI) i Doświadczenie użytkownika (UX):**
    *   Responsywność i spójność wyglądu na różnych urządzeniach i przeglądarkach.
    *   Intuicyjność nawigacji i przepływów użytkownika.
    *   Poprawność działania komponentów UI (Shadcn/ui).
    *   Przełączanie motywu (jasny/ciemny).
*   **Backend API:**
    *   Poprawność działania endpointów API (Astro API Routes).
    *   Walidacja danych wejściowych i formaty odpowiedzi.
    *   Obsługa błędów.
*   **Integracje:**
    *   Integracja z Supabase (baza danych, autentykacja, RLS).
    *   Integracja z API modeli językowych (OpenRouter/Azure OpenAI).
*   **Bezpieczeństwo:**
    *   Ochrona danych użytkownika (RLS).
    *   Autoryzacja dostępu do zasobów.
    *   Zabezpieczenia przed podstawowymi podatnościami webowymi (np. XSS, CSRF, jeśli dotyczy).
*   **Wydajność:**
    *   Czas odpowiedzi API.
    *   Czas ładowania kluczowych stron.
*   **Dostępność (a11y):**
    *   Podstawowa weryfikacja zgodności z WCAG.

**Poza zakresem (w tej fazie):**
*   Testy obciążeniowe na dużą skalę.
*   Zaawansowane testy penetracyjne.
*   Testy wsparcia dla wielu języków programowania w fiszkach (oznaczone jako "In Progress").
*   Testy panelu analitycznego (oznaczone jako "Planned").
*   Testy synchronizacji między urządzeniami (jako osobna, dedykowana funkcjonalność).

### 2. Strategia testowania

#### Typy testów do przeprowadzenia
*   **Testy jednostkowe (Unit Tests):**
    *   **Cel:** Weryfikacja poprawności działania małych, izolowanych fragmentów kodu (funkcje, komponenty React, moduły logiki biznesowej).
    *   **Zakres:** Funkcje pomocnicze (`src/lib/utils.ts`, `src/lib/validation.ts`), komponenty React (`src/components/*.tsx` - logika wewnętrzna, renderowanie warunkowe), serwisy (`src/lib/services/*` - mockując zależności zewnętrzne).
    *   **Narzędzia:** Vitest (lub Jest) z React Testing Library.
*   **Testy integracyjne (Integration Tests):**
    *   **Cel:** Weryfikacja współpracy między różnymi modułami i serwisami.
    *   **Zakres:**
        *   Frontend-Backend: Interakcja komponentów React z endpointami API Astro.
        *   Backend: Współdziałanie serwisów, middleware i bazy danych Supabase.
        *   Integracja z API AI: Poprawność wysyłania zapytań i parsowania odpowiedzi (z mockowanym API AI).
    *   **Narzędzia:** Vitest/Jest, Supertest (dla testów API backendu), MSW (Mock Service Worker) do mockowania API.
*   **Testy End-to-End (E2E Tests):**
    *   **Cel:** Weryfikacja kompletnych przepływów użytkownika w aplikacji, symulując rzeczywiste interakcje.
    *   **Zakres:** Rejestracja, logowanie, generowanie fiszki AI od tekstu do zapisania, pełen cykl CRUD dla fiszki, przejście przez sesję nauki.
    *   **Narzędzia:** Playwright lub Cypress.
*   **Testy API (Backend):**
    *   **Cel:** Bezpośrednia weryfikacja endpointów API pod kątem logiki, walidacji, obsługi błędów, bezpieczeństwa i kontraktu.
    *   **Zakres:** Wszystkie endpointy w `src/pages/api/`.
    *   **Narzędzia:** Postman, Insomnia, lub testy automatyczne z użyciem bibliotek typu Supertest/Axios w Node.js.
*   **Testy Akceptacyjne Użytkownika (UAT):**
    *   **Cel:** Potwierdzenie przez interesariuszy lub reprezentatywną grupę użytkowników, że aplikacja spełnia ich potrzeby i wymagania.
    *   **Zakres:** Kluczowe scenariusze użytkowania zdefiniowane wspólnie z Product Ownerem.
*   **Testy UI / Wizualne:**
    *   **Cel:** Zapewnienie spójności wizualnej, poprawności wyświetlania na różnych urządzeniach i przeglądarkach, weryfikacja responsywności.
    *   **Zakres:** Kluczowe widoki i komponenty, tryb ciemny/jasny.
    *   **Narzędzia:** Ręczne przeglądanie, narzędzia deweloperskie przeglądarek, opcjonalnie narzędzia do regresji wizualnej (np. Percy, Chromatic).
*   **Testy Bezpieczeństwa (podstawowe):**
    *   **Cel:** Weryfikacja podstawowych mechanizmów bezpieczeństwa.
    *   **Zakres:** Poprawność działania RLS w Supabase, ochrona endpointów API, walidacja danych wejściowych.
    *   **Narzędzia:** Ręczna weryfikacja, narzędzia deweloperskie przeglądarek, inspekcja zapytań.
*   **Testy Dostępności (a11y):**
    *   **Cel:** Sprawdzenie, czy aplikacja jest używalna dla osób z różnymi niepełnosprawnościami.
    *   **Zakres:** Nawigacja klawiaturą, kontrast, semantyka HTML, atrybuty ARIA.
    *   **Narzędzia:** Axe DevTools, Lighthouse, czytniki ekranu (VoiceOver, NVDA).

#### Narzędzia i środowiska testowe
*   **Frameworki testowe:** Vitest (preferowany ze względu na ekosystem Vite/Astro) lub Jest, React Testing Library.
*   **Narzędzia E2E:** Playwright (rekomendowany) lub Cypress.
*   **Testowanie API:** Postman/Insomnia, Supertest.
*   **Mockowanie:** MSW, wbudowane funkcje mockujące Vitest/Jest.
*   **CI/CD:** GitHub Actions (do uruchamiania testów automatycznych przy każdym push/PR).
*   **Środowiska:**
    *   **Lokalne środowisko deweloperskie:** Do tworzenia i uruchamiania testów.
    *   **Środowisko Staging/Testowe:** Odizolowane środowisko zbliżone do produkcyjnego, na którym będą przeprowadzane testy E2E i UAT. Powinno mieć własną instancję Supabase.
    *   **Przeglądarki:** Chrome, Firefox, Safari, Edge (najnowsze wersje).
    *   **Urządzenia:** Desktop, tablet, mobile (symulacja w przeglądarce oraz testy na rzeczywistych urządzeniach w miarę możliwości).

### 3. Harmonogram testów
*Harmonogram powinien być zintegrowany z cyklem rozwoju (np. sprintami w Agile). Poniżej ogólny zarys:*
*   **Faza Rozwoju Funkcjonalności:**
    *   Testy jednostkowe i integracyjne pisane równolegle z kodem.
    *   Testy API dla nowo tworzonych endpointów.
*   **Po Zakończeniu Implementacji Kluczowej Funkcjonalności / Sprintu:**
    *   Sesja testów E2E dla zrealizowanych przepływów.
    *   Testy UI i dostępności.
*   **Przed Wydaniem Wersji (np. 0.8.0 Beta -> 0.9.0):**
    *   Pełna regresja (automatyczna i manualna dla krytycznych ścieżek).
    *   Testy Akceptacyjne Użytkownika (UAT).
    *   Podstawowe testy bezpieczeństwa.
*   **Po Wydaniu (Hotfixy):**
    *   Testy potwierdzające poprawkę i regresja w obszarze zmiany.

### 4. Przypadki testowe (przynajmniej 5 wysokopoziomowych przypadków)

1.  **ID:** TC_AUTH_001
    *   **Nazwa:** Rejestracja i Logowanie Użytkownika
    *   **Opis:** Weryfikuje proces tworzenia nowego konta użytkownika oraz pomyślnego logowania.
    *   **Priorytet:** Krytyczny (P0)
    *   **Kroki:**
        1.  Przejdź na stronę rejestracji.
        2.  Wprowadź poprawne, unikalne dane (email, hasło).
        3.  Zatwierdź formularz rejestracji.
        4.  (Jeśli wymagana) Potwierdź email.
        5.  Przejdź na stronę logowania.
        6.  Wprowadź dane nowo zarejestrowanego użytkownika.
        7.  Zatwierdź formularz logowania.
    *   **Oczekiwany rezultat:**
        *   Konto zostaje pomyślnie utworzone.
        *   Użytkownik zostaje pomyślnie zalogowany i przekierowany na stronę główną/dashboard (np. `/generate`).
        *   Dane użytkownika są poprawnie zapisane w Supabase.

2.  **ID:** TC_AI_GEN_001
    *   **Nazwa:** Generowanie Fiszki przez AI
    *   **Opis:** Weryfikuje pełen przepływ generowania fiszek na podstawie tekstu dostarczonego przez użytkownika.
    *   **Priorytet:** Krytyczny (P0)
    *   **Kroki:**
        1.  Zaloguj się do aplikacji.
        2.  Przejdź na stronę generowania fiszek (np. `/generate`).
        3.  W polu tekstowym wprowadź tekst o długości między 1000 a 10000 znaków.
        4.  Kliknij przycisk "Generuj fiszki".
        5.  Poczekaj na odpowiedź z AI.
        6.  Zweryfikuj, czy lista proponowanych fiszek została wyświetlona.
        7.  Zaakceptuj kilka fiszek, odrzuć kilka, edytuj jedną.
        8.  Zapisz zaakceptowane/edytowane fiszki.
    *   **Oczekiwany rezultat:**
        *   Zapytanie do API AI (`/api/ai/generate`) jest wysyłane poprawnie.
        *   Odpowiedź AI jest poprawnie sparsowana i wyświetlona jako lista fiszek z opcjami.
        *   Rekord zapytania AI jest tworzony w tabeli `ai_requests`.
        *   Zaakceptowane/edytowane fiszki są poprawnie zapisywane w tabeli `flashcards` ze statusem 'accepted' lub 'editing' i powiązane z zalogowanym użytkownikiem.
        *   Odrzucone fiszki nie są zapisywane (lub są oznaczane jako 'rejected' jeśli taka logika istnieje).

3.  **ID:** TC_CRUD_001
    *   **Nazwa:** Zarządzanie Fiszkami (Ręczne Tworzenie, Edycja, Usuwanie)
    *   **Opis:** Weryfikuje możliwość ręcznego tworzenia, edycji i usuwania fiszek przez użytkownika.
    *   **Priorytet:** Krytyczny (P0)
    *   **Kroki:**
        1.  Zaloguj się do aplikacji.
        2.  Przejdź do sekcji zarządzania/tworzenia fiszek.
        3.  Utwórz nową fiszkę ręcznie, podając tekst przodu i tyłu. Zapisz ją.
        4.  Odnajdź nowo utworzoną fiszkę na liście.
        5.  Otwórz fiszkę do edycji, zmień jej treść i status. Zapisz zmiany.
        6.  Usuń fiszkę, potwierdzając operację.
    *   **Oczekiwany rezultat:**
        *   Nowa fiszka jest poprawnie tworzona i zapisywana w bazie danych (endpoint POST `/api/flashcards`).
        *   Zmiany w edytowanej fiszce są poprawnie zapisywane (endpoint `/api/flashcards/[id]/update`).
        *   Fiszka jest usuwana z bazy danych po potwierdzeniu (wymaga implementacji endpointu DELETE).
        *   Wszystkie operacje są wykonywane w kontekście zalogowanego użytkownika (RLS).

4.  **ID:** TC_STUDY_001
    *   **Nazwa:** Sesja Nauki z Algorytmem Spaced Repetition
    *   **Opis:** Weryfikuje działanie sesji nauki fiszek, w tym prezentację fiszek i (docelowo) logikę algorytmu SM-2.
    *   **Priorytet:** Krytyczny (P0)
    *   **Kroki:**
        1.  Zaloguj się do aplikacji. Upewnij się, że użytkownik ma kilka zaakceptowanych fiszek.
        2.  Przejdź na stronę nauki (np. `/study`).
        3.  Sprawdź, czy wyświetlana jest pierwsza fiszka (tylko przód).
        4.  Kliknij przycisk "Pokaż odpowiedź".
        5.  Oceń znajomość fiszki (np. "Trudne", "Średnie", "Łatwe").
        6.  Sprawdź, czy wyświetlana jest następna fiszka lub informacja o zakończeniu sesji.
        7.  Powtórz kroki 3-6 dla kilku fiszek.
    *   **Oczekiwany rezultat:**
        *   Fiszki są poprawnie prezentowane użytkownikowi.
        *   Interakcje użytkownika (pokaż odpowiedź, ocena) działają zgodnie z oczekiwaniami.
        *   (Docelowo) Logika algorytmu SM-2 poprawnie aktualizuje interwały powtórek dla fiszek.
        *   Postęp sesji jest śledzony.

5.  **ID:** TC_SECURITY_001
    *   **Nazwa:** Izolacja Danych Użytkownika (RLS)
    *   **Opis:** Weryfikuje, czy użytkownik ma dostęp tylko do swoich fiszek i zapytań AI.
    *   **Priorytet:** Krytyczny (P0)
    *   **Kroki:**
        1.  Zarejestruj i zaloguj się jako Użytkownik A.
        2.  Utwórz kilka fiszek i wygeneruj kilka zapytań AI.
        3.  Wyloguj się.
        4.  Zarejestruj i zaloguj się jako Użytkownik B.
        5.  Spróbuj uzyskać dostęp do fiszek Użytkownika A (np. poprzez bezpośrednie zapytanie API z ID fiszki Użytkownika A, lub weryfikując listę fiszek).
        6.  Spróbuj uzyskać dostęp do zapytań AI Użytkownika A.
    *   **Oczekiwany rezultat:**
        *   Użytkownik B nie może widzieć, edytować ani usuwać fiszek należących do Użytkownika A.
        *   Użytkownik B nie może widzieć zapytań AI należących do Użytkownika A.
        *   Wszelkie próby dostępu do danych innego użytkownika są blokowane przez RLS lub logikę aplikacji.
        *   **UWAGA:** Ten test wykryje problem z `DEFAULT_USER_ID` w niektórych częściach kodu.

### 5. Kryteria akceptacji
*   **Kryteria wejścia (rozpoczęcia testów):**
    *   Dostępna stabilna wersja aplikacji (build) na środowisku testowym.
    *   Dostępna dokumentacja (wymagania, specyfikacje API, jeśli istnieją).
    *   Przygotowane środowisko testowe (baza danych, konta testowe, mocki dla zewnętrznych API).
    *   Zakończone testy jednostkowe i podstawowe testy integracyjne przez zespół deweloperski.
*   **Kryteria wyjścia (zakończenia testów):**
    *   Wszystkie zaplanowane przypadki testowe zostały wykonane.
    *   Osiągnięto zdefiniowany poziom pokrycia testami (np. 80% dla krytycznych funkcjonalności).
    *   Wszystkie błędy o priorytecie Krytycznym (P0) i Wysokim (P1) zostały naprawione i retestowane.
    *   Liczba otwartych błędów o niższych priorytetach jest akceptowalna przez Product Ownera.
    *   Raport z testów został przygotowany i zaakceptowany.

### 6. Raportowanie błędów
*   **Narzędzie:** Jira, GitHub Issues lub inne dedykowane narzędzie do śledzenia błędów.
*   **Proces:**
    1.  Wykrycie błędu.
    2.  Reprodukcja błędu w celu potwierdzenia.
    3.  Zgłoszenie błędu w systemie, zawierające:
        *   Unikalny identyfikator.
        *   Tytuł (zwięzły opis problemu).
        *   Opis (szczegółowy opis, kroki do reprodukcji).
        *   Oczekiwany rezultat.
        *   Rzeczywisty rezultat.
        *   Środowisko (przeglądarka, system operacyjny, wersja aplikacji).
        *   Priorytet (np. Krytyczny, Wysoki, Średni, Niski).
        *   Dotkliwość (np. Blokujący, Poważny, Drobny, Kosmetyczny).
        *   Załączniki (zrzuty ekranu, logi, nagrania wideo).
    4.  Przypisanie błędu do dewelopera.
    5.  Naprawa błędu przez dewelopera.
    6.  Retestowanie błędu przez testera.
    7.  Zamknięcie błędu (jeśli naprawiony) lub ponowne otwarcie (jeśli nadal występuje).

### 7. Wymagania zasobów
*   **Ludzkie:**
    *   Inżynier QA / Tester (1-2 osoby).
    *   Deweloperzy (do naprawy błędów i wsparcia technicznego).
    *   Product Owner (do UAT i klaryfikacji wymagań).
*   **Sprzętowe i Programowe:**
    *   Komputery do testowania.
    *   Dostęp do różnych przeglądarek i urządzeń (lub symulatorów).
    *   Dostęp do narzędzi testowych (Playwright/Cypress, Postman, Jira itp.).
    *   Dostęp do środowisk testowych i deweloperskich.
    *   Klucze API do usług zewnętrznych (Supabase, OpenRouter/Azure AI) dla środowiska testowego.

### 8. Ryzyka i plany awaryjne
*   **Ryzyko:** Ograniczony czas na testy.
    *   **Plan awaryjny:** Priorytetyzacja testów, skupienie się na krytycznych funkcjonalnościach. Automatyzacja najbardziej powtarzalnych scenariuszy.
*   **Ryzyko:** Brak stabilnego środowiska testowego.
    *   **Plan awaryjny:** Współpraca z zespołem DevOps/deweloperskim w celu szybkiego ustabilizowania środowiska. Wykorzystanie lokalnych środowisk, jeśli to możliwe.
*   **Ryzyko:** Zmiany w wymaganiach w trakcie testów.
    *   **Plan awaryjny:** Elastyczne podejście do planu testów, regularna komunikacja z Product Ownerem, re-priorytetyzacja zadań.
*   **Ryzyko:** Problemy z integracją z zewnętrznymi API (AI, Supabase).
    *   **Plan awaryjny:** Przygotowanie mocków dla zewnętrznych usług, aby umożliwić testowanie niezależnie od ich dostępności. Eskalacja problemów do dostawców usług.
*   **Ryzyko:** Niewystarczające zasoby ludzkie.
    *   **Plan awaryjny:** Przeszkolenie dodatkowych osób, renegocjacja zakresu testów lub harmonogramu.
*   **Ryzyko:** Wysoka liczba krytycznych błędów uniemożliwiająca dalsze testy.
    *   **Plan awaryjny:** Wstrzymanie testów w danym obszarze, priorytetowa naprawa błędów blokujących, ponowne planowanie testów.
*   **Ryzyko:** Niewykrycie problemu z `DEFAULT_USER_ID` przed produkcją.
    *   **Plan awaryjny:** Dedykowane, wczesne testy bezpieczeństwa i RLS, code review skupione na obsłudze ID użytkownika. Jeśli problem zostanie wykryty późno, potraktowanie go jako błędu krytycznego (P0).