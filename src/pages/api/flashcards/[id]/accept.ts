import type { APIRoute } from "astro";
import type { FlashcardDTO } from "@/types";

export const POST: APIRoute = async ({ params, locals, request }) => {
  try {
    const { id } = params;
    const supabase = locals.supabase;

    // Pobierz dane z body requestu
    const { front_text, back_text } = await request.json().catch(() => ({}));

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

    console.log("Akceptacja fiszki - user:", user?.id);

    if (userError || !user) {
      console.error("Błąd podczas pobierania użytkownika:", userError);
      return new Response(
        JSON.stringify({
          error: "Musisz być zalogowany, aby akceptować fiszki",
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

    console.log("Znaleziona fiszka:", flashcard);

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

    // Przygotuj dane do aktualizacji
    const updateData: { status: string; front_text?: string; back_text?: string } = {
      status: "accepted",
    };

    // Dodaj front_text i back_text tylko jeśli zostały przekazane
    if (front_text !== undefined) updateData.front_text = front_text;
    if (back_text !== undefined) updateData.back_text = back_text;

    console.log("Aktualizacja fiszki - dane:", updateData);

    // Zaktualizuj status fiszki na "accepted" i opcjonalnie tekst
    const { data, error } = await supabase
      .from("flashcards")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Błąd podczas aktualizacji fiszki:", error);
      return new Response(
        JSON.stringify({
          error: "Nie udało się zaakceptować fiszki",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Zaktualizowana fiszka:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Błąd podczas akceptowania fiszki:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas akceptowania fiszki",
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
