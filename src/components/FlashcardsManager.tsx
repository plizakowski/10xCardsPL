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
