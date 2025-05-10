import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../../../db/supabase.client";

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const { id } = params;
    const { front_text, back_text, status } = await request.json();

    // Aktualizujemy istniejącą fiszkę
    const { data, error: updateError } = await locals.supabase
      .from("flashcards")
      .update({
        status: status,
        front_text: front_text,
        back_text: back_text,
        user_id: DEFAULT_USER_ID,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji fiszki:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas aktualizacji fiszki",
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
