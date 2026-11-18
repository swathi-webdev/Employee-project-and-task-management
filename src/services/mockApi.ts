import { Employee, Project, Task } from '../types';
import { storage } from './storage';
import {
  validateEmployeeForm,
  validateProjectDates,
  validateTaskDates,
  canCompleteTask,
  hasCircularTaskDependency
} from '../utils/validators';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const simulateNetwork = async () => {
  const config = storage.getApiConfig();
  const latency = config.latencyMs || 300;
  // slight jitter +/- 100ms
  const actualLatency = Math.max(80, latency + (Math.random() * 100 - 50));
  await sleep(actualLatency);

  if (config.simulateFailures && config.failureRate > 0) {
    if (Math.random() < config.failureRate) {
      throw new Error('Simulated Network Error (500): Server temporarily unavailable. Please retry.');
    }
  }
};

export const api = {
  // ----------------------------------------------------
  // EMPLOYEES
  // ----------------------------------------------------
  async getEmployees(): Promise<Employee[]> {
    await simulateNetwork();
    return storage.getEmployees();
  },

  async createEmployee(employeeData: Omit<Employee, 'createdAt' | 'updatedAt'>): Promise<Employee> {
    await simulateNetwork();
    const employees = storage.getEmployees();

    const errors = validateEmployeeForm(employeeData, employees, false);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      throw new Error(firstError);
    }

    const now = new Date().toISOString();
    const newEmployee: Employee = {
      ...employeeData,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newEmployee, ...employees];
    storage.saveEmployees(updated);
    return newEmployee;
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    await simulateNetwork();
    const employees = storage.getEmployees();
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    const merged = { ...employees[index], ...updates, id }; // Employee ID cannot change

    const errors = validateEmployeeForm(merged, employees, true);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      throw new Error(firstError);
    }

    merged.updatedAt = new Date().toISOString();
    employees[index] = merged;
    storage.saveEmployees(employees);

    return merged;
  },

  async deleteEmployee(id: string): Promise<void> {
    await simulateNetwork();
    let employees = storage.getEmployees();
    const exists = employees.some(e => e.id === id);
    if (!exists) throw new Error(`Employee ${id} not found.`);

    // Cascade: clear reporting manager references
    employees = employees
      .filter(e => e.id !== id)
      .map(e => e.reportingManagerId === id ? { ...e, reportingManagerId: null } : e);
    storage.saveEmployees(employees);

    // Also remove from project assignments and managers if any
    const projects = storage.getProjects().map(proj => {
      let changed = false;
      let managerId = proj.managerId;
      let employeeIds = proj.employeeIds;

      if (managerId === id) {
        // Find another active employee or leave as is
        const fallback = employees.find(e => e.status === 'Active');
        managerId = fallback ? fallback.id : '';
        changed = true;
      }
      if (employeeIds.includes(id)) {
        employeeIds = employeeIds.filter(eId => eId !== id);
        changed = true;
      }
      return changed ? { ...proj, managerId, employeeIds, updatedAt: new Date().toISOString() } : proj;
    });
    storage.saveProjects(projects);
  },

  // ----------------------------------------------------
  // PROJECTS
  // ----------------------------------------------------
  async getProjects(): Promise<Project[]> {
    await simulateNetwork();
    return storage.getProjects();
  },

  async createProject(projectData: Omit<Project, 'createdAt' | 'updatedAt'>): Promise<Project> {
    await simulateNetwork();
    const projects = storage.getProjects();
    const employees = storage.getEmployees();

    if (!projectData.name?.trim()) {
      throw new Error('Project name is required.');
    }

    const dateErr = validateProjectDates(projectData.startDate, projectData.endDate);
    if (dateErr) {
      throw new Error(dateErr);
    }

    // Business Rule: Project managers must be active employees
    const manager = employees.find(e => e.id === projectData.managerId);
    if (!manager || manager.status !== 'Active') {
      throw new Error('Project manager must be an active employee.');
    }

    // Business Rule: Only active employees can be assigned to projects
    const inactiveAssignees = projectData.employeeIds.filter(empId => {
      const emp = employees.find(e => e.id === empId);
      return !emp || emp.status !== 'Active';
    });
    if (inactiveAssignees.length > 0) {
      throw new Error('Only active employees can be assigned to projects.');
    }

    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newProject, ...projects];
    storage.saveProjects(updated);
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await simulateNetwork();
    const projects = storage.getProjects();
    const employees = storage.getEmployees();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Project ${id} not found.`);
    }

    const merged = { ...projects[index], ...updates, id };

    if (!merged.name?.trim()) {
      throw new Error('Project name is required.');
    }

    const dateErr = validateProjectDates(merged.startDate, merged.endDate);
    if (dateErr) {
      throw new Error(dateErr);
    }

    if (updates.managerId) {
      const manager = employees.find(e => e.id === updates.managerId);
      if (!manager || manager.status !== 'Active') {
        throw new Error('Project manager must be an active employee.');
      }
    }

    if (updates.employeeIds) {
      const inactiveAssignees = updates.employeeIds.filter(empId => {
        const emp = employees.find(e => e.id === empId);
        return !emp || emp.status !== 'Active';
      });
      if (inactiveAssignees.length > 0) {
        throw new Error('Only active employees can be assigned to projects.');
      }
    }

    merged.updatedAt = new Date().toISOString();
    projects[index] = merged;
    storage.saveProjects(projects);
    return merged;
  },

  async deleteProject(id: string): Promise<void> {
    await simulateNetwork();
    const projects = storage.getProjects();
    const exists = projects.some(p => p.id === id);
    if (!exists) throw new Error(`Project ${id} not found.`);

    const updated = projects.filter(p => p.id !== id);
    storage.saveProjects(updated);

    // Delete or unassign associated tasks
    const tasks = storage.getTasks().filter(t => t.projectId !== id);
    storage.saveTasks(tasks);
  },

  // ----------------------------------------------------
  // TASKS
  // ----------------------------------------------------
  async getTasks(): Promise<Task[]> {
    await simulateNetwork();
    return storage.getTasks();
  },

  async createTask(taskData: Omit<Task, 'createdAt' | 'updatedAt'>): Promise<Task> {
    await simulateNetwork();
    const tasks = storage.getTasks();
    const employees = storage.getEmployees();

    if (!taskData.title?.trim()) {
      throw new Error('Task title is required.');
    }

    if (!taskData.projectId) {
      throw new Error('Project is required.');
    }

    // Business Rule: Only active employees can be assigned to new tasks
    if (taskData.assignedEmployeeId) {
      const emp = employees.find(e => e.id === taskData.assignedEmployeeId);
      if (!emp || emp.status !== 'Active') {
        throw new Error('Only active employees can be assigned to tasks.');
      }
    }

    const dateErr = validateTaskDates(taskData.startDate, taskData.dueDate);
    if (dateErr) {
      throw new Error(dateErr);
    }

    // Business Rule: Tasks cannot be completed while mandatory subtasks are incomplete
    if (taskData.status === 'Completed') {
      const check = canCompleteTask(taskData.subtasks || []);
      if (!check.allowed) {
        throw new Error(check.reason);
      }
    }

    // Business Rule: Circular task dependencies
    if (hasCircularTaskDependency(taskData.id, taskData.parentTaskId, tasks)) {
      throw new Error('Cannot assign parent task: circular dependency detected.');
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newTask, ...tasks];
    storage.saveTasks(updated);
    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>, expectedVersion?: number): Promise<Task> {
    await simulateNetwork();
    const tasks = storage.getTasks();
    const employees = storage.getEmployees();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Task ${id} not found.`);
    }

    const currentTask = tasks[index];

    // Concurrency conflict check
    if (expectedVersion !== undefined && currentTask.version !== undefined) {
      if (currentTask.version > expectedVersion) {
        throw new Error(
          'Conflict detected: This task was modified by another action. Please refresh and review latest changes before saving.'
        );
      }
    }

    const merged = { ...currentTask, ...updates, id };

    if (!merged.title?.trim()) {
      throw new Error('Task title is required.');
    }

    if (updates.assignedEmployeeId) {
      const emp = employees.find(e => e.id === updates.assignedEmployeeId);
      if (!emp || emp.status !== 'Active') {
        throw new Error('Only active employees can be assigned to tasks.');
      }
    }

    const dateErr = validateTaskDates(merged.startDate, merged.dueDate);
    if (dateErr) {
      throw new Error(dateErr);
    }

    // Business Rule: Tasks cannot be completed while mandatory subtasks are incomplete
    if (merged.status === 'Completed') {
      const check = canCompleteTask(merged.subtasks || []);
      if (!check.allowed) {
        throw new Error(check.reason);
      }
    }

    // Business Rule: Circular dependency
    if (updates.parentTaskId !== undefined && hasCircularTaskDependency(id, updates.parentTaskId, tasks)) {
      throw new Error('Cannot assign parent task: circular dependency detected.');
    }

    merged.version = (currentTask.version || 1) + 1;
    merged.updatedAt = new Date().toISOString();
    tasks[index] = merged;
    storage.saveTasks(tasks);
    return merged;
  },

  async deleteTask(id: string): Promise<void> {
    await simulateNetwork();
    const tasks = storage.getTasks();
    const exists = tasks.some(t => t.id === id);
    if (!exists) throw new Error(`Task ${id} not found.`);

    // If subtasks had this as parent, reset their parentTaskId to null
    const updated = tasks
      .filter(t => t.id !== id)
      .map(t => t.parentTaskId === id ? { ...t, parentTaskId: null } : t);

    storage.saveTasks(updated);
  }
};
