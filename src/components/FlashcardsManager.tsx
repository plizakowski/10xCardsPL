import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { FlashcardDTO } from "@/types";
import GenerateAIFlashcardsForm from "./GenerateAIFlashcardsForm";
import GeneratedFlashcardsList from "./GeneratedFlashcardsList";
import EditFlashcardDialog from "./EditFlashcardDialog";
import { toast } from "sonner";

export default function FlashcardsManager() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardDTO | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFlashcardsGenerated = (newFlashcards: FlashcardDTO[]) => {
    setFlashcards(newFlashcards);
  };

  const handleAccept = async (flashcard: FlashcardDTO) => {
    try {
      const response = await fetch(`/api/flashcards/${flashcard.id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front_text: flashcard.front_text,
          back_text: flashcard.back_text,
          status: "accepted",
        }),
      });
      if (!response.ok) throw new Error("Błąd podczas akceptowania fiszki");

      setFlashcards((cards) =>
        cards.map((card) => (card.id === flashcard.id ? { ...card, status: "accepted" as const } : card))
      );
      toast.success("Fiszka została zaakceptowana");
    } catch (error) {
      console.error("Błąd:", error);
      toast.error("Wystąpił błąd podczas akceptowania fiszki");
    }
  };

  const handleReject = async (flashcard: FlashcardDTO) => {
    try {
      const response = await fetch(`/api/flashcards/${flashcard.id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front_text: flashcard.front_text,
          back_text: flashcard.back_text,
          status: "rejected",
        }),
      });
      if (!response.ok) throw new Error("Błąd podczas odrzucania fiszki");

      setFlashcards((cards) =>
        cards.map((card) => (card.id === flashcard.id ? { ...card, status: "rejected" as const } : card))
      );
      toast.success("Fiszka została odrzucona");
    } catch (error) {
      console.error("Błąd:", error);
      toast.error("Wystąpił błąd podczas odrzucania fiszki");
    }
  };

  const handleEdit = (flashcard: FlashcardDTO) => {
    if (flashcard.status === "accepted" || flashcard.status === "rejected") {
      toast.info("Edycja spowoduje powrót fiszki do stanu roboczego");
    }
    setEditingFlashcard(flashcard);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (editedFlashcard: FlashcardDTO) => {
    try {
      const response = await fetch(`/api/flashcards/${editedFlashcard.id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front_text: editedFlashcard.front_text,
          back_text: editedFlashcard.back_text,
          status: "editing",
        }),
      });
      if (!response.ok) throw new Error("Błąd podczas zapisywania zmian");

      setFlashcards((cards) =>
        cards.map((card) =>
          card.id === editedFlashcard.id ? { ...editedFlashcard, status: "editing" as const } : card
        )
      );
      setIsEditDialogOpen(false);
      setEditingFlashcard(null);
      toast.success("Zapisano zmiany. Pamiętaj, że musisz ponownie zaakceptować fiszkę.");
    } catch (error) {
      console.error("Błąd:", error);
      toast.error("Wystąpił błąd podczas zapisywania zmian");
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
