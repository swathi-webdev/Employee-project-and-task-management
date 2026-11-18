import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Employee, Project, Task, EmployeeStatus, TaskStatus, AppNotification } from '../types';
import { storage, ApiConfig, AppSettings } from '../services/storage';
import { api } from '../services/mockApi';
import { useToast } from './ToastContext';
import { isTaskOverdue, isTaskUpcoming } from '../utils/dateUtils';
import { canCompleteTask } from '../utils/validators';

interface AppContextType {
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  settings: AppSettings;
  apiConfig: ApiConfig;
  notifications: AppNotification[];
  currentUserId: string;
  currentUser: Employee | undefined;
  setCurrentUserId: (id: string) => void;
  // Getters
  getEmployeeById: (id: string) => Employee | undefined;
  getProjectById: (id: string) => Project | undefined;
  getTaskById: (id: string) => Task | undefined;
  calculateProjectProgress: (projectId: string) => number;
  getProjectTasks: (projectId: string) => Task[];
  getEmployeeProjects: (employeeId: string) => Project[];
  getEmployeeTasks: (employeeId: string) => Task[];
  getEmployeeActiveAssignments: (employeeId: string) => { projects: Project[]; tasks: Task[] };
  getActiveEmployees: () => Employee[];
  // Employee Actions
  createEmployee: (data: Omit<Employee, 'createdAt' | 'updatedAt'>) => Promise<Employee>;
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  bulkUpdateEmployeesStatus: (ids: string[], status: EmployeeStatus) => Promise<void>;
  bulkDeleteEmployees: (ids: string[]) => Promise<void>;
  // Project Actions
  createProject: (data: Omit<Project, 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  // Task Actions
  createTask: (data: Omit<Task, 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>, expectedVersion?: number) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  optimisticMoveTaskStatus: (taskId: string, targetStatus: TaskStatus) => Promise<boolean>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addCommentToTask: (taskId: string, content: string) => Promise<void>;
  // System Actions
  updateApiConfig: (config: ApiConfig) => void;
  updateSettings: (settings: AppSettings) => void;
  resetToDefaultData: () => Promise<void>;
  refreshAll: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [apiConfig, setApiConfig] = useState<ApiConfig>(storage.getApiConfig());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [currentUserId, setCurrentUserIdState] = useState<string>(storage.getCurrentUserId());

  const setCurrentUserId = useCallback((id: string) => {
    storage.saveCurrentUserId(id);
    setCurrentUserIdState(id);
  }, []);

  const currentUser = React.useMemo(() => {
    if (employees.length === 0) return undefined;
    return employees.find(e => e.id === currentUserId) || employees.find(e => e.status === 'Active') || employees[0];
  }, [employees, currentUserId]);

  // Initial load
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [empList, prjList, tskList] = await Promise.all([
        api.getEmployees(),
        api.getProjects(),
        api.getTasks()
      ]);
      setEmployees(empList);
      setProjects(prjList);
      setTasks(tskList);
      setSettings(storage.getSettings());
      setApiConfig(storage.getApiConfig());
    } catch (err: any) {
      toast.error(err.message || 'Failed to load initial data');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute live notifications based on overdue tasks & upcoming deadlines
  useEffect(() => {
    if (tasks.length === 0) return;
    const notifs: AppNotification[] = [];

    // Overdue tasks
    const overdueTasks = tasks.filter(t => isTaskOverdue(t.dueDate, t.status));
    overdueTasks.forEach(task => {
      notifs.push({
        id: `notif-overdue-${task.id}`,
        title: 'Task Overdue',
        message: `Task "${task.title}" was due on ${task.dueDate}.`,
        type: 'warning',
        timestamp: new Date().toISOString(),
        read: false,
        link: `/tasks?selected=${task.id}`
      });
    });

    // Upcoming tasks due today
    const dueToday = tasks.filter(t => t.status !== 'Completed' && t.dueDate === new Date().toISOString().split('T')[0]);
    dueToday.forEach(task => {
      notifs.push({
        id: `notif-today-${task.id}`,
        title: 'Task Due Today',
        message: `Task "${task.title}" is due today.`,
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false,
        link: `/tasks?selected=${task.id}`
      });
    });

    setNotifications(notifs);
  }, [tasks]);

  // --- Getters ---
  const getEmployeeById = useCallback((id: string) => {
    return employees.find(e => e.id === id);
  }, [employees]);

  const getProjectById = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const getTaskById = useCallback((id: string) => {
    return tasks.find(t => t.id === id);
  }, [tasks]);

  const getProjectTasks = useCallback((projectId: string) => {
    return tasks.filter(t => t.projectId === projectId);
  }, [tasks]);

  const calculateProjectProgress = useCallback((projectId: string): number => {
    const projTasks = tasks.filter(t => t.projectId === projectId);
    if (projTasks.length === 0) return 0;
    const completed = projTasks.filter(t => t.status === 'Completed').length;
    return Math.round((completed / projTasks.length) * 100);
  }, [tasks]);

  const getEmployeeProjects = useCallback((employeeId: string) => {
    return projects.filter(p => p.managerId === employeeId || p.employeeIds.includes(employeeId));
  }, [projects]);

  const getEmployeeTasks = useCallback((employeeId: string) => {
    return tasks.filter(t => t.assignedEmployeeId === employeeId);
  }, [tasks]);

  const getEmployeeActiveAssignments = useCallback((employeeId: string) => {
    const activeProjects = projects.filter(
      p => p.status !== 'Completed' && p.status !== 'Archived' && (p.managerId === employeeId || p.employeeIds.includes(employeeId))
    );
    const activeTasks = tasks.filter(
      t => t.status !== 'Completed' && t.assignedEmployeeId === employeeId
    );
    return { projects: activeProjects, tasks: activeTasks };
  }, [projects, tasks]);

  const getActiveEmployees = useCallback(() => {
    return employees.filter(e => e.status === 'Active');
  }, [employees]);

  // --- Employee Actions ---
  const createEmployee = async (data: Omit<Employee, 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await api.createEmployee(data);
      setEmployees(prev => [created, ...prev]);
      toast.success(`Employee ${created.name} (${created.id}) created successfully.`);
      return created;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create employee');
      throw err;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const updated = await api.updateEmployee(id, updates);
      setEmployees(prev => prev.map(e => (e.id === id ? updated : e)));
      toast.success(`Employee ${updated.name} updated successfully.`);
      return updated;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update employee');
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const emp = employees.find(e => e.id === id);
      await api.deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      // Refresh projects/tasks as cascade may have modified assignments
      const [updatedProjects, updatedTasks] = await Promise.all([
        api.getProjects(),
        api.getTasks()
      ]);
      setProjects(updatedProjects);
      setTasks(updatedTasks);
      toast.success(`Employee ${emp ? emp.name : id} deleted successfully.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete employee');
      throw err;
    }
  };

  const bulkUpdateEmployeesStatus = async (ids: string[], status: EmployeeStatus) => {
    try {
      for (const id of ids) {
        await api.updateEmployee(id, { status });
      }
      setEmployees(prev =>
        prev.map(e => (ids.includes(e.id) ? { ...e, status, updatedAt: new Date().toISOString() } : e))
      );
      toast.success(`Updated status of ${ids.length} employees to ${status}.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed bulk status update');
      throw err;
    }
  };

  const bulkDeleteEmployees = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await api.deleteEmployee(id);
      }
      setEmployees(prev => prev.filter(e => !ids.includes(e.id)));
      const [updatedProjects, updatedTasks] = await Promise.all([
        api.getProjects(),
        api.getTasks()
      ]);
      setProjects(updatedProjects);
      setTasks(updatedTasks);
      toast.success(`Deleted ${ids.length} employees.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed bulk delete');
      throw err;
    }
  };

  // --- Project Actions ---
  const createProject = async (data: Omit<Project, 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await api.createProject(data);
      setProjects(prev => [created, ...prev]);
      toast.success(`Project "${created.name}" created successfully.`);
      return created;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updated = await api.updateProject(id, updates);
      setProjects(prev => prev.map(p => (p.id === id ? updated : p)));
      toast.success(`Project "${updated.name}" updated successfully.`);
      return updated;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const prj = projects.find(p => p.id === id);
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setTasks(prev => prev.filter(t => t.projectId !== id));
      toast.success(`Project "${prj ? prj.name : id}" and associated tasks deleted.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete project');
      throw err;
    }
  };

  // --- Task Actions ---
  const createTask = async (data: Omit<Task, 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await api.createTask(data);
      setTasks(prev => [created, ...prev]);
      toast.success(`Task "${created.title}" created successfully.`);
      return created;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>, expectedVersion?: number) => {
    try {
      const updated = await api.updateTask(id, updates, expectedVersion);
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
      toast.success(`Task "${updated.title}" updated.`);
      return updated;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success(`Task "${task ? task.title : id}" deleted.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
      throw err;
    }
  };

  // Optimistic Move for Kanban Board with Automatic Rollback
  const optimisticMoveTaskStatus = async (taskId: string, targetStatus: TaskStatus): Promise<boolean> => {
    const originalTask = tasks.find(t => t.id === taskId);
    if (!originalTask) return false;
    if (originalTask.status === targetStatus) return true;

    // Check mandatory subtasks restriction if moving to Completed
    if (targetStatus === 'Completed') {
      const check = canCompleteTask(originalTask.subtasks || []);
      if (!check.allowed) {
        toast.error(check.reason || 'Cannot complete task with incomplete mandatory subtasks');
        return false;
      }
    }

    const previousStatus = originalTask.status;

    // 1. Optimistically update local state immediately
    const now = new Date().toISOString();
    const actorName = currentUser ? currentUser.name : 'System User';

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: targetStatus,
              updatedAt: now,
              activityHistory: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: now,
                  action: `Moved from ${previousStatus} to ${targetStatus}`,
                  user: actorName,
                },
                ...t.activityHistory,
              ],
            }
          : t
      )
    );

    // 2. Perform background simulated API update
    try {
      await api.updateTask(taskId, {
        status: targetStatus,
        activityHistory: [
          {
            id: `act-${Date.now()}`,
            timestamp: now,
            action: `Moved from ${previousStatus} to ${targetStatus}`,
            user: actorName,
          },
          ...originalTask.activityHistory,
        ],
      }, originalTask.version);
      return true;
    } catch (err: any) {
      // 3. Rollback to confirmed previous state on failure!
      console.warn('Kanban move failed, rolling back:', err);
      setTasks(prev => prev.map(t => (t.id === taskId ? originalTask : t)));
      toast.error(
        `Failed to update task status: ${err.message || 'Network error'}. Reverted to ${previousStatus}.`,
        'Update Reverted'
      );
      return false;
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(s =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    // If unchecking a mandatory subtask and task is Completed, should revert status to In Progress
    let newStatus = task.status;
    const hasUnfinishedMandatory = updatedSubtasks.some(s => s.isMandatory && !s.completed);
    if (hasUnfinishedMandatory && task.status === 'Completed') {
      newStatus = 'In Progress';
      toast.warning('Task status reverted to In Progress because mandatory subtask is incomplete.');
    }

    await updateTask(taskId, { subtasks: updatedSubtasks, status: newStatus }, task.version);
  };

  const addCommentToTask = async (taskId: string, content: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !content.trim()) return;

    const author = currentUser || {
      id: 'USER-1',
      name: 'User',
      avatar: '',
    };

    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar || '',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Added a comment',
      user: author.name,
    };

    await updateTask(taskId, {
      comments: [...task.comments, newComment],
      activityHistory: [newActivity, ...task.activityHistory],
    }, task.version);
  };

  // --- System Actions ---
  const updateApiConfig = (newConfig: ApiConfig) => {
    storage.saveApiConfig(newConfig);
    setApiConfig(newConfig);
    toast.info('API simulation configuration updated.');
  };

  const updateSettings = (newSettings: AppSettings) => {
    storage.saveSettings(newSettings);
    setSettings(newSettings);
    toast.success('Application settings saved.');
  };

  const resetToDefaultData = async () => {
    storage.resetAll();
    await loadData();
    toast.success('All data has been reset to default mock seed data.');
  };

  const refreshAll = async () => {
    await loadData();
    toast.info('Data refreshed.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        employees,
        projects,
        tasks,
        loading,
        settings,
        apiConfig,
        notifications,
        currentUserId,
        currentUser,
        setCurrentUserId,
        getEmployeeById,
        getProjectById,
        getTaskById,
        calculateProjectProgress,
        getProjectTasks,
        getEmployeeProjects,
        getEmployeeTasks,
        getEmployeeActiveAssignments,
        getActiveEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        bulkUpdateEmployeesStatus,
        bulkDeleteEmployees,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        optimisticMoveTaskStatus,
        toggleSubtask,
        addCommentToTask,
        updateApiConfig,
        updateSettings,
        resetToDefaultData,
        refreshAll,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
