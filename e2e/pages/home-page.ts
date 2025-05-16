import { type Page, type Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly generateFormTitle: Locator;
  readonly textareaInput: Locator;
  readonly generateButton: Locator;
  readonly characterCount: Locator;
  readonly errorMessage: Locator;
  readonly flashcardsList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.generateFormTitle = page.getByText("Tekst źródłowy");
    this.textareaInput = page.getByPlaceholder("Wklej tekst do analizy");
    this.generateButton = page.getByRole("button", { name: "Generuj fiszki" });
    this.characterCount = page.getByText(/Liczba znaków:/);
    this.errorMessage = page.getByText(/tekst musi zawierać/i);
    this.flashcardsList = page.locator('[data-testid="flashcards-list"]');
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.generateFormTitle).toBeVisible();
  }

  async enterText(text: string) {
    await this.textareaInput.fill(text);
    await expect(this.characterCount).toContainText(`${text.length} / 10000`);
  }

  async generateFlashcards(validText = true) {
    if (validText) {
      // Wprowadź tekst o odpowiedniej długości (min 1000 znaków)
      const text = "Sample text ".repeat(100); // 1200 znaków
      await this.enterText(text);
    } else {
      // Wprowadź za krótki tekst
      const text = "Too short";
      await this.enterText(text);
    }

    await this.generateButton.click();
  }

  async expectErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectFlashcardsGenerated() {
    // Oczekiwanie na pojawienie się listy fiszek
    await expect(this.flashcardsList).toBeVisible({ timeout: 10000 });

    // Sprawdzenie czy przynajmniej jedna fiszka jest widoczna
    const flashcardCount = await this.flashcardsList.locator("li").count();
    expect(flashcardCount).toBeGreaterThan(0);
  }
}
