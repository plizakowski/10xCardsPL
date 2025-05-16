import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home-page";

test.describe("Generowanie fiszek", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("Użytkownik może zobaczyć formularz generowania fiszek", async () => {
    await expect(homePage.generateFormTitle).toBeVisible();
    await expect(homePage.textareaInput).toBeVisible();
    await expect(homePage.generateButton).toBeVisible();
  });

  test("Użytkownik nie może wygenerować fiszek z za krótkim tekstem", async () => {
    await homePage.generateFlashcards(false);
    await homePage.expectErrorMessage();
  });

  // Test wymaga wdrożonego backendu i API, można oznaczyć jako skipped dla CI
  test.skip("Użytkownik może wygenerować fiszki z prawidłowym tekstem", async () => {
    // Opcjonalnie, możemy mockować odpowiedź API przy użyciu routingAPI
    // Przykład mockowania API w Playwright:
    /*
    await homePage.page.route('/api/ai/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          flashcards: [
            { id: '1', question: 'Pytanie 1', answer: 'Odpowiedź 1' },
            { id: '2', question: 'Pytanie 2', answer: 'Odpowiedź 2' }
          ]
        })
      });
    });
    */

    await homePage.generateFlashcards(true);

    // Jeśli mockujemy API, możemy odkomentować poniższą linię
    // await homePage.expectFlashcardsGenerated();
  });
});
