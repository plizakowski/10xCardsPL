import type { FlashcardStatus } from "../types";

export interface GetFlashcardsQueryParams {
  status?: FlashcardStatus;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ValidatedQueryParams {
  status?: FlashcardStatus;
  page: number;
  limit: number;
  sort: string;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateAndParseQueryParams(params: URLSearchParams): ValidatedQueryParams {
  const result: ValidatedQueryParams = {
    page: 1,
    limit: 20,
    sort: "newest",
  };

  // Walidacja statusu
  const status = params.get("status");
  if (status) {
    if (!["accepted", "rejected", "editing"].includes(status)) {
      throw new ValidationError("Nieprawidłowy status fiszki");
    }
    result.status = status as FlashcardStatus;
  }

  // Walidacja numeru strony
  const page = params.get("page");
  if (page) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      throw new ValidationError("Numer strony musi być dodatnią liczbą całkowitą");
    }
    result.page = pageNum;
  }

  // Walidacja limitu wyników
  const limit = params.get("limit");
  if (limit) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new ValidationError("Limit musi być liczbą całkowitą między 1 a 100");
    }
    result.limit = limitNum;
  }

  // Walidacja sortowania
  const sort = params.get("sort");
  if (sort && !["newest", "oldest"].includes(sort)) {
    throw new ValidationError("Nieprawidłowy parametr sortowania");
  }
  if (sort) {
    result.sort = sort;
  }

  return result;
}
