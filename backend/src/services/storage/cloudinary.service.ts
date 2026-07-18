import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface UploadResult {
  url: string;
  publicId: string | null;
  provider: 'local' | 'cloudinary';
}

/**
 * Cloudinary stub — falls back to local URLs until credentials are set.
 */
export class CloudinaryService {
  get isConfigured(): boolean {
    return Boolean(
      env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
    );
  }

  async upload(_localPath: string, folder = 'learnixo'): Promise<UploadResult> {
    if (!this.isConfigured) {
      logger.upload('Cloudinary not configured — using local storage reference', {
        folder,
      });
      return {
        url: '',
        publicId: null,
        provider: 'local',
      };
    }

    // TODO: cloudinary.uploader.upload(localPath, { folder })
    throw new Error('Cloudinary upload not yet implemented — add SDK when ready');
  }

  async destroy(_publicId: string): Promise<void> {
    if (!this.isConfigured) return;
    // TODO: cloudinary.uploader.destroy(publicId)
  }
}

export const cloudinaryService = new CloudinaryService();
