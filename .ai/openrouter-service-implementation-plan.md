# Przewodnik implementacji usługi OpenRouter

## 1. Opis usługi
Usługa OpenRouter integruje aplikację z interfejsem API OpenRouter w celu generowania odpowiedzi chatowych przy użyciu modeli LLM. 
Usługa przetwarza komunikaty systemowe oraz użytkownika, wysyła właściwie sformatowane zapytania do API, a następnie przetwarza i waliduje otrzymane odpowiedzi, zapewniając ustrukturyzowane dane wyjściowe zgodne ze zdefiniowanym schematem JSON.

## 2. Opis konstruktora
Konstruktor usługi odpowiada za inicjalizację konfiguracji:
- Pobieranie klucza API (np. OPENROUTER_API_KEY) oraz innych zmiennych środowiskowych.
- Ustawienie domyślnego endpointu API oraz parametrów modelu.
- Inicjalizacja systemu logowania oraz mechanizmów retry dla komunikacji z API.

## 3. Publiczne metody i pola
**Publiczne metody:**
1. `sendChat(message: string): Promise<Response>` - wysyła komunikat użytkownika do API.
2. `setModelConfig(config: ModelConfig): void` - aktualizuje konfigurację wywołania modelu.
3. `updateSystemPrompt(prompt: string): void` - umożliwia zmianę komunikatu systemowego.

**Publiczne pola:**
1. `modelName: string` - nazwa modelu używanego do generacji odpowiedzi (np. "gpt-4").
2. `systemPrompt: string` - komunikat systemowy definiujący kontekst działania modelu.
3. `responseFormat: object` - schemat struktury odpowiedzi, np.:
   ```
   { type: 'json_schema', json_schema: { name: 'chat_response', strict: true, schema: { message: { type: 'string' }, meta: { type: 'object', properties: { source: { type: 'string' } } } } } }
   ```
4. `modelParameters: object` - zestaw parametrów modelu (temperature, max_tokens, etc.).

## 4. Prywatne metody i pola
**Prywatne metody:**
1. `_preparePayload(systemMsg: string, userMsg: string): object` - przygotowuje poprawny format zapytania zgodnie z wymaganiami API.
2. `_handleResponse(response: any): object` - przetwarza i waliduje odpowiedź pobraną z API.
3. `_validateResponseSchema(response: object): boolean` - sprawdza, czy odpowiedź spełnia określony schemat JSON.
4. `_logError(error: any): void` - loguje błędy wewnętrzne usługi.

**Prywatne pola:**
1. `_apiEndpoint: string` - adres endpointu API OpenRouter.
2. `_timeout: number` - maksymalny czas oczekiwania na odpowiedź API.
3. `_internalLogger: any` - instancja loggera dla celów monitorujących.

## 5. Obsługa błędów
**Przykładowe scenariusze błędów:**
1. Błąd połączenia lub timeout:
   - Problem: Brak odpowiedzi API lub opóźnienia.
   - Rozwiązanie: Wdrożenie mechanizmu ponawiania zapytania (retry), limitowanie liczby prób oraz logowanie zdarzenia.
2. Niezgodna odpowiedź z oczekiwanym schematem:
   - Problem: Odpowiedź nie spełnia kryteriów `responseFormat`.
   - Rozwiązanie: Walidacja odpowiedzi, fallback na komunikat błędu oraz alertowanie odpowiedzialnych zespołów.
3. Błąd autentykacji:
   - Problem: Nieprawidłowy lub wygasły klucz API.
   - Rozwiązanie: Weryfikacja klucza API podczas inicjalizacji, natychmiastowa reakcja oraz przekierowanie do mechanizmu odnawiania klucza.

## 6. Kwestie bezpieczeństwa
1. Bezpieczne przechowywanie kluczy API w plikach konfiguracyjnych (np. `.env`) i ograniczenie dostępu do nich.
2. Walidacja oraz sanityzacja danych wejściowych od użytkownika, aby zapobiec atakom typu injection.
3. Zabezpieczenie komunikacji z API poprzez stosowanie HTTPS i odpowiednich certyfikatów.
4. Monitorowanie logów oraz wdrażanie mechanizmów wykrywania oraz reagowania na nieautoryzowane próby dostępu.

## 7. Plan wdrożenia krok po kroku
1. **Konfiguracja środowiska:**
   - Skonfigurowanie pliku `.env` z kluczowymi zmiennymi (np. `OPENROUTER_API_KEY`).
   - Instalacja zależności oraz ustawienie konfiguracji projektu zgodnie z używanym stackiem (Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui).

2. **Implementacja modułu klienta API:**
   - Utworzenie dedykowanego modułu/klasy do komunikacji z OpenRouter API.
   - Implementacja funkcji `_preparePayload`, która łączy:
     1. **Komunikat systemowy:** np. "Jesteś inteligentnym i pomocnym asystentem."
     2. **Komunikat użytkownika:** np. "Opisz najnowsze wiadomości."
     3. **Ustrukturyzowana odpowiedź (response_format):** 
        ```
        { type: 'json_schema', json_schema: { name: 'chat_response', strict: true, schema: { message: { type: 'string' }, meta: { type: 'object', properties: { source: { type: 'string' } } } } } }
        ```
     4. **Nazwa modelu:** np. "gpt-4".
     5. **Parametry modelu:** np. `{ temperature: 0.7, max_tokens: 1000, top_p: 0.9, frequency_penalty: 0, presence_penalty: 0 }`.

3. **Integracja modułu klienta z interfejsem aplikacji:**
   - Połączenie nowo utworzonej usługi z istniejącym systemem czatu.
   - Eksponowanie publicznych metod w interfejsie użytkownika.



4. **Implementacja logowania i monitoringu:**
   - Dodanie mechanizmów logowania wszystkich błędów i zdarzeń.
   - Konfiguracja alertów na wypadek krytycznych błędów (np. utrata łączności z API).
