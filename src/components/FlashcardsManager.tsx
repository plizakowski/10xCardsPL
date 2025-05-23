import { useState } from "react";
import { toast } from "./ui/toast";
import { Card, CardContent } from "./ui/card";
import EditFlashcardDialog from "./EditFlashcardDialog";
import GenerateAIFlashcardsForm from "./GenerateAIFlashcardsForm";
import GeneratedFlashcardsList from "./GeneratedFlashcardsList";
import type { FlashcardDTO } from "@/types";

export default function FlashcardsManager() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardDTO | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFlashcardsGenerated = (newFlashcards: FlashcardDTO[]) => {
    setFlashcards(newFlashcards);
  };

  const handleAccept = async (id: string) => {
    try {
      const response = await fetch(`/api/flashcards/${id}/accept`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaakceptować fiszki");
      }

      setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
    } catch (error) {
      console.error("Błąd podczas akceptowania fiszki:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/flashcards/${id}/reject`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Nie udało się odrzucić fiszki");
      }

      setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
    } catch (error) {
      console.error("Błąd podczas odrzucania fiszki:", error);
    }
  };

  const handleEdit = async (id: string, front_text: string, back_text: string) => {
    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ front_text, back_text }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaktualizować fiszki");
      }

      setFlashcards((prev) =>
        prev.map((flashcard) => (flashcard.id === id ? { ...flashcard, front_text, back_text } : flashcard))
      );
    } catch (error) {
      console.error("Błąd podczas aktualizacji fiszki:", error);
    }
  };

  const handleAcceptAll = async () => {
    try {
      const editingFlashcards = flashcards.filter((card) => card.status === "editing");
      if (editingFlashcards.length === 0) {
        toast.info("Brak fiszek do zaakceptowania");
        return;
      }

      await Promise.all(
        editingFlashcards.map((flashcard) =>
          fetch(`/api/flashcards/${flashcard.id}/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              front_text: flashcard.front_text,
              back_text: flashcard.back_text,
              status: "accepted",
            }),
          })
        )
      );

      setFlashcards((cards) =>
        cards.map((card) => (card.status === "editing" ? { ...card, status: "accepted" as const } : card))
      );
      toast.success("Wszystkie fiszki zostały zaakceptowane");
    } catch (error) {
      console.error("Błąd:", error);
      toast.error("Wystąpił błąd podczas masowego akceptowania fiszek");
    }
  };

  const handleRejectAll = async () => {
    try {
      const editingFlashcards = flashcards.filter((card) => card.status === "editing");
      if (editingFlashcards.length === 0) {
        toast.info("Brak fiszek do odrzucenia");
        return;
      }

      await Promise.all(
        editingFlashcards.map((flashcard) =>
          fetch(`/api/flashcards/${flashcard.id}/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              front_text: flashcard.front_text,
              back_text: flashcard.back_text,
              status: "rejected",
            }),
          })
        )
      );

      setFlashcards((cards) =>
        cards.map((card) => (card.status === "editing" ? { ...card, status: "rejected" as const } : card))
      );
      toast.success("Wszystkie fiszki zostały odrzucone");
    } catch (error) {
      console.error("Błąd:", error);
      toast.error("Wystąpił błąd podczas masowego odrzucania fiszek");
    }
  };

  const handleSaveEdit = (flashcard: FlashcardDTO) => {
    if (editingFlashcard) {
      handleEdit(flashcard.id, flashcard.front_text, flashcard.back_text);
      setIsEditDialogOpen(false);
      setEditingFlashcard(null);
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
            onAcceptAll={handleAcceptAll}
            onRejectAll={handleRejectAll}
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
