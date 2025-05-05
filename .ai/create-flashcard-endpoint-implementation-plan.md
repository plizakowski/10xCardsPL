# API Endpoint Implementation Plan: Tworzenie nowej fiszki

## 1. Przegląd punktu końcowego
Endpoint umożliwia tworzenie nowej fiszki przez użytkownika, zarówno w trybie manualnym, jak i z wykorzystaniem mechanizmu AI. Endpoint przyjmuje dane fiszki, weryfikuje je, zapisuje do bazy danych oraz zwraca utworzoną fiszkę.

## 2. Szczegóły żądania
- **Metoda HTTP**: POST
- **Struktura URL**: `/api/flashcards`
- **Parametry**:
  - **Wymagane w ciele żądania**:
    - `front_text`: Tekst pytania (od 1 do 4000 znaków)
    - `back_text`: Tekst odpowiedzi (od 1 do 4000 znaków)
    - `status`: Wartość statusu fiszki - jedna z: `zaakceptowane`, `odrzucone`, `w trakcie edycji`
  - **Opcjonalne**:
    - `source`: Obiekt źródła, zawierający:
      - `type`: Typ źródła - `manual`, `ai_full` lub `ai_edited`
      - `request_identifier`: Wymagany, gdy `type` to `ai_full` lub `ai_edited`
- **Request Body Example**:
```json
{
  "front_text": "Pytanie na przedniej stronie fiszki",
  "back_text": "Odpowiedź na tylnej stronie fiszki",
  "status": "zaakceptowane",
  "source": {
    "type": "manual",
    "request_identifier": "opcjonalnie_wymagany_dla_ai_full_i_ai_edited"
  }
}
```

## 3. Wykorzystywane typy
- **DTO i Command Modele**:
  - `CreateFlashcardCommand` – Model przyjmowany przez endpoint, zawierający `front_text`, `back_text`, `status` oraz opcjonalnie `source`.
  - `CreateFlashcardResponseDTO` – Model odpowiedzi zawierający identyfikator (`id`), `front_text`, `back_text`, `status` oraz `source`.

## 4. Szczegóły odpowiedzi
- **Sukces (201 Created)**:
```json
{
  "id": "uuid",
  "front_text": "Pytanie na przedniej stronie fiszki",
  "back_text": "Odpowiedź na tylnej stronie fiszki",
  "status": "zaakceptowane",
  "source": {
    "type": "manual",
    "request_identifier": "string"
  }
}
```
- **Błędy**:
  - 400 Bad Request – Nieprawidłowe dane (np. brak wymaganych pól, przekroczenie limitów znaków, brak `request_identifier` dla typów AI)
  - 401 Unauthorized – Użytkownik nie jest uwierzytelniony
  - 500 Internal Server Error – Błąd po stronie serwera

## 5. Przepływ danych
1. **Przyjęcie żądania**: Endpoint odbiera żądanie POST zawierające dane fiszki.
2. **Weryfikacja autoryzacji**: Sprawdzenie użytwni będzie zaimplementowana óźniej z wyrzystaniem mechanizmów Supabase..
3. **Walidacja danych**: Sprawdzenie, czy pola `front_text`, `back_text` oraz `status` są obecne i mieszczą się w określonych limitach znaków. Jeśli `source` jest podane i jego `type` wskazuje na wykorzystanie AI, weryfikacja obecności `request_identifier`.
4. **Przetwarzanie danych**: Wywołanie logiki biznesowej (serwis) odpowiedzialnej za tworzenie nowej fiszki:
   - Utworzenie rekordu w tabeli `flashcards` z wygenerowanym `id` oraz przypisaniem `user_id` aktualnego użytkownika.
   - Ewentualne logowanie informacji w tabeli `ai_requests` w przypadku danych generowanych przez AI.
5. **Odpowiedź**: Zwrócenie danych nowo utworzonej fiszki z kodem 201 Created.

## 6. Względy bezpieczeństwa
- **RLS (Row Level Security)**: Zapewnienie, że użytkownik może operować jedynie na swoich fiszkach poprzez odpowiednie polityki dostępu w tabeli `flashcards`.
- **Walidacja danych wejściowych**: Zapewnienie, że przekazane dane spełniają wymagania długościowe oraz typ logiczny, aby zapobiec atakom np. SQL Injection lub wstrzyknięciom HTML.

## 7. Obsługa błędów
- **400 Bad Request**: Gdy dane wejściowe są nieprawidłowe (np. brak obowiązkowych pól, nieprawidłowy format danych).
- **401 Unauthorized**: Brak lub nieprawidłowy token autoryzacyjny.
- **500 Internal Server Error**: Błąd podczas przetwarzania operacji lub problem z bazą danych.
- **Logowanie błędów**: Błędy serwera powinny być logowane (np. przy użyciu dedykowanego loggera) aby umożliwić dalszą analizę.

## 8. Etapy wdrożenia
1. **Projektowanie i przygotowanie**:
   - Zdefiniowanie schematu bazy danych dla tabel `flashcards` oraz `ai_requests`.
   - Określenie polityk RLS dla tabeli `flashcards`.
2. **Implementacja kontrolera API**:
   - Utworzenie endpointu POST `/api/flashcards` w kontrolerze.
   - Integracja z mechanizmem autoryzacji (sprawdzenie tokenu JWT).
3. **Walidacja danych**:
   - Implementacja walidacji danych wejściowych zgodnie z wymaganiami (np. używając bibliotek walidacyjnych lub customowych funkcji).
4. **Implementacja logiki biznesowej**:
   - Wydzielenie logiki tworzenia fiszki do dedykowanego serwisu (np. `FlashcardService`).
   - Obsługa logiki specyficznej dla fiszek tworzonych z wykorzystaniem AI, w tym weryfikacja pola `request_identifier` i ewentualne logowanie do tabeli `ai_requests`.
5. **Obsługa błędów i logowanie**:
   - Implementacja mechanizmu obsługi wyjątków, który zwraca odpowiednie kody błędów i loguje krytyczne informacje.

---

Plan ten ma na celu zapewnienie, że endpoint tworzenia fiszki zostanie wdrożony w sposób bezpieczny, efektywny i zgodny z wymaganiami biznesowymi oraz technologicznymi obowiązującymi w projekcie. 