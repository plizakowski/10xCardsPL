# API Endpoint Implementation Plan: Pobieranie listy fiszek

## 1. Przegląd punktu końcowego
Endpoint umożliwia zalogowanemu użytkownikowi pobranie listy jego fiszek. Wyniki są zwracane w formie listy obiektów zawierających detale fiszki oraz szczegółowy obiekt paginacji.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** `/api/flashcards`
- **Parametry zapytania:**
  - **Wymagane:** Brak parametrów wymaganych.
  - **Opcjonalne:**
    - `status` - filtruje wyniki po statusie fiszki, możliwe wartości: `zaakceptowane`, `odrzucone`, `w trakcie edycji`.
    - `page` - numer strony, domyślnie `1`.
    - `limit` - liczba wyników na stronę, domyślnie `20`.
    - `sort` - pole sortowania, domyślnie ustawione na najnowsze (np. sortowanie malejąco po id lub innym polu, jeżeli zostanie dodane pole daty).

## 3. Wykorzystywane typy
- `FlashcardDTO` – podstawowe informacje o fiszce (id, front_text, back_text, status).
- `FlashcardResponseDTO` – rozszerza `FlashcardDTO` o opcjonalne informacje o źródle fiszki.
- `PaginationDTO` – informacje o paginacji: total, page, limit, pages.
- `GetFlashcardsResponseDTO` – struktura odpowiedzi zawierająca listę fiszek oraz obiekt paginacji.

## 4. Szczegóły odpowiedzi
- **Kod odpowiedzi:** 200 OK (w przypadku sukcesu)
- **Struktura odpowiedzi:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "front_text": "Pytanie na przedniej stronie fiszki",
        "back_text": "Odpowiedź na tylnej stronie fiszki",
        "status": "zaakceptowane"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
  ```
- **Kody błędów:**
  - 401 Unauthorized – gdy użytkownik nie jest uwierzytelniony.
  - 400 Bad Request – przy nieprawidłowych danych wejściowych.
  - 500 Internal Server Error – w przypadku błędów serwera.

## 5. Przepływ danych
1. Klient wysyła żądanie GET do `/api/flashcards` z opcjonalnymi parametrami.
2. Po stronie serwera wykonywana jest weryfikacja uwierzytelnienia użytkownika.
3. Parametry zapytania są walidowane i przekształcane (domyślne wartości dla `page`, `limit`, itp.).
4. Na podstawie `user_id` (pobrane z tokena lub sesji) wykonywane jest zapytanie do tabeli `flashcards`, uwzględniając filtry, paginację oraz ewentualne sortowanie.
5. Wyniki zapytania są mapowane do DTO (`FlashcardResponseDTO`) i dołączany jest obiekt `PaginationDTO`.
6. Wynikowa struktura danych jest zwracana do klienta w formacie JSON.

## 6. Względy bezpieczeństwa
- Endpoint wymaga autoryzacji; tylko zalogowani użytkownicy mogą uzyskać dostęp.
- Zastosowanie RLS na tabeli `flashcards` gwarantuje, że użytkownik widzi tylko swoje dane.
- Walidacja parametrów wejściowych chroni przed SQL Injection oraz innymi atakami.
- Odpowiednie zarządzanie błędami uniemożliwia ujawnienie wrażliwych informacji.

## 7. Obsługa błędów
- **401 Unauthorized:** Gdy użytkownik nie jest poprawnie uwierzytelniony.
- **400 Bad Request:** W przypadku niepoprawnych danych wejściowych (np. nieprawidłowa wartość `status`, `page` lub `limit`).
- **500 Internal Server Error:** Dla nieoczekiwanych błędów serwera; zalecane logowanie szczegółowych informacji błędu wewnętrznie.

## 8. Rozważania dotyczące wydajności
- Wykorzystanie indeksu na kolumnie `user_id` w tabeli `flashcards` usprawnia wyszukiwanie.
- Paginacja z wykorzystaniem limit i offset minimalizuje ilość przetwarzanych danych.
- Możliwość dodania cache'owania wyników przy wysokim obciążeniu.

## 9. Etapy wdrożenia
1. Utworzenie endpointu `/api/flashcards` obsługującego metodę GET.
2. Implementacja middleware do weryfikacji autoryzacji użytkownika.
3. Walidacja parametrów zapytania (`status`, `page`, `limit`, `sort`).
4. Implementacja warstwy usługowej (service layer) do komunikacji z bazą danych, korzystając z istniejącego lub nowego serwisu.
5. Implementacja logiki paginacji, filtrowania i sortowania.
6. Mapowanie wyników bazy danych do odpowiednich DTO.
7. Obsługa wyjątków i logowanie błędów.