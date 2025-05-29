import "@testing-library/jest-dom";
import { vi } from "vitest";
import { setupServer } from "msw/node";

// Konfiguracja globalna MSW
export const server = setupServer();

// Włączamy MSW dla wszystkich testów
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mockowanie nawigacji Astro w razie potrzeby
vi.mock("astro:transitions", () => ({
  navigate: vi.fn(),
  interpolate: vi.fn(),
}));

// Mockowanie Supabase dla testów jednostkowych
vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      auth: {
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getUser: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(),
          data: [],
          error: null,
        })),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      })),
    })),
  };
});

// Mock dla fetch API
global.fetch = vi.fn();

// Mock dla localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

global.localStorage = localStorageMock;

// Wyciszenie ostrzeżeń konsoli podczas testów
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
};

// Czyszczenie wszystkich mocków przed każdym testem
beforeEach(() => {
  vi.clearAllMocks();
});
