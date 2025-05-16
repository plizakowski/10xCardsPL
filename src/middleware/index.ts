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

  // Pobieramy sesję użytkownika
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // @ts-ignore - dodamy typy dla locals później
    locals.user = {
      email: user.email,
      id: user.id,
    };
    return next();
  }

  // Przekierowanie na stronę logowania dla chronionych ścieżek
  return redirect("/login");
});
