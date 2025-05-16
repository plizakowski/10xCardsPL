import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  lastReviewed: Date;
  nextReview: Date;
  easeFactor: number;
}

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    front: "Co to jest React?",
    back: "React to biblioteka JavaScript do budowania interfejsów użytkownika.",
    lastReviewed: new Date(),
    nextReview: new Date(),
    easeFactor: 2.5,
  },
  {
    id: "2",
    front: "Co to jest TypeScript?",
    back: "TypeScript to typowany nadzbiór JavaScript, który kompiluje się do czystego JavaScript.",
    lastReviewed: new Date(),
    nextReview: new Date(),
    easeFactor: 2.5,
  },
];

export default function StudyFlashcards() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);
  const [flashcards] = useState<Flashcard[]>(mockFlashcards);

  const currentCard = flashcards[currentCardIndex];

  const handleShowAnswer = () => {
    setIsShowingAnswer(true);
  };

  const handleNextCard = () => {
    setIsShowingAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handleDifficultyRating = (rating: number) => {
    // TODO: Implement spaced repetition algorithm
    handleNextCard();
  };

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Brak fiszek do nauki</h2>
        <p className="mt-2 text-gray-600">Dodaj nowe fiszki w sekcji generowania.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-2xl">
          <Card className="p-6">
            <div className="min-h-[200px] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{isShowingAnswer ? "Odpowiedź" : "Pytanie"}</h3>
                <p className="text-gray-700 text-xl">{isShowingAnswer ? currentCard.back : currentCard.front}</p>
              </div>
              <div className="mt-6 flex justify-center">
                {!isShowingAnswer ? (
                  <Button onClick={handleShowAnswer} size="lg">
                    Pokaż odpowiedź
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-4 w-full">
                    <div className="text-sm text-gray-500 text-center mb-2">Jak dobrze pamiętałeś odpowiedź?</div>
                    <div className="flex justify-center space-x-4">
                      <Button onClick={() => handleDifficultyRating(1)} variant="destructive" size="lg">
                        Trudne
                      </Button>
                      <Button onClick={() => handleDifficultyRating(2)} variant="outline" size="lg">
                        Średnie
                      </Button>
                      <Button onClick={() => handleDifficultyRating(3)} variant="default" size="lg">
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
