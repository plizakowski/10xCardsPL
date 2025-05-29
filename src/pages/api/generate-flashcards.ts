import { AzureOpenAI } from "openai";
import type { APIRoute } from "astro";
import type { FlashcardDTO } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface APIError {
  response?: {
    status: number;
    statusText: string;
    text: () => Promise<string>;
  };
  message: string;
  stack?: string;
}

interface RawFlashcard {
  front: string;
  back: string;
}

const systemPrompt = `Jesteś ekspertem w tworzeniu fiszek edukacyjnych. Twoim zadaniem jest przeanalizowanie podanego tekstu i wygenerowanie zestawu fiszek.

Zasady tworzenia fiszek:
1. Każda fiszka powinna zawierać jedno konkretne pytanie i odpowiedź
2. Pytania powinny być jasne i jednoznaczne
3. Odpowiedzi powinny być zwięzłe i precyzyjne
4. Unikaj powtórzeń informacji w różnych fiszkach
5. Generuj fiszki tylko z faktów zawartych w tekście
6. Nie wymyślaj dodatkowych informacji

Odpowiedź MUSI być w formacie JSON zgodnym z poniższą strukturą:
{
  "flashcards": [
    {
      "front": "pytanie",
      "back": "odpowiedź"
    }
  ]
}`;

export const POST: APIRoute = async ({ request, locals }) => {
  console.log("=== Start API request ===");

  // Pobierz zalogowanego użytkownika z locals (ustawione przez middleware)
  const user = locals.user;
  const supabase = locals.supabase;

  if (!user) {
    return new Response(
      JSON.stringify({
        error: "Musisz być zalogowany, aby generować fiszki",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Sprawdzenie zmiennych środowiskowych
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

  console.log("Environment variables check:", {
    apiKey: apiKey ? "Set" : "Not set",
    endpoint,
    deploymentName,
  });

  if (!apiKey || !endpoint || !deploymentName) {
    return new Response(
      JSON.stringify({
        error: "Brak wymaganych zmiennych środowiskowych",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    console.log("Parsing request body...");
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({
          error: "Brak wymaganego tekstu w żądaniu",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(`Request text length: ${text.length}`);

    console.log("Initializing Azure OpenAI client...");
    const client = new AzureOpenAI({
      apiKey,
      endpoint,
      defaultQuery: { "api-version": "2024-02-15-preview" },
      defaultHeaders: { "api-key": apiKey },
      apiVersion: "2024-02-15-preview",
    });

    console.log("Making request to Azure OpenAI...");
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      model: deploymentName,
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    console.log("Got response from Azure OpenAI");
    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.log("No content in response");
      throw new Error("No content generated");
    }

    console.log("Raw API response content:", content);

    let rawFlashcards: RawFlashcard[];
    try {
      console.log("Parsing response content as JSON");
      const parsedContent = JSON.parse(content);

      if (!Array.isArray(parsedContent.flashcards)) {
        throw new Error("Response doesn't contain flashcards array");
      }

      rawFlashcards = parsedContent.flashcards;

      // Walidacja struktury każdej fiszki
      rawFlashcards.forEach((card, index) => {
        if (!card.front || !card.back) {
          throw new Error(`Flashcard at index ${index} is missing required properties`);
        }
      });

      console.log("Successfully parsed JSON response");
    } catch (parseError) {
      console.error("Failed to parse generated content as JSON:", content);
      console.error("Parse error:", parseError);
      throw new Error("Generated content is not valid JSON");
    }

    // Przekształć surowe fiszki na format DTO
    const flashcards: FlashcardDTO[] = rawFlashcards.map((card) => ({
      id: uuidv4(),
      front_text: card.front,
      back_text: card.back,
      status: "editing",
      user_id: user.id,
    }));

    // Zapisz fiszki w bazie Supabase
    console.log("Saving flashcards to Supabase...");
    const { data: savedFlashcards, error: saveError } = await supabase.from("flashcards").insert(flashcards).select();

    if (saveError) {
      console.error("Error saving flashcards to Supabase:", saveError);
      throw new Error("Nie udało się zapisać fiszek w bazie danych");
    }

    console.log("Successfully saved flashcards to Supabase");
    console.log("Sending successful response");
    return new Response(JSON.stringify({ flashcards: savedFlashcards }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    const apiError = error as APIError;

    return new Response(
      JSON.stringify({
        error: apiError.message || "Wystąpił nieznany błąd",
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
