import type { Response } from 'express';
import { userRepository } from '../repositories';
import { mapUserForClient } from '../utils/user-mapper';
import { sendSuccess } from '../utils/response';
import { ConflictError, NotFoundError } from '../utils/errors';
import { ERROR_CODES } from '../constants';
import type { AuthenticatedRequest } from '../types';

export class UserController {
  getProfile = async (req: AuthenticatedRequest, res: Response) => {
    const user = await userRepository.findById(req.user!.id);
    if (!user) throw new NotFoundError('User not found');
    return sendSuccess(res, { user: mapUserForClient(user) });
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as {
      firstName?: string;
      lastName?: string;
      username?: string;
      photo?: string | null;
    };

    if (body.username) {
      const existing = await userRepository.findByUsername(body.username);
      if (existing && existing.id !== req.user!.id) {
        throw new ConflictError('Username already taken', ERROR_CODES.USERNAME_EXISTS);
      }
    }

    const user = await userRepository.update(req.user!.id, {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      photo: body.photo,
    });

    return sendSuccess(res, { user: mapUserForClient(user) }, 'Profile updated');
  };
}

export const userController = new UserController();
