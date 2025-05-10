import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface GeneratedFlashcardsListProps {
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
