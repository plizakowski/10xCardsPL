import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { AstroCookies } from "astro";
import type { Database } from "@/db/database.types";

// Sprawdź zmienne środowiskowe
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Brak wymaganych zmiennych środowiskowych dla Supabase. Upewnij się, że masz ustawione SUPABASE_URL i SUPABASE_KEY w pliku .env"
  );
}

// Klient dla przeglądarki
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Klient dla serwera
export const createSupabaseServer = ({ cookies, headers }: { cookies: AstroCookies; headers: Headers }) => {
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      get: (key: string) => cookies.get(key)?.value,
      set: (key: string, value: string, options: CookieOptions) => {
        cookies.set(key, value, { ...options });
      },
      remove: (key: string, options: CookieOptions) => {
        cookies.delete(key, { ...options });
      },
    },
  });
};
