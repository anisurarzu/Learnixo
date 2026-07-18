import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { ALL_UPLOAD_MIME_TYPES, ERROR_CODES } from '../constants';
import { BadRequestError } from '../utils/errors';
import { sanitizeFileName } from '../utils/file';

const uploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR);

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    const safe = sanitizeFileName(file.originalname);
    cb(null, `${Date.now()}-${safe}`);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (!ALL_UPLOAD_MIME_TYPES.includes(file.mimetype)) {
    cb(new BadRequestError('Unsupported file type', ERROR_CODES.INVALID_FILE_TYPE));
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.UPLOAD_MAX_SIZE_MB * 1024 * 1024,
    files: 1,
  },
});
