export interface ModelConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface ChatResponse {
  message: string;
  meta: {
    source: string;
  };
}
