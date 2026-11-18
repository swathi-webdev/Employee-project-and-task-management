import { Employee, Project, Task } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_PROJECTS, INITIAL_TASKS } from '../data/mockData';

const KEYS = {
  EMPLOYEES: 'ems_employees_v1',
  PROJECTS: 'ems_projects_v1',
  TASKS: 'ems_tasks_v1',
  SETTINGS: 'ems_settings_v1',
  API_CONFIG: 'ems_api_config_v1',
};

export interface ApiConfig {
  latencyMs: number;
  failureRate: number; // 0 to 1
  simulateFailures: boolean;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  latencyMs: 350,
  failureRate: 0,
  simulateFailures: false,
};

export interface AppSettings {
  companyName: string;
  currency: string;
  dateFormat: string;
  theme: 'light';
}

export const DEFAULT_SETTINGS: AppSettings = {
  companyName: 'Apex Enterprise Systems',
  currency: 'USD ($)',
  dateFormat: 'MMM dd, yyyy',
  theme: 'light',
};

export const storage = {
  getEmployees(): Employee[] {
    try {
      const stored = localStorage.getItem(KEYS.EMPLOYEES);
      if (!stored) {
        localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
        return INITIAL_EMPLOYEES;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load employees from localStorage', e);
      return INITIAL_EMPLOYEES;
    }
  },

  saveEmployees(employees: Employee[]): void {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(KEYS.PROJECTS);
      if (!stored) {
        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
        return INITIAL_PROJECTS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
      return INITIAL_PROJECTS;
    }
  },

  saveProjects(projects: Project[]): void {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  },

  getTasks(): Task[] {
    try {
      const stored = localStorage.getItem(KEYS.TASKS);
      if (!stored) {
        localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(KEYS.SETTINGS);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getApiConfig(): ApiConfig {
    try {
      const stored = localStorage.getItem(KEYS.API_CONFIG);
      return stored ? { ...DEFAULT_API_CONFIG, ...JSON.parse(stored) } : DEFAULT_API_CONFIG;
    } catch {
      return DEFAULT_API_CONFIG;
    }
  },

  saveApiConfig(config: ApiConfig): void {
    localStorage.setItem(KEYS.API_CONFIG, JSON.stringify(config));
  },

  resetAll(): void {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(KEYS.API_CONFIG, JSON.stringify(DEFAULT_API_CONFIG));
  },

  exportBackup(): string {
    const backup = {
      employees: this.getEmployees(),
      projects: this.getProjects(),
      tasks: this.getTasks(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.employees) && Array.isArray(data.projects) && Array.isArray(data.tasks)) {
        this.saveEmployees(data.employees);
        this.saveProjects(data.projects);
        this.saveTasks(data.tasks);
        if (data.settings) this.saveSettings(data.settings);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  }
};
