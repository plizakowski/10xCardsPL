-- Add source_text column to ai_requests table
ALTER TABLE ai_requests ADD COLUMN source_text TEXT NOT NULL;

-- Add backfill data for existing rows (empty string as default)
UPDATE ai_requests SET source_text = '' WHERE source_text IS NULL; 