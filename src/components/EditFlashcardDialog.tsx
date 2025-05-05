import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { FlashcardDTO } from "@/types";

interface EditFlashcardDialogProps {
  flashcard: FlashcardDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (flashcard: FlashcardDTO) => void;
}

export default function EditFlashcardDialog({ flashcard, open, onOpenChange, onSave }: EditFlashcardDialogProps) {
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  useEffect(() => {
    if (flashcard) {
      setFrontText(flashcard.front_text);
      setBackText(flashcard.back_text);
    }
  }, [flashcard]);

  const handleSave = () => {
    if (!flashcard) return;
    
    onSave({
      ...flashcard,
      front_text: frontText,
      back_text: backText,
    });
    onOpenChange(false);
  };

  if (!flashcard) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edytuj fiszkę</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor="front"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Przód fiszki
            </label>
            <Textarea
              id="front"
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="back"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tył fiszki
            </label>
            <Textarea
              id="back"
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button onClick={handleSave}>Zapisz zmiany</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
