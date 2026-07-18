import type { User } from '@prisma/client';

/** Public user DTO — never expose password hashes or tokens */
export type PublicUser = Omit<
  User,
  | 'passwordHash'
  | 'emailVerifyToken'
  | 'emailVerifyExpires'
  | 'passwordResetToken'
  | 'passwordResetExpires'
>;

export interface IRepository<T, CreateInput, UpdateInput> {
  findById(id: string): Promise<T | null>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<void>;
}
