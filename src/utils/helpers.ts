import { Objective, KeyResult, Initiative, DashboardStats } from '../types';

export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.max((current / target) * 100, 0), 100);
};

export const getStatusFromProgress = (progress: number): 'not-started' | 'on-track' | 'at-risk' | 'behind' | 'completed' => {
  if (progress >= 100) return 'completed';
  if (progress >= 75) return 'on-track';
  if (progress >= 50) return 'at-risk';
  if (progress > 0) return 'behind';
  return 'not-started';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-success-500';
    case 'on-track':
      return 'bg-primary-500';
    case 'at-risk':
      return 'bg-warning-500';
    case 'behind':
      return 'bg-danger-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'on-track':
      return 'On Track';
    case 'at-risk':
      return 'At Risk';
    case 'behind':
      return 'Behind';
    case 'not-started':
      return 'Not Started';
    default:
      return 'Unknown';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return 'bg-danger-500';
    case 'high':
      return 'bg-warning-500';
    case 'medium':
      return 'bg-primary-500';
    case 'low':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

export const getInitiativeStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-success-500';
    case 'in-progress':
      return 'bg-primary-500';
    case 'on-hold':
      return 'bg-warning-500';
    case 'not-started':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

export const calculateDashboardStats = (
  objectives: Objective[],
  keyResults: KeyResult[],
  initiatives: Initiative[]
): DashboardStats => {
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(obj => obj.status === 'completed').length;
  
  const totalKeyResults = keyResults.length;
  const completedKeyResults = keyResults.filter(kr => kr.status === 'completed').length;
  
  const totalInitiatives = initiatives.length;
  const completedInitiatives = initiatives.filter(init => init.status === 'completed').length;
  
  const overallProgress = totalObjectives > 0 
    ? objectives.reduce((sum, obj) => sum + obj.progress, 0) / totalObjectives 
    : 0;

  return {
    totalObjectives,
    completedObjectives,
    totalKeyResults,
    completedKeyResults,
    totalInitiatives,
    completedInitiatives,
    overallProgress: Math.round(overallProgress),
  };
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
