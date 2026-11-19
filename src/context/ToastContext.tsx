import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Toast } from '../types';

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string, title?: string) => string;
    error: (message: string, title?: string) => string;
    warning: (message: string, title?: string) => string;
    info: (message: string, title?: string) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toastData: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const duration = toastData.duration ?? 4000;
    const newToast: Toast = { ...toastData, id };

    setToasts(prev => [newToast, ...prev].slice(0, 5)); // Keep max 5

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = useMemo(() => ({
    success: (message: string, title?: string) => showToast({ type: 'success', message, title }),
    error: (message: string, title?: string) => showToast({ type: 'error', message, title, duration: 6000 }),
    warning: (message: string, title?: string) => showToast({ type: 'warning', message, title, duration: 5000 }),
    info: (message: string, title?: string) => showToast({ type: 'info', message, title }),
  }), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
