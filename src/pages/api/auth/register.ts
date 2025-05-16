import type { APIRoute } from "astro";
import { createSupabaseServer } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // Walidacja danych wejściowych
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email i hasło są wymagane" }), { status: 400 });
    }

    const supabase = createSupabaseServer({ cookies, headers: request.headers });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      let errorMessage = "Wystąpił błąd podczas rejestracji";

      // Mapowanie błędów Supabase na przyjazne komunikaty
      switch (error.message) {
        case "User already registered":
          errorMessage = "Użytkownik o tym adresie email już istnieje";
          break;
        case "Password should be at least 6 characters":
          errorMessage = "Hasło musi mieć minimum 6 znaków";
          break;
        case "Invalid email":
          errorMessage = "Nieprawidłowy format adresu email";
          break;
        default:
          errorMessage = error.message;
      }

      return new Response(JSON.stringify({ error: errorMessage }), { status: 400 });
    }

    return new Response(
      JSON.stringify({
        user: data.user,
        message: "Rejestracja zakończona pomyślnie",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Błąd podczas rejestracji:", err);
    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd podczas rejestracji" }), { status: 500 });
  }
};
