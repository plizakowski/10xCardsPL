/**
 * DTO i Command Model dla aplikacji Fiszki
 *
 * Ten plik zawiera definicje typów dla obiektów przesyłanych między klientem a serwerem.
 * DTO są oparte na modelach bazy danych zdefiniowanych w database.types.ts
 */

import type { Database } from "./db/database.types";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DatabaseTables = Database["public"]["Tables"];

// Podstawowe typy i enumy

/** Status fiszki */
export type FlashcardStatus = Database["public"]["Enums"]["flashcard_status"];

/** Typ źródła fiszki */
export type FlashcardSourceType = "manual" | "ai_full" | "ai_edited";

/** Typ źródła fiszki z opcjonalnym identyfikatorem zapytania */
export interface FlashcardSource {
  type: FlashcardSourceType;
  request_identifier?: string;
}

// DTO dla fiszek

/** Podstawowy DTO dla fiszki */
export interface FlashcardDTO {
  id: string;
  front_text: string;
  back_text: string;
  status: FlashcardStatus;
  user_id: string;
}

/** DTO fiszki z dodatkowymi informacjami o źródle */
export interface FlashcardResponseDTO extends FlashcardDTO {
  source?: FlashcardSource;
}

/** DTO dla paginacji */
export interface PaginationDTO {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/** DTO dla odpowiedzi z listą fiszek */
export interface GetFlashcardsResponseDTO {
  data: FlashcardResponseDTO[];
  pagination: PaginationDTO;
}

/** Command Model do tworzenia fiszki */
export interface CreateFlashcardCommand {
  front_text: string;
  back_text: string;
  status: FlashcardStatus;
  source?: {
    type: FlashcardSourceType;
    request_identifier?: string;
  };
}

/** DTO odpowiedzi dla utworzonej fiszki */
export type CreateFlashcardResponseDTO = FlashcardResponseDTO;

/** Command Model do masowego tworzenia fiszek */
export interface BatchCreateFlashcardsCommand {
  flashcards: CreateFlashcardCommand[];
}

/** DTO odpowiedzi dla masowo utworzonych fiszek */
export interface BatchCreateFlashcardsResponseDTO {
  success: boolean;
  created: number;
  flashcards: FlashcardResponseDTO[];
}

/** Command Model do aktualizacji fiszki */
export interface UpdateFlashcardCommand {
  front_text?: string;
  back_text?: string;
  status?: FlashcardStatus;
}

/** DTO odpowiedzi dla usuniętej fiszki */
export interface DeleteFlashcardResponseDTO {
  success: boolean;
  message: string;
}

// DTO dla generowania AI

/** Command Model do generowania fiszek przez AI */
export interface GenerateFlashcardsCommand {
  text: string;
}

/** DTO odpowiedzi dla wygenerowanych fiszek */
export interface GenerateFlashcardsResponseDTO {
  request_id: string;
  flashcards: FlashcardDTO[];
}

/** DTO statystyk generowania AI */
export interface AIGenerationStatsDTO {
  total_generations: number;
  total_generated_flashcards: number;
  accepted_flashcards: number;
  rejected_flashcards: number;
  acceptance_rate: number;
}

// DTO dla sesji nauki

/** DTO sesji nauki */
export interface StudySessionDTO {
  session_id: string;
  current_flashcard: {
    id: string;
    front_text: string;
    back_text: string;
  };
  total_cards: number;
  progress: number;
}

/** Command Model dla oceny fiszki */
export interface AnswerFlashcardCommand {
  session_id: string;
  score: number;
}

/** DTO odpowiedzi z następną fiszką */
export interface NextFlashcardResponseDTO {
  session_id: string;
  current_flashcard: {
    id: string;
    front_text: string;
    back_text: string;
  };
  total_cards: number;
  progress: number;
  is_completed: boolean;
}
