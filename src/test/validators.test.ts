import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isFutureDate,
  isPositiveNumber,
  isEmailUnique,
  validateEmployeeForm,
  validateProjectDates,
  validateTaskDates,
  doesTaskExceedProjectEndDate,
  canCompleteTask,
  hasCircularTaskDependency,
  generateNextEmployeeId,
} from '../utils/validators';
import { Employee, Task, Subtask } from '../types';

describe('Validator Utilities', () => {
  it('validates email formats correctly', () => {
    expect(isValidEmail('test@company.com')).toBe(true);
    expect(isValidEmail('jane.doe@sub.domain.org')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });

  it('validates phone numbers correctly', () => {
    expect(isValidPhone('+1 (555) 234-5678')).toBe(true);
    expect(isValidPhone('555-1234567')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
  });

  it('rejects future joining dates', () => {
    const future = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
    const past = '2022-01-15';
    expect(isFutureDate(future)).toBe(true);
    expect(isFutureDate(past)).toBe(false);
  });

  it('validates positive salary', () => {
    expect(isPositiveNumber(100000)).toBe(true);
    expect(isPositiveNumber('85000')).toBe(true);
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-5000)).toBe(false);
    expect(isPositiveNumber('abc')).toBe(false);
  });

  it('enforces email uniqueness', () => {
    const mockEmployees: Employee[] = [
      {
        id: 'EMP-1001',
        name: 'Sarah',
        email: 'sarah@company.com',
        phone: '555-1234',
        department: 'Eng',
        designation: 'VP',
        joiningDate: '2021-01-01',
        employmentType: 'Full-time',
        salary: 100000,
        reportingManagerId: null,
        status: 'Active',
        avatar: '',
        address: '',
        createdAt: '',
        updatedAt: '',
      },
    ];

    expect(isEmailUnique('sarah@company.com', mockEmployees)).toBe(false);
    expect(isEmailUnique('SARAH@company.com', mockEmployees)).toBe(false);
    expect(isEmailUnique('new.person@company.com', mockEmployees)).toBe(true);
    // Editing self with same email should be valid
    expect(isEmailUnique('sarah@company.com', mockEmployees, 'EMP-1001')).toBe(true);
  });

  it('auto-generates next sequential employee ID', () => {
    const mockEmployees = [
      { id: 'EMP-1001' } as Employee,
      { id: 'EMP-1005' } as Employee,
      { id: 'EMP-1003' } as Employee,
    ];
    expect(generateNextEmployeeId(mockEmployees)).toBe('EMP-1006');
  });

  it('prevents self-referential reporting manager', () => {
    const data: Partial<Employee> = {
      id: 'EMP-1001',
      name: 'John Doe',
      email: 'john@company.com',
      phone: '555-1234567',
      department: 'Engineering',
      designation: 'Engineer',
      joiningDate: '2022-01-01',
      salary: 90000,
      employmentType: 'Full-time',
      status: 'Active',
      reportingManagerId: 'EMP-1001', // Self!
    };
    const errors = validateEmployeeForm(data, []);
    expect(errors.reportingManagerId).toBe('An employee cannot report to themselves');
  });
});

describe('Project and Task Date Constraints', () => {
  it('disallows project end date earlier than start date', () => {
    expect(validateProjectDates('2024-01-01', '2024-06-30')).toBeNull();
    expect(validateProjectDates('2024-06-30', '2024-01-01')).toBe(
      'End date cannot be earlier than start date'
    );
  });

  it('disallows task due date earlier than start date', () => {
    expect(validateTaskDates('2024-02-01', '2024-02-15')).toBeNull();
    expect(validateTaskDates('2024-02-15', '2024-02-01')).toBe(
      'Due date cannot be earlier than start date'
    );
  });

  it('flags warning when task due date exceeds project end date', () => {
    const projectEndDate = '2024-06-30';
    expect(doesTaskExceedProjectEndDate('2024-07-05', projectEndDate)).toBe(true);
    expect(doesTaskExceedProjectEndDate('2024-06-25', projectEndDate)).toBe(false);
  });
});

describe('Subtasks and Circular Dependency Rules', () => {
  it('blocks task completion if mandatory subtasks are incomplete', () => {
    const subtasks: Subtask[] = [
      { id: '1', title: 'Code review', completed: true, isMandatory: true },
      { id: '2', title: 'Deploy staging', completed: false, isMandatory: true },
      { id: '3', title: 'Write docs', completed: false, isMandatory: false },
    ];

    const result = canCompleteTask(subtasks);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('mandatory subtask(s) are incomplete');

    // When mandatory subtasks are finished, completion is allowed even if optional is pending
    const subtasks2: Subtask[] = [
      { id: '1', title: 'Code review', completed: true, isMandatory: true },
      { id: '2', title: 'Deploy staging', completed: true, isMandatory: true },
      { id: '3', title: 'Write docs', completed: false, isMandatory: false },
    ];
    expect(canCompleteTask(subtasks2).allowed).toBe(true);
  });

  it('detects and prevents circular task dependencies', () => {
    const allTasks: Task[] = [
      { id: 'TSK-1', parentTaskId: null } as Task,
      { id: 'TSK-2', parentTaskId: 'TSK-1' } as Task,
      { id: 'TSK-3', parentTaskId: 'TSK-2' } as Task,
    ];

    // Making TSK-1 have parent TSK-1 is direct circular
    expect(hasCircularTaskDependency('TSK-1', 'TSK-1', allTasks)).toBe(true);

    // Making TSK-1 have parent TSK-3 would create TSK-1 -> TSK-2 -> TSK-3 -> TSK-1
    expect(hasCircularTaskDependency('TSK-1', 'TSK-3', allTasks)).toBe(true);

    // Setting a new independent parent is valid
    expect(hasCircularTaskDependency('TSK-3', 'TSK-1', allTasks)).toBe(false);
  });
});
