import type { SupabaseClient } from "../../db/supabase.client";
import type { GenerateFlashcardsCommand, GenerateFlashcardsResponseDTO, FlashcardDTO } from "../../types";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

export class AIGenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

  async generateFlashcards(command: GenerateFlashcardsCommand): Promise<GenerateFlashcardsResponseDTO> {
    try {
      // 1. Utworzenie rekordu w tabeli ai_requests
      const { data: requestData, error: requestError } = await this.supabase
        .from("ai_requests")
        .insert({
          user_id: DEFAULT_USER_ID,
          request_identifier: crypto.randomUUID(),
          source_text: command.text,
        })
        .select("id")
        .single();

      if (requestError) {
        throw new Error(`Błąd podczas tworzenia zapytania AI: ${requestError.message}`);
      }

      const requestId = requestData.id;

      // Mockowa implementacja generowania fiszek
      const mockFlashcards: FlashcardDTO[] = [
        {
          id: "mock-1",
          front_text: "Co to jest TypeScript?",
          back_text: "TypeScript to typowany nadzbiór JavaScript, który kompiluje się do czystego JavaScript.",
          status: "editing",
        },
        {
          id: "mock-2",
          front_text: "Jakie są główne zalety TypeScript?",
          back_text:
            "Statyczne typowanie, wsparcie dla nowoczesnych funkcji JavaScript, lepsze wsparcie IDE, wykrywanie błędów podczas kompilacji.",
          status: "editing",
        },
      ];

      return {
        request_id: requestId,
        flashcards: mockFlashcards,
      };
    } catch (error) {
      console.error("Błąd podczas generowania fiszek:", error);
      throw error;
    }
  }
}
