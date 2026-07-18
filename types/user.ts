export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
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
