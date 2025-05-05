import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { FlashcardDTO } from "@/types";

interface GeneratedFlashcardsListProps {
  flashcards: FlashcardDTO[];
  onAccept: (flashcard: FlashcardDTO) => void;
  onReject: (flashcard: FlashcardDTO) => void;
  onEdit: (flashcard: FlashcardDTO) => void;
}

export default function GeneratedFlashcardsList({
  flashcards,
  onAccept,
  onReject,
  onEdit,
}: GeneratedFlashcardsListProps) {
  if (!flashcards.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Wygenerowane fiszki</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {flashcards.map((flashcard) => (
          <Card key={flashcard.id}>
            <CardHeader>
              <CardTitle>Fiszka</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">Przód:</p>
                <p className="text-sm text-muted-foreground">{flashcard.front_text}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tył:</p>
                <p className="text-sm text-muted-foreground">{flashcard.back_text}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(flashcard)}>
                Edytuj
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(flashcard)}
                className="text-red-500 hover:text-red-700"
              >
                Odrzuć
              </Button>
              <Button variant="default" size="sm" onClick={() => onAccept(flashcard)}>
                Akceptuj
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
