import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenerateFlashcardsCommand, FlashcardDTO } from "../../types";
import { OpenAIService } from "./openai.service";

export interface GenerationResponse {
  success: boolean;
  flashcards?: FlashcardDTO[];
  error?: string;
}

export class AIGenerationService {
  private openAIService: OpenAIService;
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.openAIService = new OpenAIService();
    this.supabase = supabase;
  }

  async generateFlashcards(text: string): Promise<GenerationResponse> {
    try {
      const command: GenerateFlashcardsCommand = { text };
      const response = await this.openAIService.generateFlashcards(command);

      return {
        success: true,
        flashcards: response.flashcards,
      };
    } catch (error) {
      console.error("Error generating flashcards:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
