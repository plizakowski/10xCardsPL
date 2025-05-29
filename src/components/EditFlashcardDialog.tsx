import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { FlashcardDTO } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="front"
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                className="col-span-3"
                data-testid="front-text-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="back"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tył fiszki
            </label>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="back"
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className="col-span-3"
                data-testid="back-text-input"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button onClick={handleSave} disabled={!frontText || !backText} data-testid="save-button">
            Zapisz zmiany
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
