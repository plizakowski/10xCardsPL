import type { APIRoute } from "astro";
import { createSupabaseServer } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // Walidacja podstawowa
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: "Email and password are required",
        }),
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return new Response(
        JSON.stringify({
          error: "Hasło musi mieć minimum 4 znaki",
        }),
        { status: 400 }
      );
    }

    const supabase = createSupabaseServer({ cookies, headers: request.headers });
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return new Response(
        JSON.stringify({
          error: signInError.message,
        }),
        { status: 401 }
      );
    }

    // Zwracamy sukces zamiast przekierowania
    return new Response(
      JSON.stringify({
        success: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      { status: 500 }
    );
  }
};
