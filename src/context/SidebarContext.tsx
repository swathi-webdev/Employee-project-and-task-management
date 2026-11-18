import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SidebarContextType {
  width: number;
  isCollapsed: boolean;
  isResizing: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  toggleCollapse: () => void;
  setWidth: (width: number) => void;
  startResizing: (e: React.MouseEvent) => void;
  resetWidth: () => void;
}

const STORAGE_KEY = 'ems_sidebar_width';
const DEFAULT_WIDTH = 260;
const COLLAPSED_WIDTH = 70;
const MIN_WIDTH = 180;
const MAX_WIDTH = 420;

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [width, setWidthState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed >= COLLAPSED_WIDTH && parsed <= MAX_WIDTH) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_WIDTH;
  });

  const [isResizing, setIsResizing] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [lastExpandedWidth, setLastExpandedWidth] = useState(DEFAULT_WIDTH);

  const isCollapsed = width <= 90;

  const setWidth = useCallback((newWidth: number) => {
    const clamped = Math.max(COLLAPSED_WIDTH, Math.min(MAX_WIDTH, newWidth));
    setWidthState(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {}
    if (clamped > 90) {
      setLastExpandedWidth(clamped);
    }
  }, []);

  const resetWidth = useCallback(() => {
    setWidth(DEFAULT_WIDTH);
  }, [setWidth]);

  const toggleCollapse = useCallback(() => {
    if (isCollapsed) {
      setWidth(lastExpandedWidth > 120 ? lastExpandedWidth : DEFAULT_WIDTH);
    } else {
      setLastExpandedWidth(width);
      setWidth(COLLAPSED_WIDTH);
    }
  }, [isCollapsed, lastExpandedWidth, width, setWidth]);

  const startResizing = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = moveEvent.clientX;
        if (newWidth < 120) {
          setWidth(COLLAPSED_WIDTH);
        } else {
          setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth)));
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [setWidth]
  );

  return (
    <SidebarContext.Provider
      value={{
        width,
        isCollapsed,
        isResizing,
        isMobileOpen,
        setIsMobileOpen,
        toggleCollapse,
        setWidth,
        startResizing,
        resetWidth,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
