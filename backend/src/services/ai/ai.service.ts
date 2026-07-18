import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface AiCompletionRequest {
  system?: string;
  prompt: string;
  maxTokens?: number;
}

export interface AiCompletionResponse {
  content: string;
  provider: 'openai' | 'gemini' | 'stub';
  tokensUsed?: number;
}

/**
 * AI service layer — architecture only. No real model calls yet.
 */
export class AiService {
  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    logger.info('AI complete stub invoked', {
      hasOpenAi: Boolean(env.OPENAI_API_KEY),
      hasGemini: Boolean(env.GEMINI_API_KEY),
      promptLength: request.prompt.length,
    });

    return {
      content: '',
      provider: 'stub',
      tokensUsed: 0,
    };
  }

  async summarizeDocument(_documentId: string): Promise<AiCompletionResponse> {
    // Future: PDF extraction → chunk → summarize
    return this.complete({ prompt: 'summarize' });
  }

  async generateQuiz(_documentId: string): Promise<AiCompletionResponse> {
    return this.complete({ prompt: 'quiz' });
  }

  async generateFlashcards(_documentId: string): Promise<AiCompletionResponse> {
    return this.complete({ prompt: 'flashcards' });
  }
}

export const aiService = new AiService();
