export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  id: string; // e.g. EMP-1001
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string; // YYYY-MM-DD
  employmentType: EmploymentType;
  salary: number;
  reportingManagerId: string | null; // Employee ID or null
  status: EmployeeStatus;
  avatar: string; // URL or base64
  address: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Archived';

export interface Project {
  id: string; // e.g. PRJ-101
  name: string;
  description: string;
  managerId: string; // Active Employee ID
  employeeIds: string[]; // Active Employee IDs assigned
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  priority: ProjectPriority;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  isMandatory: boolean;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface TaskActivity {
  id: string;
  timestamp: string;
  action: string;
  user: string;
}

export interface Task {
  id: string; // e.g. TSK-1001
  title: string;
  description: string;
  projectId: string; // Project ID
  assignedEmployeeId: string; // Employee ID
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  estimatedHours: number;
  actualHours: number;
  parentTaskId?: string | null;
  subtasks: Subtask[];
  comments: TaskComment[];
  activityHistory: TaskActivity[];
  version?: number; // for optimistic / concurrent edit handling
  createdAt: string;
  updatedAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface FilterOptions {
  search?: string;
  department?: string;
  designation?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  managerId?: string;
  employeeId?: string;
}
