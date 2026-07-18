import { create } from 'zustand';
import type { PlannerTask, StudySession } from '@/types';

interface PlannerStore {
  tasks: PlannerTask[];
  sessions: StudySession[];
  selectedDate: string;
  setTasks: (tasks: PlannerTask[]) => void;
  addTask: (task: PlannerTask) => void;
  updateTask: (id: string, patch: Partial<PlannerTask>) => void;
  removeTask: (id: string) => void;
  setSessions: (sessions: StudySession[]) => void;
  setSelectedDate: (date: string) => void;
  reset: () => void;
}

export const usePlannerStore = create<PlannerStore>((set) => ({
  tasks: [],
  sessions: [],
  selectedDate: new Date().toISOString().slice(0, 10),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, patch) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  setSessions: (sessions) => set({ sessions }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  reset: () =>
    set({
      tasks: [],
      sessions: [],
      selectedDate: new Date().toISOString().slice(0, 10),
    }),
}));
