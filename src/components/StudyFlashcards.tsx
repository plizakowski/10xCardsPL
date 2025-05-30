import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  lastReviewed?: Date;
  nextReview?: Date;
  easeFactor?: number;
}

interface APIFlashcard {
  id: string;
  front_text: string;
  back_text: string;
  status: string;
  user_id: string;
}

interface APIResponse {
  data: APIFlashcard[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function StudyFlashcards() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        console.log("Pobieranie fiszek...");
        const params = new URLSearchParams({
          status: "accepted",
          page: "1",
          limit: "100",
          sort: "newest",
        });
        const response = await fetch(`/api/flashcards?${params}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Błąd odpowiedzi API:", errorData);
          throw new Error("Nie udało się pobrać fiszek");
        }
        const data: APIResponse = await response.json();
        console.log("Pobrane dane:", data);

        if (!data.data || !Array.isArray(data.data)) {
          console.error("Nieprawidłowy format danych:", data);
          throw new Error("Nieprawidłowy format danych z API");
        }

        const mappedFlashcards = data.data.map((card) => ({
          id: card.id,
          front: card.front_text,
          back: card.back_text,
        }));
        console.log("Zmapowane fiszki:", mappedFlashcards);
        setFlashcards(mappedFlashcards);
      } catch (error) {
        console.error("Błąd podczas pobierania fiszek:", error);
        toast.error("Nie udało się pobrać fiszek do nauki");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const currentCard = flashcards[currentCardIndex];

  const handleShowAnswer = () => {
    setIsShowingAnswer(true);
  };

  const handleNextCard = () => {
    setIsShowingAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handleRate = (confidence: number) => {
    // Używamy confidence do przyszłej implementacji algorytmu powtórek
    console.log(`Zapamiętanie karty ocenione na: ${confidence}`);
    // TODO: Implement spaced repetition algorithm
    handleNextCard();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Ładowanie fiszek...</h2>
      </div>
    );
  }

  if (!currentCard || flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Brak fiszek do nauki</h2>
        <p className="mt-2 text-gray-600">Dodaj i zaakceptuj fiszki w sekcji generowania.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-4xl">
          <Card className="p-6">
            <div className="min-h-[200px] flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pytanie</h3>
                  <p className="text-gray-700 text-xl">{currentCard.front}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Odpowiedź</h3>
                  <p
                    className={`text-gray-700 text-xl ${!isShowingAnswer ? "blur-sm hover:blur-none transition-all duration-200" : ""}`}
                  >
                    {currentCard.back}
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                {!isShowingAnswer ? (
                  <Button onClick={handleShowAnswer} size="lg">
                    Pokaż odpowiedź
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-4 w-full">
                    <div className="text-sm text-gray-500 text-center mb-2">Jak dobrze pamiętałeś odpowiedź?</div>
                    <div className="flex justify-center space-x-4">
                      <Button onClick={() => handleRate(1)} variant="destructive" size="lg">
                        Trudne
                      </Button>
                      <Button onClick={() => handleRate(2)} variant="outline" size="lg">
                        Średnie
                      </Button>
                      <Button onClick={() => handleRate(3)} variant="default" size="lg">
                        Łatwe
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Fiszka {currentCardIndex + 1} z {flashcards.length}
          </div>
          <Button variant="outline" size="sm" onClick={handleNextCard}>
            Następna →
          </Button>
        </div>
      </div>
    </div>
  );
}
