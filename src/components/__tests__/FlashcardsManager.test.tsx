import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FlashcardsManager from "../FlashcardsManager";
import { toast } from "sonner";

// Mock modułów
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Przykładowe dane testowe
const mockFlashcards = [
  {
    id: "1",
    front_text: "Pytanie 1",
    back_text: "Odpowiedź 1",
    status: "editing",
    user_id: "test-user",
  },
  {
    id: "2",
    front_text: "Pytanie 2",
    back_text: "Odpowiedź 2",
    status: "editing",
    user_id: "test-user",
  },
];

describe("FlashcardsManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renderuje się poprawnie", () => {
    render(<FlashcardsManager />);
    expect(screen.getByRole("heading", { name: /tekst źródłowy/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/wklej tekst do analizy/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generuj fiszki/i })).toBeInTheDocument();
  });

  it("akceptuje pojedynczą fiszkę", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ flashcards: mockFlashcards }) };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    render(<FlashcardsManager />);

    // Wypełnij formularz
    const textarea = screen.getByLabelText(/tekst źródłowy/i);
    await userEvent.type(textarea, "Test".repeat(300)); // 1200 znaków

    // Wyślij formularz
    const submitButton = screen.getByRole("button", { name: /generuj fiszki/i });
    await userEvent.click(submitButton);

    // Poczekaj na wyrenderowanie listy fiszek
    await waitFor(
      () => {
        expect(screen.getByTestId("accept-button-1")).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Kliknij przycisk akceptacji
    const acceptButton = screen.getByTestId("accept-button-1");
    await userEvent.click(acceptButton);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/flashcards/1/accept",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front_text: "Pytanie 1",
          back_text: "Odpowiedź 1",
        }),
      })
    );

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith("Fiszka została zaakceptowana");
      },
      { timeout: 10000 }
    );
  });

  it("odrzuca pojedynczą fiszkę", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ flashcards: mockFlashcards }) };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    render(<FlashcardsManager />);

    // Wypełnij formularz
    const textarea = screen.getByLabelText(/tekst źródłowy/i);
    await userEvent.type(textarea, "Test".repeat(300)); // 1200 znaków

    // Wyślij formularz
    const submitButton = screen.getByRole("button", { name: /generuj fiszki/i });
    await userEvent.click(submitButton);

    // Poczekaj na wyrenderowanie listy fiszek
    await waitFor(
      () => {
        expect(screen.getByTestId("reject-button-1")).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Kliknij przycisk odrzucenia
    const rejectButton = screen.getByTestId("reject-button-1");
    await userEvent.click(rejectButton);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/flashcards/1/reject",
      expect.objectContaining({
        method: "POST",
      })
    );

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith("Fiszka została odrzucona");
      },
      { timeout: 10000 }
    );
  });

  it("obsługuje błędy podczas akceptacji", async () => {
    const mockGenerateResponse = { ok: true, json: () => Promise.resolve({ flashcards: mockFlashcards }) };
    const mockAcceptResponse = { ok: false };
    global.fetch = vi.fn().mockResolvedValueOnce(mockGenerateResponse).mockResolvedValueOnce(mockAcceptResponse);

    render(<FlashcardsManager />);

    // Wypełnij formularz
    const textarea = screen.getByLabelText(/tekst źródłowy/i);
    await userEvent.type(textarea, "Test".repeat(300)); // 1200 znaków

    // Wyślij formularz
    const submitButton = screen.getByRole("button", { name: /generuj fiszki/i });
    await userEvent.click(submitButton);

    // Poczekaj na wyrenderowanie listy fiszek
    await waitFor(
      () => {
        expect(screen.getByTestId("accept-button-1")).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Kliknij przycisk akceptacji
    const acceptButton = screen.getByTestId("accept-button-1");
    await userEvent.click(acceptButton);

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith("Nie udało się zaakceptować fiszki");
      },
      { timeout: 10000 }
    );
  });

  it("obsługuje błędy podczas odrzucania", async () => {
    const mockGenerateResponse = { ok: true, json: () => Promise.resolve({ flashcards: mockFlashcards }) };
    const mockRejectResponse = { ok: false };
    global.fetch = vi.fn().mockResolvedValueOnce(mockGenerateResponse).mockResolvedValueOnce(mockRejectResponse);

    render(<FlashcardsManager />);

    // Wypełnij formularz
    const textarea = screen.getByLabelText(/tekst źródłowy/i);
    await userEvent.type(textarea, "Test".repeat(300)); // 1200 znaków

    // Wyślij formularz
    const submitButton = screen.getByRole("button", { name: /generuj fiszki/i });
    await userEvent.click(submitButton);

    // Poczekaj na wyrenderowanie listy fiszek
    await waitFor(
      () => {
        expect(screen.getByTestId("reject-button-1")).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Kliknij przycisk odrzucenia
    const rejectButton = screen.getByTestId("reject-button-1");
    await userEvent.click(rejectButton);

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith("Nie udało się odrzucić fiszki");
      },
      { timeout: 10000 }
    );
  });
});
