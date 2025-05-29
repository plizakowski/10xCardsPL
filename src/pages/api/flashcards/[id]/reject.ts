import type { APIRoute } from "astro";
import type { FlashcardDTO } from "@/types";

export const POST: APIRoute = async ({ params, locals }) => {
  try {
    const { id } = params;
    const supabase = locals.supabase;

    if (!id) {
      return new Response(
        JSON.stringify({
          error: "Brak ID fiszki",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Pobierz zalogowanego użytkownika
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Błąd podczas pobierania użytkownika:", userError);
      return new Response(
        JSON.stringify({
          error: "Musisz być zalogowany, aby odrzucać fiszki",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Sprawdź czy fiszka należy do użytkownika
    const { data: flashcard, error: flashcardError } = await supabase
      .from("flashcards")
      .select()
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (flashcardError || !flashcard) {
      console.error("Błąd podczas pobierania fiszki:", flashcardError);
      return new Response(
        JSON.stringify({
          error: "Nie znaleziono fiszki lub brak uprawnień",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Zaktualizuj status fiszki na "rejected"
    const { data, error } = await supabase
      .from("flashcards")
      .update({ status: "rejected" })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Błąd podczas aktualizacji fiszki:", error);
      return new Response(
        JSON.stringify({
          error: "Nie udało się odrzucić fiszki",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Błąd podczas odrzucania fiszki:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas odrzucania fiszki",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
