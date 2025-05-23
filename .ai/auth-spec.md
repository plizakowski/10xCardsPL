# Specyfikacja Modułu Autentykacji

## 1. Architektura Interfejsu Użytkownika

### Nowe strony i layouty

- Utworzenie dedykowanych stron dla rejestracji, logowania i odzyskiwania hasła, np.:
  - `/register` – strona rejestracji
  - `/login` – strona logowania
  - `/forgot-password` – strona odzyskiwania hasła
- Rozdzielenie layoutów na tryb autoryzowany (auth) i nieautoryzowany (non-auth), gdzie strony publiczne korzystają z prostego layoutu, a strony wymagające autoryzacji posiadają dodatkowe zabezpieczenia i elementy nawigacyjne.

### Integracja Astora z React

- Strony Astro odpowiadają za statyczne generowanie treści, routing i podstawowy rendering.
- Kluczowe elementy interfejsu (formularze rejestracji, logowania i odzyskiwania hasła) zostaną wdrożone jako komponenty React osadzone w stronach Astro, korzystające z biblioteki Shadcn/ui oraz stylowane przy pomocy Tailwind CSS.

### Komponenty interaktywne

- Formularz Rejestracji:

  - Pola: adres e-mail, hasło (oraz ewentualnie pole potwierdzenia hasła).
  - Walidacja po stronie klienta: poprawność formatu e-mail, minimalna długość hasła, zgodność haseł.
  - Wyświetlanie komunikatów o błędach (np. "Nieprawidłowy format adresu e-mail", "Hasło musi mieć minimum 6 znaków").

- Formularz Logowania:

  - Pola: adres e-mail, hasło.
  - Walidacja: sprawdzenie czy pola nie są puste.
  - Informacje o błędach logowania (np. błędne dane logowania, komunikaty zwracane z backendu).

- Formularz Odzyskiwania Hasła:
  - Pole: adres e-mail.
  - Po wysłaniu formularza system wysyła żądanie resetu hasła za pośrednictwem Supabase.

### Przypadki użycia i walidacja

- Użytkownik wypełnia formularz rejestracji – walidacja na poziomie klienta i backendu; w przypadku błędów odpowiednie komunikaty są wyświetlane.
- Użytkownik loguje się – po udanym logowaniu następuje przekierowanie do widoku głównego; błędy (np. nieprawidłowe dane) są komunikowane użytkownikowi.
- Użytkownik odzyskuje hasło – po poprawnym przesłaniu danych system wysyła wiadomość e-mail z instrukcjami resetu hasła.

## 2. Logika Backendowa

### Endpointy API

- `POST /api/auth/register`

  - Odbiera dane rejestracyjne (e-mail, hasło).
  - Waliduje dane wejściowe (format e-mail, siła hasła).
  - Integruje się z Supabase Auth poprzez metodę `signUp`. Po udanej rejestracji użytkownik zostaje automatycznie zalogowany, a system wysyła e-mail weryfikacyjny w celu potwierdzenia aktywacji konta.

- `POST /api/auth/login`

  - Odbiera dane logowania (e-mail, hasło).
  - Przeprowadza walidację danych i wywołuje metodę `signIn` Supabase Auth.
  - Zwraca token JWT lub odpowiedni komunikat błędu, oraz przekierowuje użytkownika do widoku generowania fiszek.

- `POST /api/auth/forgot-password`
  - Odbiera adres e-mail.
  - Inicjuje proces resetowania hasła przy użyciu metody Supabase, wysyłając link resetujący do podanego adresu e-mail.
