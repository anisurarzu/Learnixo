export type PlannerTaskStatus = 'todo' | 'in_progress' | 'done';
export type PlannerPriority = 'low' | 'medium' | 'high';

export interface PlannerTask {
  id: string;
  title: string;
  description?: string;
  status: PlannerTaskStatus;
  priority: PlannerPriority;
  dueDate?: string;
  estimatedMinutes?: number;
  documentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  completed: boolean;
}
