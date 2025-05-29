import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import type { FlashcardDTO } from "@/types";

interface GenerateAIFlashcardsFormProps {
  onFlashcardsGenerated: (flashcards: FlashcardDTO[]) => void;
}

const MIN_TEXT_LENGTH = 1000;
const MAX_TEXT_LENGTH = 10000;

export default function GenerateAIFlashcardsForm({ onFlashcardsGenerated }: GenerateAIFlashcardsFormProps) {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (text.length < MIN_TEXT_LENGTH) {
      setError(`Tekst musi zawierać minimum ${MIN_TEXT_LENGTH} znaków`);
      return;
    }

    if (text.length > MAX_TEXT_LENGTH) {
      setError(`Tekst nie może przekraczać ${MAX_TEXT_LENGTH} znaków`);
      return;
    }

    setIsGenerating(true);

    try {
      console.log("Wysyłanie żądania do API...");
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      console.log("Otrzymano odpowiedź:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Błąd odpowiedzi:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(errorData?.error || `Błąd serwera: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Otrzymano dane:", data);

      if (!data.flashcards || !Array.isArray(data.flashcards)) {
        console.error("Nieprawidłowy format odpowiedzi:", data);
        throw new Error("Otrzymano nieprawidłowy format danych z serwera");
      }

      onFlashcardsGenerated(data.flashcards);
      setText("");
    } catch (err) {
      console.error("Błąd podczas generowania fiszek:", err);
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd podczas komunikacji z serwerem");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Tekst źródłowy</CardTitle>
          <CardDescription>Wklej tekst lub wprowadź temat, z którego chcesz wygenerować fiszki.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="sourceText" className="sr-only">
                Tekst źródłowy
              </label>
              <textarea
                id="sourceText"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[200px] p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Wklej tekst do analizy"
                disabled={isGenerating}
              />
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  Liczba znaków: {text.length} / {MAX_TEXT_LENGTH}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isGenerating || text.length < MIN_TEXT_LENGTH || text.length > MAX_TEXT_LENGTH}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? "Generowanie..." : "Generuj fiszki"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
