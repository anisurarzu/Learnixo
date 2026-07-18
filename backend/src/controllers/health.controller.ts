import type { Response } from 'express';
import { sendSuccess } from '../utils/response';
import { aiService } from '../services/ai/ai.service';
import type { AuthenticatedRequest } from '../types';

/**
 * Health & stub domain controllers — ready for feature expansion.
 */
export class HealthController {
  check = async (_req: AuthenticatedRequest, res: Response) => {
    return sendSuccess(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };
}

export class AiStubController {
  summarize = async (req: AuthenticatedRequest, res: Response) => {
    const result = await aiService.summarizeDocument(req.params.id);
    return sendSuccess(res, result, 'AI summarization stub — not implemented yet');
  };
}

export const healthController = new HealthController();
export const aiStubController = new AiStubController();
