import { Employee, Task, Subtask } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  // Allow international and standard formats with digits, spaces, hyphens, plus, parenthesis
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const isFutureDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return inputDate.getTime() > today.getTime();
};

export const isPositiveNumber = (value: number | string): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const isEmailUnique = (email: string, employees: Employee[], currentEmployeeId?: string): boolean => {
  const lower = email.trim().toLowerCase();
  return !employees.some(
    emp => emp.email.trim().toLowerCase() === lower && emp.id !== currentEmployeeId
  );
};

export const isEmployeeIdUnique = (id: string, employees: Employee[]): boolean => {
  return !employees.some(emp => emp.id.trim().toUpperCase() === id.trim().toUpperCase());
};

export const validateEmployeeForm = (
  data: Partial<Employee>,
  existingEmployees: Employee[],
  isEditing = false
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.id?.trim()) {
    errors.id = 'Employee ID is required';
  } else if (!isEditing && !isEmployeeIdUnique(data.id, existingEmployees)) {
    errors.id = 'Employee ID already exists';
  }

  if (!data.name?.trim()) {
    errors.name = 'Full name is required';
  } else if (/\d/.test(data.name)) {
    errors.name = 'Full name cannot contain numbers';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  } else if (!isEmailUnique(data.email, existingEmployees, isEditing ? data.id : undefined)) {
    errors.email = 'This email is already in use by another employee';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number (at least 7 digits)';
  }

  if (!data.department?.trim()) {
    errors.department = 'Department is required';
  }

  if (!data.designation?.trim()) {
    errors.designation = 'Designation is required';
  }

  if (!data.joiningDate?.trim()) {
    errors.joiningDate = 'Joining date is required';
  } else if (isFutureDate(data.joiningDate)) {
    errors.joiningDate = 'Joining date cannot be in the future';
  }

  if (data.salary === undefined || data.salary === null || isNaN(Number(data.salary))) {
    errors.salary = 'Salary is required';
  } else if (!isPositiveNumber(data.salary)) {
    errors.salary = 'Salary must be a positive number greater than 0';
  }

  if (!data.employmentType) {
    errors.employmentType = 'Employment type is required';
  }

  if (!data.status) {
    errors.status = 'Status is required';
  }

  if (!data.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (data.reportingManagerId && data.id && data.reportingManagerId === data.id) {
    errors.reportingManagerId = 'An employee cannot report to themselves';
  }

  return errors;
};

export const validateProjectDates = (startDate: string, endDate: string): string | null => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    return 'End date cannot be earlier than start date';
  }
  return null;
};

export const validateTaskDates = (startDate: string, dueDate: string): string | null => {
  if (!startDate || !dueDate) return null;
  const start = new Date(startDate);
  const due = new Date(dueDate);
  if (due < start) {
    return 'Due date cannot be earlier than start date';
  }
  return null;
};

export const doesTaskExceedProjectEndDate = (taskDueDate: string, projectEndDate?: string): boolean => {
  if (!taskDueDate || !projectEndDate) return false;
  const taskDue = new Date(taskDueDate);
  const projEnd = new Date(projectEndDate);
  return taskDue > projEnd;
};

export const canCompleteTask = (subtasks: Subtask[] = []): { allowed: boolean; reason?: string } => {
  const incompleteMandatory = subtasks.filter(s => s.isMandatory && !s.completed);
  if (incompleteMandatory.length > 0) {
    return {
      allowed: false,
      reason: `Cannot complete task: ${incompleteMandatory.length} mandatory subtask(s) are incomplete (${incompleteMandatory.map(s => s.title).join(', ')})`,
    };
  }
  return { allowed: true };
};

export const hasCircularTaskDependency = (
  taskId: string,
  proposedParentId: string | null | undefined,
  allTasks: Task[]
): boolean => {
  if (!proposedParentId) return false;
  if (taskId === proposedParentId) return true;

  // Walk up the parent chain of proposedParentId to see if we reach taskId
  const visited = new Set<string>();
  let currentParentId: string | null | undefined = proposedParentId;

  while (currentParentId) {
    if (currentParentId === taskId) {
      return true; // Circular dependency detected!
    }
    if (visited.has(currentParentId)) {
      return true; // Cycle already in the graph
    }
    visited.add(currentParentId);

    const parentTask = allTasks.find(t => t.id === currentParentId);
    currentParentId = parentTask?.parentTaskId;
  }

  return false;
};

export const generateNextEmployeeId = (existingEmployees: Employee[]): string => {
  let maxNum = 1000;
  existingEmployees.forEach(emp => {
    const match = emp.id.match(/^EMP-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  return `EMP-${maxNum + 1}`;
};

export const generateNextProjectId = (existingProjects: { id: string }[]): string => {
  let maxNum = 0;
  existingProjects.forEach(prj => {
    const match = prj.id.match(/^PRJ-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  return `PRJ-${maxNum + 1}`;
};

export const generateNextTaskId = (existingTasks: Task[]): string => {
  let maxNum = 1000;
  existingTasks.forEach(tsk => {
    const match = tsk.id.match(/^TSK-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  return `TSK-${maxNum + 1}`;
};
