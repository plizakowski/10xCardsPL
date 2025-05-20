import { useState } from "react";
import GenerateAIFlashcardsForm from "./GenerateAIFlashcardsForm";
import GeneratedFlashcardsList from "./GeneratedFlashcardsList";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export default function FlashcardsManager() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFlashcardsGenerated = async (newFlashcards: Flashcard[]) => {
    setFlashcards(newFlashcards);
  };

  const handleAccept = async (id: string) => {
    setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async (id: string, front: string, back: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ front, back }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaktualizować fiszki");
      }

      setFlashcards((prev) =>
        prev.map((flashcard) => (flashcard.id === id ? { ...flashcard, front, back } : flashcard))
      );
    } catch (error) {
      console.error("Błąd podczas aktualizacji fiszki:", error);
    } finally {
      setIsProcessing(false);
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

  const handleEdit = (flashcard: FlashcardDTO) => {
    if (flashcard.status === "accepted" || flashcard.status === "rejected") {
      toast.info("Edycja spowoduje powrót fiszki do stanu roboczego");
    setIsProcessing(true);
    try {
      const response = await fetch("/api/flashcards/accept-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: flashcards.map((f) => f.id) }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaakceptować wszystkich fiszek");
      }

      setFlashcards([]);
    } catch (error) {
      console.error("Błąd podczas akceptowania wszystkich fiszek:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectAll = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/flashcards/reject-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: flashcards.map((f) => f.id) }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się odrzucić wszystkich fiszek");
      }

      setFlashcards([]);
    } catch (error) {
      console.error("Błąd podczas odrzucania wszystkich fiszek:", error);
    } finally {
      setIsProcessing(false);
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
    <>
      <GenerateAIFlashcardsForm onFlashcardsGenerated={handleFlashcardsGenerated} />
      <GeneratedFlashcardsList
        flashcards={flashcards}
        onAccept={handleAccept}
        onReject={handleReject}
        onEdit={handleEdit}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
        isProcessing={isProcessing}
      />
    </>
  );
}
