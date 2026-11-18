import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../services/mockApi';
import { storage } from '../services/storage';

describe('API Business Rules Enforcement', () => {
  beforeEach(() => {
    storage.resetAll();
  });

  it('prohibits assigning inactive employee as project manager', async () => {
    const employees = storage.getEmployees();
    const inactiveEmployee = employees.find(e => e.status === 'Inactive');
    expect(inactiveEmployee).toBeDefined();

    await expect(
      api.createProject({
        id: 'PRJ-999',
        name: 'Invalid Project',
        description: 'Testing',
        managerId: inactiveEmployee!.id,
        employeeIds: [inactiveEmployee!.id],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        priority: 'Medium',
        status: 'Planning',
      })
    ).rejects.toThrow('Project manager must be an active employee');
  });

  it('prohibits assigning inactive employees to projects', async () => {
    const employees = storage.getEmployees();
    const activeEmployee = employees.find(e => e.status === 'Active')!;
    const inactiveEmployee = employees.find(e => e.status === 'Inactive')!;

    await expect(
      api.createProject({
        id: 'PRJ-998',
        name: 'Invalid Project Team',
        description: 'Testing',
        managerId: activeEmployee.id,
        employeeIds: [activeEmployee.id, inactiveEmployee.id],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        priority: 'Medium',
        status: 'Planning',
      })
    ).rejects.toThrow('Only active employees can be assigned to projects');
  });

  it('prohibits assigning inactive employees to tasks', async () => {
    const employees = storage.getEmployees();
    const inactiveEmployee = employees.find(e => e.status === 'Inactive')!;

    await expect(
      api.createTask({
        id: 'TSK-999',
        title: 'Task for Inactive Employee',
        description: 'Testing',
        projectId: 'PRJ-20261118-001',
        assignedEmployeeId: inactiveEmployee.id,
        priority: 'Low',
        status: 'To Do',
        startDate: '2024-02-01',
        dueDate: '2024-02-15',
        estimatedHours: 5,
        actualHours: 0,
        subtasks: [],
        comments: [],
        activityHistory: [],
      })
    ).rejects.toThrow('Only active employees can be assigned to tasks');
  });

  it('updates task version on edit and handles concurrency', async () => {
    const tasks = storage.getTasks();
    const targetTask = tasks[0];

    const updated = await api.updateTask(
      targetTask.id,
      { title: 'Brand New Title' },
      targetTask.version
    );

    expect(updated.title).toBe('Brand New Title');
    expect(updated.version).toBe((targetTask.version || 1) + 1);

    // Old version update should trigger conflict error
    await expect(
      api.updateTask(targetTask.id, { title: 'Conflicting Title' }, targetTask.version)
    ).rejects.toThrow('Conflict detected');
  });
});
