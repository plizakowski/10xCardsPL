import { AzureOpenAI } from "openai";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const requestData = await request.json();
    const { text } = requestData;

    if (!text || text.length < 10) {
      return new Response(
        JSON.stringify({
          error: "Text must be at least 10 characters long",
        }),
        { status: 400 }
      );
    }

    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiVersion: "2024-02-01",
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    });

    const prompt = `Generate flashcards from the following text. Each flashcard should have a front (question/term) and back (answer/definition). Format the output as a JSON array of objects with "front" and "back" properties.

Text: ${text}

Example format:
[
  {
    "front": "What is photosynthesis?",
    "back": "The process by which plants convert sunlight into energy"
  }
]`;

    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content generated");
    }

    let flashcards;
    try {
      flashcards = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse generated content as JSON:", content);
      throw new Error("Generated content is not valid JSON");
    }

    return new Response(JSON.stringify(flashcards), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate flashcards",
      }),
      { status: 500 }
    );
  }
};
