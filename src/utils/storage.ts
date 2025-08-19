import { Objective, KeyResult, Initiative } from '../types';

const STORAGE_KEYS = {
  OBJECTIVES: 'regenexx_objectives',
  KEY_RESULTS: 'regenexx_key_results',
  INITIATIVES: 'regenexx_initiatives',
};

export const storage = {
  getObjectives: (): Objective[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OBJECTIVES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveObjectives: (objectives: Objective[]): void => {
    localStorage.setItem(STORAGE_KEYS.OBJECTIVES, JSON.stringify(objectives));
  },

  getKeyResults: (): KeyResult[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KEY_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveKeyResults: (keyResults: KeyResult[]): void => {
    localStorage.setItem(STORAGE_KEYS.KEY_RESULTS, JSON.stringify(keyResults));
  },

  getInitiatives: (): Initiative[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INITIATIVES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveInitiatives: (initiatives: Initiative[]): void => {
    localStorage.setItem(STORAGE_KEYS.INITIATIVES, JSON.stringify(initiatives));
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.OBJECTIVES);
    localStorage.removeItem(STORAGE_KEYS.KEY_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.INITIATIVES);
  },
};
