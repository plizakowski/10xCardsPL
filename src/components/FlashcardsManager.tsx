import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { FlashcardDTO } from "@/types";
import GenerateAIFlashcardsForm from "./GenerateAIFlashcardsForm";
import GeneratedFlashcardsList from "./GeneratedFlashcardsList";
import EditFlashcardDialog from "./EditFlashcardDialog";

export default function FlashcardsManager() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardDTO | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFlashcardsGenerated = (newFlashcards: FlashcardDTO[]) => {
    setFlashcards(newFlashcards);
  };

  const handleAccept = async (flashcard: FlashcardDTO) => {
    try {
      const response = await fetch(`/api/flashcards/${flashcard.id}/accept`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Błąd podczas akceptowania fiszki");
      setFlashcards((cards) => cards.filter((c) => c.id !== flashcard.id));
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  const handleReject = async (flashcard: FlashcardDTO) => {
    try {
      const response = await fetch(`/api/flashcards/${flashcard.id}/reject`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Błąd podczas odrzucania fiszki");
      setFlashcards((cards) => cards.filter((c) => c.id !== flashcard.id));
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  const handleEdit = (flashcard: FlashcardDTO) => {
    setEditingFlashcard(flashcard);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (editedFlashcard: FlashcardDTO) => {
    try {
      const response = await fetch(`/api/flashcards/${editedFlashcard.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedFlashcard),
      });
      if (!response.ok) throw new Error("Błąd podczas zapisywania zmian");

      setFlashcards((cards) =>
        cards.map((card) => (card.id === editedFlashcard.id ? editedFlashcard : card))
      );
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <GenerateAIFlashcardsForm onFlashcardsGenerated={handleFlashcardsGenerated} />
        </CardContent>
      </Card>

      {flashcards.length > 0 && (
        <div>
          <GeneratedFlashcardsList
            flashcards={flashcards}
            onAccept={handleAccept}
            onReject={handleReject}
            onEdit={handleEdit}
          />
        </div>
      )}

      <EditFlashcardDialog
        flashcard={editingFlashcard}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
