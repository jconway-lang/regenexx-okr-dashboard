export interface Objective {
  id: string;
  title: string;
  description: string;
  quarter: string;
  year: number;
  progress: number;
  status: 'not-started' | 'on-track' | 'at-risk' | 'behind' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  status: 'not-started' | 'on-track' | 'at-risk' | 'behind' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  objectiveId?: string;
  keyResultId?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  dueDate: Date;
  progress: number;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalObjectives: number;
  completedObjectives: number;
  totalKeyResults: number;
  completedKeyResults: number;
  totalInitiatives: number;
  completedInitiatives: number;
  overallProgress: number;
}
