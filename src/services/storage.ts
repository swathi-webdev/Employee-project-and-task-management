import { Employee, Project, Task } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_PROJECTS, INITIAL_TASKS } from '../data/mockData';

const KEYS = {
  EMPLOYEES: 'ems_employees_master',
  PROJECTS: 'ems_projects_master',
  TASKS: 'ems_tasks_master',
  SETTINGS: 'ems_settings_master',
  API_CONFIG: 'ems_api_config_master',
  CURRENT_USER: 'ems_current_user_id',
};

export interface ApiConfig {
  latencyMs: number;
  failureRate: number; // 0 to 1
  simulateFailures: boolean;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  latencyMs: 30,
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
  companyName: 'Employee Management System',
  currency: 'USD ($)',
  dateFormat: 'MMM dd, yyyy',
  theme: 'light',
};

export const storage = {
  getEmployees(): Employee[] {
    try {
      const stored =
        localStorage.getItem(KEYS.EMPLOYEES) ||
        localStorage.getItem('ems_employees_v8') ||
        localStorage.getItem('ems_employees_v7') ||
        localStorage.getItem('ems_employees');

      if (!stored) {
        localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
        return INITIAL_EMPLOYEES;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(parsed));
        return parsed;
      }
      return INITIAL_EMPLOYEES;
    } catch (e) {
      console.error('Failed to load employees from localStorage', e);
      return INITIAL_EMPLOYEES;
    }
  },

  saveEmployees(employees: Employee[]): void {
    const json = JSON.stringify(employees);
    localStorage.setItem(KEYS.EMPLOYEES, json);
    localStorage.setItem('ems_employees_v8', json);
  },

  getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(KEYS.PROJECTS);
      if (!stored) {
        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
        return INITIAL_PROJECTS;
      }
      const parsed: Project[] = JSON.parse(stored);
      let migrated = false;
      const updated = parsed.map(p => {
        if (p.id === 'PRJ-1') { migrated = true; return { ...p, id: 'PRJ-20261118-001' }; }
        if (p.id === 'PRJ-2') { migrated = true; return { ...p, id: 'PRJ-20261118-002' }; }
        if (p.id === 'PRJ-3') { migrated = true; return { ...p, id: 'PRJ-20261118-003' }; }
        return p;
      });
      if (migrated) {
        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(updated));
      }
      return updated;
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
      return INITIAL_PROJECTS;
    }
  },

  saveProjects(projects: Project[]): void {
    const json = JSON.stringify(projects);
    localStorage.setItem(KEYS.PROJECTS, json);
    localStorage.setItem('ems_projects_v8', json);
  },

  getTasks(): Task[] {
    try {
      const stored =
        localStorage.getItem(KEYS.TASKS) ||
        localStorage.getItem('ems_tasks_v8') ||
        localStorage.getItem('ems_tasks_v7') ||
        localStorage.getItem('ems_tasks');

      if (!stored) {
        localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      const parsed: Task[] = JSON.parse(stored);
      let migrated = false;
      const updated = parsed.map(t => {
        if (t.projectId === 'PRJ-1') { migrated = true; return { ...t, projectId: 'PRJ-20261118-001' }; }
        if (t.projectId === 'PRJ-2') { migrated = true; return { ...t, projectId: 'PRJ-20261118-002' }; }
        if (t.projectId === 'PRJ-3') { migrated = true; return { ...t, projectId: 'PRJ-20261118-003' }; }
        return t;
      });
      const json = JSON.stringify(updated);
      localStorage.setItem(KEYS.TASKS, json);
      localStorage.setItem('ems_tasks_v8', json);
      return updated;
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    const json = JSON.stringify(tasks);
    localStorage.setItem(KEYS.TASKS, json);
    localStorage.setItem('ems_tasks_v8', json);
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

  getCurrentUserId(): string {
    return localStorage.getItem(KEYS.CURRENT_USER) || '';
  },

  saveCurrentUserId(id: string): void {
    localStorage.setItem(KEYS.CURRENT_USER, id);
  },

  resetAll(): void {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(KEYS.API_CONFIG, JSON.stringify(DEFAULT_API_CONFIG));
    localStorage.removeItem(KEYS.CURRENT_USER);
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
