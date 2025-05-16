import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface GeneratedFlashcardsListProps {

  flashcards: FlashcardDTO[];
  onAccept: (flashcard: FlashcardDTO) => void;
  onReject: (flashcard: FlashcardDTO) => void;
  onEdit: (flashcard: FlashcardDTO) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  flashcards: Flashcard[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string, front: string, back: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  isProcessing: boolean;
}

export default function GeneratedFlashcardsList({
  flashcards,
  onAccept,
  onReject,
  onEdit,
  onAcceptAll,
  onRejectAll,
  isProcessing,
}: GeneratedFlashcardsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  const handleStartEdit = (flashcard: Flashcard) => {
    setEditingId(flashcard.id);
    setEditFront(flashcard.front);
    setEditBack(flashcard.back);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onEdit(editingId, editFront, editBack);
      setEditingId(null);
    }
  };

  if (flashcards.length === 0) {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Wygenerowane fiszki</CardTitle>
            <CardDescription>Przejrzyj i zatwierdź wygenerowane fiszki przed dodaniem do kolekcji.</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={onAcceptAll}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? "Przetwarzanie..." : "Akceptuj wszystko"}
            </Button>
            <Button
              onClick={onRejectAll}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? "Przetwarzanie..." : "Odrzuć wszystko"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {flashcards.map((flashcard) => (
            <div key={flashcard.id} className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
              {editingId === flashcard.id ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor={`front-${flashcard.id}`} className="block text-sm font-medium text-gray-700">
                      Przód
                    </label>
                    <textarea
                      id={`front-${flashcard.id}`}
                      value={editFront}
                      onChange={(e) => setEditFront(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label htmlFor={`back-${flashcard.id}`} className="block text-sm font-medium text-gray-700">
                      Tył
                    </label>
                    <textarea
                      id={`back-${flashcard.id}`}
                      value={editBack}
                      onChange={(e) => setEditBack(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={isProcessing}
                    >
                      Anuluj
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Zapisywanie..." : "Zapisz"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Przód</h4>
                      <p className="mt-1">{flashcard.front}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Tył</h4>
                      <p className="mt-1">{flashcard.back}</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleStartEdit(flashcard)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={isProcessing}
                    >
                      Edytuj
                    </Button>
                    <Button
                      onClick={() => onReject(flashcard.id)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "..." : "Odrzuć"}
                    </Button>
                    <Button
                      onClick={() => onAccept(flashcard.id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "..." : "Akceptuj"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
