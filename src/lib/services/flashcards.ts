import type { ValidatedQueryParams } from "../validation";
import type { FlashcardDTO } from "../../types";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface GetFlashcardsResult {
  data: FlashcardDTO[];
  total: number;
}

export async function getFlashcards(
  supabase: SupabaseClient,
  params: ValidatedQueryParams
): Promise<GetFlashcardsResult> {
  const { status, page, limit, sort } = params;
  console.log("Parametry zapytania:", { status, page, limit, sort });

  // Pobierz zalogowanego użytkownika
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Błąd podczas pobierania użytkownika:", userError);
    throw new Error("Nie udało się pobrać użytkownika");
  }

  console.log("=== DEBUG: Pobieranie fiszek ===");
  console.log("ID zalogowanego użytkownika:", user.id);
  console.log("Status filtrowania:", status);
  console.log("Strona:", page, "Limit:", limit);
  console.log("Sortowanie:", sort);

  // Budowanie zapytania
  let query = supabase.from("flashcards").select("*", { count: "exact" }).eq("user_id", user.id);

  // Dodanie filtrów
  if (status) {
    query = query.eq("status", status);
    console.log("Zastosowano filtr statusu:", status);
  }

  // Sortowanie
  if (sort === "newest") {
    query = query.order("id", { ascending: false });
    console.log("Sortowanie: od najnowszych");
  } else {
    query = query.order("id", { ascending: true });
    console.log("Sortowanie: od najstarszych");
  }

  // Paginacja
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);
  console.log("Paginacja - offset:", offset, "limit:", limit);

  // Logowanie pełnego zapytania
  const { data, error, count } = await query;

  if (error) {
    console.error("Błąd podczas pobierania fiszek:", error);
    console.error("Szczegóły zapytania:", {
      user_id: user.id,
      status,
      offset,
      limit,
      sort,
    });
    throw new Error("Nie udało się pobrać fiszek");
  }

  console.log("=== Wyniki zapytania ===");
  console.log("Liczba znalezionych fiszek:", count);
  console.log("Liczba zwróconych fiszek:", data?.length);
  if (data && data.length > 0) {
    console.log("Przykładowa fiszka:", {
      id: data[0].id,
      status: data[0].status,
      user_id: data[0].user_id,
    });
  } else {
    console.log("Nie znaleziono żadnych fiszek dla użytkownika", user.id);
  }

  return {
    data: data.map((flashcard) => ({
      id: flashcard.id,
      front_text: flashcard.front_text,
      back_text: flashcard.back_text,
      status: flashcard.status,
      user_id: flashcard.user_id,
    })),
    total: count || 0,
  };
}
