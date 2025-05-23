# Schemat bazy danych PostgreSQL dla projektu 10x-cards

## Tabele

### 1. Tabela: users

Ta tabela jest zarządzana przez Supabase Auth

- **id**: UUID, PRIMARY KEY, domyślnie generowane przez funkcję `gen_random_uuid()`
- **email**: VARCHAR(255), NOT NULL, UNIQUE

_Uwaga_: Minimalny schemat zawierający wyłącznie unikalny adres e-mail.

### 2. Tabela: flashcards

- **id**: UUID, PRIMARY KEY, domyślnie generowane przez funkcję `gen_random_uuid()`
- **user_id**: UUID, NOT NULL, REFERENCES users(id) ON DELETE CASCADE
- **front_text**: VARCHAR(4000), NOT NULL
- **back_text**: VARCHAR(4000), NOT NULL
- **status**: ENUM (typ: flashcard_status) z wartościami: 'zaakceptowane', 'odrzucone', 'w trakcie edycji'

_Uwaga_: Tabela nie zawiera pól dat (np. created_at, updated_at). Polityki RLS (Row Level Security) zostaną zaimplementowane wyłącznie dla tej tabeli.

**Indeksy**:

- Indeks na kolumnie `user_id` dla optymalizacji wyszukiwania.

### 3. Tabela: ai_requests

- **id**: UUID, PRIMARY KEY, domyślnie generowane przez funkcję `gen_random_uuid()` (odpowiada identyfikatorowi zapytania)
- **user_id**: UUID, NOT NULL, REFERENCES users(id) ON DELETE CASCADE
- **request_identifier**: TEXT, NOT NULL
- **source_text**: TEXT, NOT NULL

**Indeksy**:

- Indeks na kolumnie `user_id`.

## Relacje między tabelami

- Relacja jeden-do-wielu między `users` a `flashcards` (jeden użytkownik może mieć wiele fiszek).
- Relacja jeden-do-wielu między `users` a `ai_requests` (jeden użytkownik może mieć wiele zapytań do AI).

## Indeksy

- Tabela `flashcards`: indeks na kolumnie `user_id`.
- Tabela `ai_requests`: indeks na kolumnie `user_id` (opcjonalnie, dla zwiększenia wydajności zapytań).

## Zasady RLS (Row Level Security) dla tabeli flashcards

Aby zapewnić, że użytkownik ma dostęp wyłącznie do swoich fiszek, należy:

1. Włączyć RLS dla tabeli `flashcards`:

   ```sql
   ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
   ```

2. Utworzyć politykę zabezpieczeń, która zezwala na dostęp tylko do rekordów, gdzie `user_id` odpowiada identyfikatorowi bieżącego użytkownika (przykładowo, wykorzystując ustawienie konfiguracyjne aplikacji):
   ```sql
   CREATE POLICY user_flashcards_policy ON flashcards
     USING (user_id = current_setting('app.current_user_id')::uuid);
   ```

## Dodatkowe uwagi

- Wszystkie klucze główne są tworzone za pomocą funkcji PostgreSQL `gen_random_uuid()`.
- Ograniczenie długości tekstu w kolumnach `front_text` oraz `back_text` do 4000 znaków zapewnia integralność danych.
- Schemat został zaprojektowany z myślą o skalowalności, optymalizacji wydajności oraz bezpieczeństwie, zgodnie z wymaganiami MVP.
