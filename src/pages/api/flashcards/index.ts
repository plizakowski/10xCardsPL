import type { APIRoute } from "astro";
import { validateAndParseQueryParams, ValidationError } from "../../../lib/validation";
import { getFlashcards } from "../../../lib/services/flashcards";
import type { GetFlashcardsResponseDTO } from "../../../types";
import { supabaseClient, DEFAULT_USER_ID } from "../../../db/supabase.client";
import type { CreateFlashcardCommand, CreateFlashcardResponseDTO } from "../../../types";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Parsowanie i walidacja parametrów zapytania
    const url = new URL(request.url);
    const validatedParams = validateAndParseQueryParams(url.searchParams);

    // Pobieranie danych z bazy
    const { data, total } = await getFlashcards(validatedParams);

    // Przygotowanie odpowiedzi
    const response: GetFlashcardsResponseDTO = {
      data,
      pagination: {
        total,
        page: validatedParams.page,
        limit: validatedParams.limit,
        pages: Math.ceil(total / validatedParams.limit),
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.error("Błąd podczas pobierania fiszek:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas przetwarzania żądania",
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = (await request.json()) as CreateFlashcardCommand;

    // Walidacja danych wejściowych
    const validationErrors = validateCreateFlashcardCommand(data);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane wejściowe",
          details: validationErrors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Tworzenie rekordu w bazie danych
    const { data: flashcard, error } = await supabaseClient
      .from("flashcards")
      .insert({
        front_text: data.front_text,
        back_text: data.back_text,
        status: data.status,
        user_id: DEFAULT_USER_ID,
      })
      .select()
      .single();

    if (error) {
      console.error("Błąd podczas tworzenia fiszki:", error);
      return new Response(JSON.stringify({ error: "Błąd podczas tworzenia fiszki" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response: CreateFlashcardResponseDTO = {
      id: flashcard.id,
      front_text: flashcard.front_text,
      back_text: flashcard.back_text,
      status: flashcard.status,
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

function validateCreateFlashcardCommand(data: CreateFlashcardCommand): string[] {
  const errors: string[] = [];

  // Walidacja front_text
  if (!data.front_text) {
    errors.push("front_text jest wymagane");
  } else if (data.front_text.length < 1 || data.front_text.length > 4000) {
    errors.push("front_text musi mieć od 1 do 4000 znaków");
  }

  // Walidacja back_text
  if (!data.back_text) {
    errors.push("back_text jest wymagane");
  } else if (data.back_text.length < 1 || data.back_text.length > 4000) {
    errors.push("back_text musi mieć od 1 do 4000 znaków");
  }

  // Walidacja status
  if (!data.status) {
    errors.push("status jest wymagany");
  } else if (!["accepted", "rejected", "editing"].includes(data.status)) {
    errors.push("nieprawidłowy status");
  }

  // Walidacja source
  if (data.source) {
    if (!["manual", "ai_full", "ai_edited"].includes(data.source.type)) {
      errors.push("nieprawidłowy typ źródła");
    }
    if ((data.source.type === "ai_full" || data.source.type === "ai_edited") && !data.source.request_identifier) {
      errors.push("request_identifier jest wymagany dla typów ai_full i ai_edited");
    }
  }

  return errors;
}
