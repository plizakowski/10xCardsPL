import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenerateAIFlashcardsForm from "../GenerateAIFlashcardsForm";
import { server } from "@/test/setup";
import { http, HttpResponse } from "msw";

describe("GenerateAIFlashcardsForm", () => {
  const mockOnFlashcardsGenerated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    server.use(
      http.post("/api/generate-flashcards", () => {
        return HttpResponse.json({
          flashcards: [
            { id: "1", front: "Pytanie 1", back: "Odpowiedź 1" },
            { id: "2", front: "Pytanie 2", back: "Odpowiedź 2" },
          ],
        });
      })
    );
  });

  it("powinien renderować formularz z polem tekstowym i przyciskiem", () => {
    render(<GenerateAIFlashcardsForm onFlashcardsGenerated={mockOnFlashcardsGenerated} />);

    expect(screen.getByLabelText(/tekst źródłowy/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/wklej tekst do analizy/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generuj fiszki/i })).toBeInTheDocument();
  });

  it("powinien wyświetlać licznik znaków", () => {
    render(<GenerateAIFlashcardsForm onFlashcardsGenerated={mockOnFlashcardsGenerated} />);

    const textarea = screen.getByLabelText(/tekst źródłowy/i);
    const testText = "Test".repeat(100); // 400 znaków

    fireEvent.change(textarea, { target: { value: testText } });

    expect(screen.getByText(/liczba znaków: 400 \/ 10000/i)).toBeInTheDocument();
  });

  it("powinien wyświetlić błąd dla tekstu krótszego niż 1000 znaków", async () => {
    const { container } = render(<GenerateAIFlashcardsForm onFlashcardsGenerated={mockOnFlashcardsGenerated} />);

    const textarea = screen.getByLabelText(/tekst źródłowy/i);
    const testText = "Test".repeat(100); // 400 znaków

    fireEvent.change(textarea, { target: { value: testText } });

    // Przycisk powinien być wyłączony ze względu na za krótki tekst
    const submitButton = screen.getByRole("button", { name: /generuj fiszki/i });
    expect(submitButton).toBeDisabled();

    // Symulujemy zdarzenie submit na formularzu bezpośrednio
    const form = container.querySelector("form");
    fireEvent.submit(form);

    // Sprawdzamy czy po submicie pojawił się komunikat o błędzie
    await waitFor(() => {
      expect(screen.getByText(/tekst musi zawierać minimum 1000 znaków/i)).toBeInTheDocument();
    });

    expect(mockOnFlashcardsGenerated).not.toHaveBeenCalled();
  });

  it("powinien wysłać żądanie i wywołać callback po pomyślnym wygenerowaniu", async () => {
    render(<GenerateAIFlashcardsForm onFlashcardsGenerated={mockOnFlashcardsGenerated} />);

    const textarea = screen.getByLabelText(/tekst źródłowy/i);
    const testText = "Test".repeat(300); // 1200 znaków (powyżej minimum)

    fireEvent.change(textarea, { target: { value: testText } });
    const submitButton = screen.getByRole("button", { name: /generuj fiszki/i });
    fireEvent.click(submitButton);

    // Sprawdzenie czy przycisk pokazuje stan ładowania
    expect(screen.getByRole("button", { name: /generowanie/i })).toBeInTheDocument();

    // Oczekiwanie na zakończenie żądania
    await waitFor(() => {
      expect(mockOnFlashcardsGenerated).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: "1", front: "Pytanie 1", back: "Odpowiedź 1" }),
          expect.objectContaining({ id: "2", front: "Pytanie 2", back: "Odpowiedź 2" }),
        ])
      );
    });

    // Sprawdzenie czy formularz został zresetowany
    expect(textarea).toHaveValue("");
  });
});
