# API Endpoint Implementation Plan: AI Flashcards Generation Endpoint

## 1. Przegląd punktu końcowego
Endpoint umożliwia generowanie propozycji fiszek na podstawie dostarczonego tekstu. Wdrożenie obejmuje integrację z zewnętrzną usługą AI oraz zapis wyników do bazy danych (tabele: flashcards, ai_requests).

## 2. Szczegóły żądania
- Metoda HTTP: POST
- URL: /api/ai/generate
- Parametry:
  - Wymagane:
    - Body:
      - text: Tekst źródłowy do analizy przez AI (od 1000 do 10000 znaków)
  - Opcjonalne: brak

## 3. Wykorzystywane typy
- GenerateFlashcardsCommand (pole: text) zdefiniowany w `src/types.ts`
- GenerateFlashcardsResponseDTO, zawierający:
  - request_id: string
  - flashcards: Array obiektów typu FlashcardDTO (z polami: front_text, back_text, status)

## 4. Szczegóły odpowiedzi
- Kody sukcesu:
  - 200 OK – Pomyślne zwrócenie wygenerowanych fiszek
- Struktura odpowiedzi:
  ```json
  {
    "request_id": "uuid",
    "flashcards": [
      {
        "front_text": "Wygenerowane pytanie 1",
        "back_text": "Wygenerowana odpowiedź 1",
        "status": "w trakcie edycji"
      },
      {
        "front_text": "Wygenerowane pytanie 2",
        "back_text": "Wygenerowana odpowiedź 2",
        "status": "w trakcie edycji"
      }
    ]
  }
  ```
- Kody błędów:
  - 400 Bad Request – Nieprawidłowe dane wejściowe
  - 401 Unauthorized – Brak autoryzacji użytkownika
  - 429 Too Many Requests – Przekroczenie limitu żądań
  - 500 Internal Server Error – Błąd po stronie serwera

## 5. Przepływ danych
1. Klient wysyła żądanie POST `/api/ai/generate` z polem `text` w ciele żądania.
2. Endpoint waliduje dane wejściowe (sprawdzenie długości tekstu oraz formatu) za pomocą narzędzia takiego jak Zod.
3. Weryfikacja autoryzacji użytkownika przy użyciu mechanizmu Supabase.
4. Wywołanie warstwy serwisowej (np. `src/lib/services/aiGenerationService.ts`), która:
   - Rejestruje zapytanie w tabeli `ai_requests` z unikalnym `request_identifier`.
   - Przekazuje żądanie do zewnętrznej usługi AI (np. OpenRouter) w celu generacji propozycji fiszek.
5. Wygenerowane fiszki są zapisywane w tabeli `flashcards` z odpowiednim `user_id` i statusem ustawionym na "w trakcie edycji".
6. Endpoint zwraca odpowiedź JSON zawierającą `request_id` oraz listę wygenerowanych fiszek.

## 6. Względy bezpieczeństwa
- Uwierzytelnienie: Endpoint dostępny tylko dla zalogowanych użytkowników przy użyciu Supabase.
- Walidacja danych wejściowych: Upewnienie się, że `text` mieści się w zakresie 1000-10000 znaków.
- Zastosowanie RLS (Row Level Security) w tabelach `flashcards` i `ai_requests`, aby chronić dane przed nieautoryzowanym dostępem.
- Implementacja ograniczenia liczby żądań (rate limiting) aby zapobiec nadużyciom.

## 7. Obsługa błędów
- 400 Bad Request: W przypadku błędów walidacji danych wejściowych (np. nieprawidłowa długość tekstu).
- 401 Unauthorized: Gdy użytkownik nie jest uwierzytelniony lub token jest nieprawidłowy.
- 429 Too Many Requests: Jeśli przekroczony zostanie limit żądań.
- 500 Internal Server Error: W przypadku nieoczekiwanych błędów, np. błędy w integracji z usługą AI lub problem z bazą danych.
- Błędy powinny być logowane (np. przy użyciu Sentry lub innego systemu logowania) dla dalszej analizy.

## 8. Rozważania dotyczące wydajności
- Użycie indeksów na kolumnie `user_id` w tabelach `flashcards` oraz `ai_requests` dla optymalizacji wyszukiwania.
- Asynchroniczne przetwarzanie żądań do usługi AI, aby endpoint zachował responsywność.
- Monitorowanie obciążenia serwera oraz optymalizacja połączeń z bazą danych w przypadku dużej liczby żądań.

## 9. Kroki implementacji
1. Utworzenie pliku endpointu: `src/pages/api/ai/generate.ts` zgodnie z architekturą Astro.
2. Implementacja walidacji danych wejściowych przy użyciu Zod, sprawdzającej długość tekstu oraz poprawność struktury żądania.
3. Weryfikacja autoryzacji użytkownika poprzez mechanizmy Supabase.
4. Wyodrębnienie logiki generowania fiszek do modułu serwisowego (np. `src/lib/services/aiGenerationService.ts`).
5. Integracja z usługą AI (np. OpenRouter) w celu generowania treści fiszek.
6. Rejestracja zapytania w tabeli `ai_requests` oraz zapis wygenerowanych fiszek do tabeli `flashcards`.
7. Implementacja mechanizmu obsługi błędów i zwracania odpowiednich kodów statusu.

