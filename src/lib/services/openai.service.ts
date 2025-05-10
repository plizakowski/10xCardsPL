import type { ModelConfig, ChatResponse } from "./openai.types";

export class OpenAIService {
  private readonly _apiEndpoint: string;
  private readonly _timeout: number;
  private readonly _apiKey: string;
  private _retryCount = 3;
  private _retryDelay = 1000;

  public modelName: string;
  public systemPrompt: string;
  public modelParameters: ModelConfig;

  constructor() {
    // Inicjalizacja konfiguracji
    this._apiKey = import.meta.env.OPENAI_API_KEY;
    if (!this._apiKey) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables");
    }

    this._apiEndpoint =
      "https://sunopenaitesteastus.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview";
    this._timeout = 30000; // 30 sekund

    // Domyślne wartości
    this.modelName = "gpt-4";
    this.systemPrompt = "Jesteś inteligentnym i pomocnym asystentem.";
    this.modelParameters = {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0,
    };
  }

  public setModelConfig(config: ModelConfig): void {
    this.modelParameters = {
      ...this.modelParameters,
      ...config,
    };
  }

  public updateSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  public async sendChat(message: string): Promise<ChatResponse> {
    const payload = this._preparePayload(this.systemPrompt, message);

    for (let attempt = 1; attempt <= this._retryCount; attempt++) {
      try {
        const response = await fetch(this._apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._apiKey}`,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(this._timeout),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log("OpenAI API Response:", JSON.stringify(data, null, 2));
        return this._handleResponse(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        this._logError({ message: errorMessage, stack: error instanceof Error ? error.stack : undefined });

        if (attempt === this._retryCount) {
          throw new Error(`Failed to get response after ${this._retryCount} attempts: ${errorMessage}`);
        }

        await new Promise((resolve) => setTimeout(resolve, this._retryDelay * attempt));
      }
    }

    throw new Error("Unexpected error in sendChat");
  }

  private _preparePayload(systemMsg: string, userMsg: string): object {
    return {
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg },
      ],
      model: this.modelName,
      temperature: this.modelParameters.temperature,
      max_tokens: this.modelParameters.maxTokens,
      top_p: this.modelParameters.topP,
      frequency_penalty: this.modelParameters.frequencyPenalty,
      presence_penalty: this.modelParameters.presencePenalty,
      response_format: { type: "json_object" },
      functions: [
        {
          name: "generate_flashcards",
          description: "Generate flashcards from the given content",
          parameters: {
            type: "object",
            properties: {
              flashcards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    front: { type: "string" },
                    back: { type: "string" },
                  },
                  required: ["front", "back"],
                },
              },
            },
            required: ["flashcards"],
          },
        },
      ],
      function_call: { name: "generate_flashcards" },
    };
  }

  private _handleResponse(response: unknown): ChatResponse {
    try {
      console.log("Processing API Response:", JSON.stringify(response, null, 2));

      if (!response || typeof response !== "object" || !("choices" in response)) {
        console.error("Invalid response structure:", response);
        throw new Error("Invalid response format from API");
      }

      const choices = (response as { choices: { message?: { function_call?: { arguments: string } } }[] }).choices;
      if (!choices || !choices.length || !choices[0].message?.function_call?.arguments) {
        console.error("Invalid choices structure:", choices);
        throw new Error("Invalid response format from API");
      }

      const content = choices[0].message.function_call.arguments;
      console.log("Function call arguments:", content);

      const parsedContent = JSON.parse(content);
      console.log("Parsed content:", parsedContent);

      return {
        message: JSON.stringify(parsedContent),
        meta: {
          source: "openai_api",
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      this._logError({ message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
      throw new Error(`Failed to process response: ${errorMessage}`);
    }
  }

  private _logError(error: { message: string; stack?: string }): void {
    console.error("[OpenAIService Error]:", {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
    });
  }
}
