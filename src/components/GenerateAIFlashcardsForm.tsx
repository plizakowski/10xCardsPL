import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { GenerateFlashcardsCommand, GenerateFlashcardsResponseDTO, FlashcardDTO } from "@/types";

interface GenerateAIFlashcardsFormProps {
  onFlashcardsGenerated: (flashcards: FlashcardDTO[]) => void;
}

export default function GenerateAIFlashcardsForm({ onFlashcardsGenerated }: GenerateAIFlashcardsFormProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (text.length < 1000) {
      setError("Tekst musi zawierać minimum 1000 znaków");
      return;
    }

    if (text.length > 10000) {
      setError("Tekst nie może przekraczać 10000 znaków");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text } as GenerateFlashcardsCommand),
      });

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas generowania fiszek");
      }

      const data: GenerateFlashcardsResponseDTO = await response.json();
      onFlashcardsGenerated(data.flashcards);
      setText(""); // Wyczyść pole tekstowe po udanym wygenerowaniu
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="text"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tekst źródłowy
        </label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wklej tekst do analizy (minimum 1000 znaków)"
          className="min-h-[200px]"
          disabled={isLoading}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-sm text-muted-foreground">Liczba znaków: {text.length} / 10000</p>
      </div>

      <Button type="submit" disabled={isLoading || text.length < 1000 || text.length > 10000} className="w-full">
        {isLoading ? "Generowanie..." : "Generuj fiszki"}
      </Button>
    </form>
  );
}
