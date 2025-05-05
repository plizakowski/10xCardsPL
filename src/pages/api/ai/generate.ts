import { z } from "zod";
import type { APIRoute } from "astro";
import type { GenerateFlashcardsCommand } from "../../../types";
import { AIGenerationService } from "../../../lib/services/aiGenerationService";

// Schema walidacji dla danych wejściowych
const generateFlashcardsSchema = z.object({
  text: z
    .string()
    .min(1000, "Tekst musi zawierać co najmniej 1000 znaków")
    .max(10000, "Tekst nie może przekraczać 10000 znaków"),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { supabase } = locals;

    // Parsowanie i walidacja danych wejściowych
    const body = await request.json();
    const validationResult = generateFlashcardsSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane wejściowe",
          details: validationResult.error.errors,
        }),
        { status: 400 }
      );
    }

    const command = validationResult.data as GenerateFlashcardsCommand;

    // Generowanie fiszek przy użyciu serwisu
    const aiService = new AIGenerationService(supabase);
    const result = await aiService.generateFlashcards(command);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Błąd podczas generowania fiszek:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
