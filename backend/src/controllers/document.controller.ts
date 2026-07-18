import type { Response } from 'express';
import path from 'path';
import { DocumentType } from '@prisma/client';
import { prisma } from '../database';
import { sendCreated, sendSuccess } from '../utils/response';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { buildStorageKey } from '../utils/file';
import { logger } from '../utils/logger';
import { cloudinaryService } from '../services/storage/cloudinary.service';
import { parsePagination, buildPaginatedResult } from '../utils/pagination';
import type { AuthenticatedRequest } from '../types';
import { env } from '../config/env';

function mimeToType(mime: string): DocumentType {
  if (mime === 'application/pdf') return DocumentType.PDF;
  if (mime.startsWith('image/')) return DocumentType.IMAGE;
  if (mime.startsWith('audio/')) return DocumentType.AUDIO;
  return DocumentType.OTHER;
}

/**
 * Document upload architecture — stores metadata + file.
 * PDF processing / AI summarization intentionally deferred.
 */
export class DocumentController {
  list = async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query);
    const where = { userId: req.user!.id };

    const [items, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.document.count({ where }),
    ]);

    return sendSuccess(res, buildPaginatedResult(items, total, page, limit));
  };

  upload = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      throw new BadRequestError('File is required');
    }

    const storageKey = buildStorageKey(req.user!.id, req.file.originalname);
    const localUrl = `${env.APP_URL}/uploads/${path.basename(req.file.path)}`;

    // Prepare Cloudinary path (no-op until configured)
    const cloud = await cloudinaryService.upload(
      req.file.path,
      `learnixo/${req.user!.id}`,
    );

    const document = await prisma.document.create({
      data: {
        userId: req.user!.id,
        title: (req.body.title as string) || req.file.originalname,
        description: (req.body.description as string) || null,
        type: mimeToType(req.file.mimetype),
        mimeType: req.file.mimetype,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        storageKey: cloud.publicId ?? storageKey,
        storageUrl: cloud.url || localUrl,
        cloudinaryId: cloud.publicId,
      },
    });

    logger.upload('Document uploaded', {
      documentId: document.id,
      userId: req.user!.id,
      mime: req.file.mimetype,
      size: req.file.size,
    });

    return sendCreated(
      res,
      { document },
      'Document uploaded. Processing pipeline not yet enabled.',
    );
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!document) throw new NotFoundError('Document not found');
    return sendSuccess(res, { document });
  };

  remove = async (req: AuthenticatedRequest, res: Response) => {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!document) throw new NotFoundError('Document not found');

    if (document.cloudinaryId) {
      await cloudinaryService.destroy(document.cloudinaryId);
    }

    await prisma.document.delete({ where: { id: document.id } });
    return sendSuccess(res, null, 'Document deleted');
  };
}

export const documentController = new DocumentController();
