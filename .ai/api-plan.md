# Plan REST API

## 1. Zasoby
- **Użytkownicy (users)** - Zarządzani przez Supabase Auth
- **Fiszki (flashcards)** - Przechowują dane fiszek edukacyjnych 
- **Zapytania AI (ai_requests)** - Przechowują informacje o zapytaniach do AI

## 2. Punkty końcowe

### Autentykacja
*Uwaga: Wykorzystujemy gotowe endpointy Supabase Auth*


### Fiszki

#### Pobieranie listy fiszek
- **Metoda:** GET
- **Ścieżka:** `/api/flashcards`
- **Opis:** Zwraca listę fiszek zalogowanego użytkownika
- **Parametry zapytania:**
  - `status` (opcjonalny) - filtrowanie po statusie ('zaakceptowane', 'odrzucone', 'w trakcie edycji')
  - `page` (opcjonalny) - numer strony (domyślnie 1)
  - `limit` (opcjonalny) - liczba wyników na stronę (domyślnie 20)
  - `sort` (opcjonalny) - pole sortowania (domyślnie najnowsze)
- **Odpowiedź:**
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
- **Kody powodzenia:** 200 OK
- **Kody błędów:** 401 Unauthorized, 500 Internal Server Error

#### Pobieranie pojedynczej fiszki
- **Metoda:** GET
- **Ścieżka:** `/api/flashcards/{id}`
- **Opis:** Zwraca szczegóły pojedynczej fiszki
- **Odpowiedź:**
  ```json
  {
    "id": "uuid",
    "front_text": "Pytanie na przedniej stronie fiszki",
    "back_text": "Odpowiedź na tylnej stronie fiszki",
    "status": "zaakceptowane"
  }
  ```
- **Kody powodzenia:** 200 OK
- **Kody błędów:** 401 Unauthorized, 404 Not Found, 500 Internal Server Error

#### Tworzenie nowej fiszki
- **Metoda:** POST
- **Ścieżka:** `/api/flashcards`
- **Opis:** Tworzy nową fiszkę (ręcznie lub przez AI)
- **Struktura żądania:**
  ```json
  {
    "front_text": "Pytanie na przedniej stronie fiszki",
    "back_text": "Odpowiedź na tylnej stronie fiszki",
    "status": "zaakceptowane",
    "source": {
      "type": "manual" | "ai_full" | "ai_edited",
      "request_identifier": "string" // wymagane dla ai_full i ai_edited
    }
  }
  ```
- **Odpowiedź:**
  ```json
  {
    "id": "uuid",
    "front_text": "Pytanie na przedniej stronie fiszki",
    "back_text": "Odpowiedź na tylnej stronie fiszki",
    "status": "zaakceptowane",
    "source": {
      "type": "manual" | "ai_full" | "ai_edited",
      "request_identifier": "string"
    }
  }
  ```
- **Kody powodzenia:** 201 Created
- **Kody błędów:** 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

#### Masowe tworzenie fiszek
- **Metoda:** POST
- **Ścieżka:** `/api/flashcards/batch`
- **Opis:** Tworzy wiele fiszek na raz (np. z generowanych propozycji AI)
- **Struktura żądania:**
  ```json
  {
    "flashcards": [
      {
        "front_text": "Pytanie 1",
        "back_text": "Odpowiedź 1",
        "status": "zaakceptowane"
      },
      {
        "front_text": "Pytanie 2",
        "back_text": "Odpowiedź 2",
        "status": "zaakceptowane"
      }
    ]
  }
  ```
- **Odpowiedź:**
  ```json
  {
    "success": true,
    "created": 2,
    "flashcards": [
      {
        "id": "uuid1",
        "front_text": "Pytanie 1",
        "back_text": "Odpowiedź 1",
        "status": "zaakceptowane"
      },
      {
        "id": "uuid2",
        "front_text": "Pytanie 2",
        "back_text": "Odpowiedź 2",
        "status": "zaakceptowane"
      }
    ]
  }
  ```
- **Kody powodzenia:** 201 Created
- **Kody błędów:** 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

#### Aktualizacja fiszki
- **Metoda:** PUT
- **Ścieżka:** `/api/flashcards/{id}`
- **Opis:** Aktualizuje istniejącą fiszkę
- **Struktura żądania:**
  ```json
  {
    "front_text": "Zaktualizowane pytanie",
    "back_text": "Zaktualizowana odpowiedź",
    "status": "zaakceptowane"
  }
  ```
- **Odpowiedź:**
  ```json
  {
    "id": "uuid",
    "front_text": "Zaktualizowane pytanie",
    "back_text": "Zaktualizowana odpowiedź",
    "status": "zaakceptowane"
  }
  ```
- **Kody powodzenia:** 200 OK
- **Kody błędów:** 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

