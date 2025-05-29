import { defineMiddleware } from "astro:middleware";
import { createSupabaseServer } from "../lib/supabase";

// Ścieżki publiczne - endpointy Auth API i strony Astro
const PUBLIC_PATHS = [
  // Strony Astro renderowane po stronie serwera
  "/login",
  "/register",
  "/forgot-password",
  // Endpointy Auth API
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  try {
    // Inicjalizacja klienta Supabase
    const supabase = createSupabaseServer({
      cookies,
      headers: request.headers,
    });

    // Dodajemy klienta Supabase do locals
    locals.supabase = supabase;

    // Pomijamy sprawdzanie autoryzacji dla ścieżek publicznych
    if (PUBLIC_PATHS.includes(url.pathname)) {
      return next();
    }

    // Pobieramy dane użytkownika
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Błąd podczas pobierania użytkownika:", userError);
      return redirect("/login");
    }

    if (user) {
      // Dodajemy informacje o użytkowniku do locals
      locals.user = {
        email: user.email || "",
        id: user.id,
      };
      return next();
    }

    // Przekierowanie na stronę logowania dla chronionych ścieżek
    return redirect("/login");
  } catch (error) {
    console.error("Błąd w middleware:", error);
    return redirect("/login");
  }
});
