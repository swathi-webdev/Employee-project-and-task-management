import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useSidebar } from '../../context/SidebarContext';

export const Sidebar: React.FC = () => {
  const { employees, projects, tasks } = useApp();
  const {
    width,
    isCollapsed,
    isResizing,
    isMobileOpen,
    setIsMobileOpen,
    toggleCollapse,
    startResizing,
    resetWidth
  } = useSidebar();

  const activeEmployeesCount = employees.filter(e => e.status === 'Active').length;
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const openTasksCount = tasks.filter(t => t.status !== 'Completed').length;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      label: 'Employees',
      path: '/employees',
      icon: Users,
      badge: activeEmployeesCount,
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: Briefcase,
      badge: activeProjectsCount,
    },
    {
      label: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
      badge: openTasksCount,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        style={{ width: `${width}px` }}
        className={`fixed top-0 bottom-0 left-0 z-40 bg-navy-900 text-slate-300 flex flex-col border-r border-slate-800 lg:translate-x-0 ${
          isResizing ? 'transition-none' : 'transition-all duration-200'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-navy-950/40 select-none">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 ring-1 ring-white/15">
              <Layers className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-white tracking-tight text-sm truncate">
                    Employee Management System
                  </p>
                  
                </div>
                <span className="block text-[11px] text-slate-400 font-medium truncate">
                  Employee Project and task Management
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase select-none">
             Modules
            </div>
          )}

          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsMobileOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/30'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.badge > 0
                        ? 'bg-slate-800/80 text-brand-300 group-hover:bg-slate-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer: Collapse / Expand Toggle Button */}
        <div className="p-3 border-t border-slate-800/80 bg-navy-950/20">
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors text-xs font-semibold"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="truncate">Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>

        {/* Adjustable Drag Handle (Right Edge) */}
        <div
          onMouseDown={startResizing}
          onDoubleClick={resetWidth}
          title="Drag to adjust sidebar width (double click to reset)"
          className={`hidden lg:flex absolute top-0 right-0 w-2 h-full cursor-col-resize items-center justify-center group hover:bg-brand-500/30 transition-colors ${
            isResizing ? 'bg-brand-500' : ''
          }`}
        >
          <div className="w-0.5 h-8 bg-slate-600 rounded-full group-hover:bg-brand-400 transition-colors" />
        </div>
      </aside>
    </>
  );
};