#### Usuwanie fiszki
- **Metoda:** DELETE
- **Ścieżka:** `/api/flashcards/{id}`
- **Opis:** Usuwa fiszkę
- **Odpowiedź:**
  ```json
  {
    "success": true,
    "message": "Fiszka została pomyślnie usunięta"
  }
  ```
- **Kody powodzenia:** 200 OK
- **Kody błędów:** 401 Unauthorized, 404 Not Found, 500 Internal Server Error

### Generowanie AI

#### Generowanie propozycji fiszek
- **Metoda:** POST
- **Ścieżka:** `/api/ai/generate`
- **Opis:** Generuje propozycje fiszek na podstawie podanego tekstu
- **Struktura żądania:**
  ```json
  {
    "text": "Tekst źródłowy do analizy przez AI (od 1000 do 10000 znaków)"
  }
  ```
- **Odpowiedź:**
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
- **Kody powodzenia:** 200 OK
- **Kody błędów:** 400 Bad Request, 401 Unauthorized, 429 Too Many Requests, 500 Internal Server Error

### Sesja nauki

#### Rozpoczęcie sesji nauki
- **Metoda:** GET
- **Ścieżka:** `/api/study/session`
- **Opis:** Inicjalizuje nową sesję nauki i zwraca pierwszą fiszkę
- **Odpowiedź:**
  ```json
  {
    "session_id": "uuid",
    "current_flashcard": {
      "id": "uuid",
      "front_text": "Pytanie na przedniej stronie fiszki",
      "back_text": "Odpowiedź na tylnej stronie fiszki"
    },
    "total_cards": 10,
    "progress": 1
  }
  ```
- **Kody powodzenia:** 200 OK
- **Kody błędów:** 401 Unauthorized, 404 Not Found (brak fiszek), 500 Internal Server Error

#### Ocena fiszki i pobranie następnej
- **Metoda:** POST
- **Ścieżka:** `/api/study/flashcard/{id}/answer`
- **Opis:** Zapisuje ocenę fiszki i zwraca następną fiszkę w sesji
- **Struktura żądania:**
  ```json
  {
    "session_id": "uuid",
    "score": 3  // Ocena zapamiętania (wartość zależna od użytego algorytmu spaced repetition)
  }
  ```
- **Odpowiedź:**
  ```json
  {
    "session_id": "uuid",
    "current_flashcard": {
      "id": "uuid",
      "front_text": "Kolejne pytanie",
      "back_text": "Kolejna odpowiedź"
    },
    "total_cards": 10,
    "progress": 2,
    "is_completed": false
  }
  ```
- **Kody powodzenia:** 200 OK
- **Kody błędów:** 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

### Statystyki

#### Statystyki generowania AI
- **Metoda:** GET
- **Ścieżka:** `/api/statistics/ai-generations`
- **Opis:** Zwraca statystyki generowania fiszek przez AI
- **Odpowiedź:**
  ```json
  {
    "total_generations": 15,
    "total_generated_flashcards": 150,
    "accepted_flashcards": 120,
    "rejected_flashcards": 30,
    "acceptance_rate": 80
  }
  ```
- **Kody powodzenia:** 200 OK
- **Kody błędów:** 401 Unauthorized, 500 Internal Server Error

## 3. Uwierzytelnianie i autoryzacja

### Mechanizm uwierzytelniania
- Wykorzystanie Supabase Auth do uwierzytelniania użytkowników
- JWT (JSON Web Tokens) jako mechanizm zarządzania sesjami
- Tokeny przesyłane w nagłówku `Authorization: Bearer <token>`

### Autoryzacja
- Zapytania do API wymagają ważnego tokenu JWT
- Zasady RLS (Row Level Security) w Supabase zapewniają, że każdy użytkownik ma dostęp tylko do swoich danych
- Dodatkowa weryfikacja po stronie API dla potwierdzenia, że użytkownik ma dostęp do danego zasobu

## 4. Walidacja i logika biznesowa

### Walidacja
- **Fiszki:**
  - `front_text` i `back_text`: Wymagane, od 1 do 4000 znaków
  - `status`: Musi być jedną z dozwolonych wartości: 'zaakceptowane', 'odrzucone', 'w trakcie edycji'

- **Generowanie AI:**
  - `text`: Wymagane, od 1000 do 10000 znaków

### Logika biznesowa
- **Generowanie fiszek:**
  - Tekst wejściowy jest analizowany przez model LLM poprzez openrouter.ai
  - Wygenerowane fiszki otrzymują status 'w trakcie edycji'
  - Informacje o zapytaniu są zapisywane w tabeli `ai_requests`

- **Sesja nauki:**
  - Wykorzystanie zewnętrznej biblioteki do algorytmu spaced repetition
  - Fiszki są prezentowane użytkownikowi zgodnie z harmonogramem powtórek
  - Wyniki ocen są wykorzystywane do planowania kolejnych powtórek

- **Statystyki:**
  - Zliczanie generowanych i zaakceptowanych fiszek
  - Obliczanie współczynnika akceptacji 