import { supabaseClient, DEFAULT_USER_ID } from "../../db/supabase.client";
import type { FlashcardDTO, ValidatedQueryParams } from "../validation";

export interface GetFlashcardsResult {
  data: FlashcardDTO[];
  total: number;
}

export async function getFlashcards(params: ValidatedQueryParams): Promise<GetFlashcardsResult> {
  const { status, page, limit, sort } = params;

  // Budowanie zapytania
  let query = supabaseClient.from("flashcards").select("*", { count: "exact" }).eq("user_id", DEFAULT_USER_ID); // Używamy domyślnego użytkownika

  // Dodanie filtrów
  if (status) {
    query = query.eq("status", status);
  }

  // Sortowanie
  if (sort === "newest") {
    query = query.order("id", { ascending: false });
  } else {
    query = query.order("id", { ascending: true });
  }

  // Paginacja
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  // Wykonanie zapytania
  const { data, error, count } = await query;

  if (error) {
    console.error("Błąd podczas pobierania fiszek:", error);
    throw new Error("Nie udało się pobrać fiszek");
  }

  return {
    data: data.map((flashcard) => ({
      id: flashcard.id,
      front_text: flashcard.front_text,
      back_text: flashcard.back_text,
      status: flashcard.status,
    })),
    total: count || 0,
  };
}
