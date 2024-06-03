export interface ChatGptService {
    getResponse(message: string, systemPrompt?: string): Promise<string>;
    getEmbedding(message: string): Promise<number[] | string>;
    getAvailableApps(): Promise<string>;
  }