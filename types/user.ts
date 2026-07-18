import type { User } from './auth';

/**
 * Extended profile preferences (non-auth profile fields).
 */
export interface UserProfile extends User {
  bio?: string;
  studyGoal?: string;
  streakDays: number;
  totalStudyMinutes: number;
  preferredLanguage: string;
  notificationsEnabled: boolean;
}

export interface UserPreferences {
  language: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export function userToProfile(user: User, extras?: Partial<UserProfile>): UserProfile {
  return {
    ...user,
    streakDays: extras?.streakDays ?? 0,
    totalStudyMinutes: extras?.totalStudyMinutes ?? 0,
    preferredLanguage: extras?.preferredLanguage ?? 'en',
    notificationsEnabled: extras?.notificationsEnabled ?? true,
    bio: extras?.bio,
    studyGoal: extras?.studyGoal,
  };
}
