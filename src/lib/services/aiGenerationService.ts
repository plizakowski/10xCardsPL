import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenerateFlashcardsCommand, GenerateFlashcardsResponseDTO, FlashcardDTO } from "../../types";
import { OpenAIService } from "./openai.service";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

export class AIGenerationService {
  private readonly _openAIService: OpenAIService;
  private readonly _supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this._openAIService = new OpenAIService();
    this._supabaseClient = supabaseClient;
  }

  async generateFlashcards(command: GenerateFlashcardsCommand): Promise<GenerateFlashcardsResponseDTO> {
    try {
      // 1. Utworzenie rekordu w tabeli ai_requests
      const { data: requestData, error: requestError } = await this._supabaseClient
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

      // 2. Generowanie fiszek przez OpenRouter
      const systemPrompt = `Jesteś ekspertem w tworzeniu fiszek edukacyjnych. 
      Przeanalizuj podany tekst i stwórz z niego fiszki w formacie pytanie (przód) i odpowiedź (tył).
      Fiszki powinny być zwięzłe, jasne i skupiać się na kluczowych informacjach.
      Odpowiedź powinna być w formacie JSON zgodnym ze schematem:
      {
        "flashcards": [
          {
            "front": string, // Pytanie na przedniej stronie fiszki
            "back": string // Odpowiedź na tylnej stronie fiszki
          }
        ]
      }`;

      this._openAIService.updateSystemPrompt(systemPrompt);
      const response = await this._openAIService.sendChat(command.text);

      // Parsowanie odpowiedzi i tworzenie fiszek
      const generatedFlashcards = JSON.parse(response.message).flashcards.map((f: any) => ({
        user_id: DEFAULT_USER_ID,
        front_text: f.front,
        back_text: f.back,
        status: "editing",
      }));

      // 3. Zapisywanie fiszek w bazie danych
      const { data: savedFlashcards, error: flashcardsError } = await this._supabaseClient
        .from("flashcards")
        .insert(generatedFlashcards)
        .select("id, front_text, back_text, status")
        .order("id");

      if (flashcardsError) {
        throw new Error(`Błąd podczas zapisywania fiszek: ${flashcardsError.message}`);
      }

      return {
        request_id: requestId,
        flashcards: savedFlashcards as FlashcardDTO[],
      };
    } catch (error) {
      console.error("Błąd podczas generowania fiszek:", error);
      throw error;
    }
  }
}
