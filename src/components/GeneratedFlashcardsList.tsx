import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { FlashcardDTO } from "@/types";
import { CheckCircle2, XCircle } from "lucide-react";

interface GeneratedFlashcardsListProps {
  flashcards: FlashcardDTO[];
  onAccept: (flashcard: FlashcardDTO) => void;
  onReject: (flashcard: FlashcardDTO) => void;
  onEdit: (flashcard: FlashcardDTO) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

export default function GeneratedFlashcardsList({
  flashcards,
  onAccept,
  onReject,
  onEdit,
  onAcceptAll,
  onRejectAll,
}: GeneratedFlashcardsListProps) {
  if (!flashcards.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Wygenerowane fiszki</h2>
      <div className="flex gap-2">
        <Button className="border border-red-500 text-red-500 hover:bg-red-50" onClick={onRejectAll}>
          Odrzuć wszystkie
        </Button>
        <Button className="border border-green-500 bg-green-500 text-white hover:bg-green-600" onClick={onAcceptAll}>
          Akceptuj wszystkie
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {flashcards.map((flashcard) => (
          <Card key={flashcard.id} className="relative">
            {flashcard.status === "accepted" && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            )}
            {flashcard.status === "rejected" && (
              <div className="absolute top-2 right-2">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            )}
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
              <Button className="bg-white hover:bg-gray-50 h-8 px-3 text-sm" onClick={() => onEdit(flashcard)}>
                Edytuj
              </Button>
              <Button
                className="bg-white text-red-500 hover:bg-red-50 h-8 px-3 text-sm"
                onClick={() => onReject(flashcard)}
              >
                Odrzuć
              </Button>
              <Button
                className="bg-green-500 text-white hover:bg-green-600 h-8 px-3 text-sm"
                onClick={() => onAccept(flashcard)}
              >
                Akceptuj
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
