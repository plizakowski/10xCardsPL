import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import EditFlashcardDialog from "./EditFlashcardDialog";
import GenerateAIFlashcardsForm from "./GenerateAIFlashcardsForm";
import GeneratedFlashcardsList from "./GeneratedFlashcardsList";
import type { FlashcardDTO } from "@/types";

export default function FlashcardsManager() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardDTO | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedFlashcards, setAcceptedFlashcards] = useState<FlashcardDTO[]>([]);

  const handleFlashcardsGenerated = (newFlashcards: FlashcardDTO[]) => {
    console.log("Otrzymane fiszki:", newFlashcards);
    setFlashcards(newFlashcards);
  };

  const handleAccept = async (id: string) => {
    try {
      setIsProcessing(true);
      const flashcard = flashcards.find((f) => f.id === id);
      if (!flashcard) {
        throw new Error("Nie znaleziono fiszki");
      }

      const response = await fetch(`/api/flashcards/${id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front_text: flashcard.front_text,
          back_text: flashcard.back_text,
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaakceptować fiszki");
      }

      setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
      toast.success("Fiszka została zaakceptowana");
    } catch (error) {
      console.error("Błąd podczas akceptowania fiszki:", error);
      toast.error("Nie udało się zaakceptować fiszki");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/flashcards/${id}/reject`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Nie udało się odrzucić fiszki");
      }

      setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
      toast.success("Fiszka została odrzucona");
    } catch (error) {
      console.error("Błąd podczas odrzucania fiszki:", error);
      toast.error("Nie udało się odrzucić fiszki");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (id: string, front_text: string, back_text: string) => {
    console.log("Edycja fiszki:", { id, front_text, back_text });
    const flashcard = flashcards.find((f) => f.id === id);
    if (!flashcard) return;

    setEditingFlashcard(flashcard);
    setIsEditDialogOpen(true);

    setFlashcards((prev) =>
      prev.map((flashcard) =>
        flashcard.id === id
          ? {
              ...flashcard,
              front_text,
              back_text,
            }
          : flashcard
      )
    );
  };

  const handleAcceptAll = async () => {
    try {
      setIsProcessing(true);
      await Promise.all(flashcards.map((flashcard) => handleAccept(flashcard.id)));
      toast.success("Wszystkie fiszki zostały zaakceptowane");
    } catch (error) {
      console.error("Błąd podczas akceptowania wszystkich fiszek:", error);
      toast.error("Nie udało się zaakceptować wszystkich fiszek");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectAll = async () => {
    try {
      setIsProcessing(true);
      await Promise.all(flashcards.map((flashcard) => handleReject(flashcard.id)));
      toast.success("Wszystkie fiszki zostały odrzucone");
    } catch (error) {
      console.error("Błąd podczas odrzucania wszystkich fiszek:", error);
      toast.error("Nie udało się odrzucić wszystkich fiszek");
    } finally {
      setIsProcessing(false);
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
    <div className="space-y-8" data-testid="flashcards-manager">
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
            isProcessing={isProcessing}
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
