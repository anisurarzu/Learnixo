import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ALL_UPLOAD_MIME_TYPES } from '../constants';

export function sanitizeFileName(original: string): string {
  const base = path.basename(original).replace(/[^a-zA-Z0-9._-]/g, '_');
  return base.slice(0, 180);
}

export function buildStorageKey(userId: string, originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  return `${userId}/${uuidv4()}${ext}`;
}

export function isAllowedMimeType(mime: string): boolean {
  return ALL_UPLOAD_MIME_TYPES.includes(mime);
}

export function bytesToMb(bytes: number): number {
  return bytes / (1024 * 1024);
}
