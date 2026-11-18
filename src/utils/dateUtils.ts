import { format, parseISO, isAfter, isBefore, isToday, differenceInDays } from 'date-fns';

export const formatDate = (dateString?: string, formatStr = 'MMM dd, yyyy'): string => {
  if (!dateString) return '—';
  try {
    const date = typeof dateString === 'string' && dateString.length === 10
      ? parseISO(dateString)
      : new Date(dateString);
    return format(date, formatStr);
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString?: string): string => {
  return formatDate(dateString, 'MMM dd, yyyy h:mm a');
};

export const isTaskOverdue = (dueDateString?: string, status?: string): boolean => {
  if (!dueDateString || status === 'Completed') return false;
  try {
    const dueDate = parseISO(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(dueDate, today);
  } catch {
    return false;
  }
};

export const isTaskDueToday = (dueDateString?: string, status?: string): boolean => {
  if (!dueDateString || status === 'Completed') return false;
  try {
    const dueDate = parseISO(dueDateString);
    return isToday(dueDate);
  } catch {
    return false;
  }
};

export const isTaskUpcoming = (dueDateString?: string, status?: string, withinDays = 7): boolean => {
  if (!dueDateString || status === 'Completed') return false;
  try {
    const dueDate = parseISO(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = differenceInDays(dueDate, today);
    return diff >= 0 && diff <= withinDays;
  } catch {
    return false;
  }
};
