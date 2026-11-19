import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Check,
  ExternalLink,
  ChevronDown,
  User,
  Shield,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Avatar } from './Avatar';
import { useToast } from '../../context/ToastContext';
import {
  requestNotificationPermission,
  sendDesktopNotification
} from '../../utils/browserNotifications';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    employees,
    projects,
    tasks,
    currentUser: contextCurrentUser,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchDropdownOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const activeUser = contextCurrentUser || employees[0] || {
    id: 'EMP-1001',
    name: 'Abi',
    designation: 'Associate Product Manager',
    email: 'abi@company.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active' as const,
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile hamburger menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Middle: Search bar with shortcut and live results */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6 relative" ref={searchRef}>
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={globalSearch}
            onChange={e => {
              setGlobalSearch(e.target.value);
              setSearchDropdownOpen(true);
            }}
            onFocus={() => setSearchDropdownOpen(true)}
            placeholder="Search employees, projects, tasks..."
            className="w-full pl-9 pr-14 py-2 text-xs bg-slate-100 hover:bg-slate-100/80 border border-transparent rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-2xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-3xs">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Global search quick actions & matched records dropdown */}
        {searchDropdownOpen && globalSearch.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto divide-y divide-slate-100">
            {/* Matched Employees */}
            {(() => {
              const matchedEmps = employees
                .filter(
                  e =>
                    e.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
                    e.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
                    e.department.toLowerCase().includes(globalSearch.toLowerCase())
                )
                .slice(0, 3);

              const matchedProjs = projects
                .filter(
                  p =>
                    p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
                    p.id.toLowerCase().includes(globalSearch.toLowerCase())
                )
                .slice(0, 3);

              const matchedTasks = tasks
                .filter(
                  t =>
                    t.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
                    t.id.toLowerCase().includes(globalSearch.toLowerCase())
                )
                .slice(0, 3);

              const hasMatches =
                matchedEmps.length > 0 || matchedProjs.length > 0 || matchedTasks.length > 0;

              return (
                <>
                  {matchedEmps.length > 0 && (
                    <div className="py-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                        <span>Employees</span>
                        <span>{matchedEmps.length}</span>
                      </div>
                      {matchedEmps.map(emp => (
                        <button
                          key={emp.id}
                          onClick={() => {
                            navigate(`/employees/${emp.id}`);
                            setSearchDropdownOpen(false);
                            setGlobalSearch('');
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                        >
                          <Avatar name={emp.name} src={emp.avatar} size="xs" status={emp.status} />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-slate-800 truncate">
                              {emp.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {emp.department} • {emp.designation}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {matchedProjs.length > 0 && (
                    <div className="py-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                        <span>Projects</span>
                        <span>{matchedProjs.length}</span>
                      </div>
                      {matchedProjs.map(proj => (
                        <button
                          key={proj.id}
                          onClick={() => {
                            navigate(`/projects/${proj.id}`);
                            setSearchDropdownOpen(false);
                            setGlobalSearch('');
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center justify-between transition-colors"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="text-xs font-semibold text-slate-800 truncate">
                              {proj.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {proj.id} • {proj.status}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                            {proj.priority}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {matchedTasks.length > 0 && (
                    <div className="py-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                        <span>Tasks</span>
                        <span>{matchedTasks.length}</span>
                      </div>
                      {matchedTasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => {
                            navigate(`/tasks?selected=${task.id}`);
                            setSearchDropdownOpen(false);
                            setGlobalSearch('');
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center justify-between transition-colors"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="text-xs font-semibold text-slate-800 truncate">
                              {task.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {task.id} • {task.status}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {task.priority}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!hasMatches && (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No direct matches for "{globalSearch}"
                    </div>
                  )}

                  {/* Filter Redirect Shortcuts */}
                  <div className="pt-1 text-[11px]">
                    <button
                      onClick={() => {
                        navigate(`/employees?search=${encodeURIComponent(globalSearch)}`);
                        setSearchDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1 text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded flex items-center justify-between"
                    >
                      <span>Filter Employee Directory</span>
                      <span className="text-[10px] text-slate-400">Jump →</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/projects?search=${encodeURIComponent(globalSearch)}`);
                        setSearchDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1 text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded flex items-center justify-between"
                    >
                      <span>Filter Projects Portfolio</span>
                      <span className="text-[10px] text-slate-400">Jump →</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/tasks?search=${encodeURIComponent(globalSearch)}`);
                        setSearchDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1 text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded flex items-center justify-between"
                    >
                      <span>Filter Sprint Tasks</span>
                      <span className="text-[10px] text-slate-400">Jump →</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Right side: Notifications & User profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className={`relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all ${
              unreadCount > 0 ? 'hover:scale-105' : ''
            }`}
            title="Notifications"
          >
            <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-brand-600 animate-bounce' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <Check className="w-8 h-8 mx-auto mb-2 text-emerald-400 stroke-1" />
                    All caught up! No active warnings or deadlines.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                        !notif.read ? 'bg-brand-50/20' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Bell className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Outside Browser Notification Test Action */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Outside Desktop Alert:</span>
                <button
                  type="button"
                  onClick={async () => {
                    const perm = await requestNotificationPermission();
                    if (perm === 'granted') {
                      sendDesktopNotification({
                        title: 'Employee Management System (EMS)',
                        body: '🔔 Outside-browser alert received! Native OS notifications are active.',
                      });
                      toast.success('Outside desktop notification sent!', 'Notification Sent');
                    } else {
                      toast.info('Please allow notifications in browser permissions to receive outside alerts.', 'Permission Blocked');
                    }
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-white hover:bg-brand-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Bell className="w-3 h-3 text-brand-600" />
                  Test Desktop Alert
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Avatar
              name={activeUser.name}
              src={activeUser.avatar}
              size="sm"
              status={activeUser.status}
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {activeUser.name}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {activeUser.designation}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 w-64 max-w-[calc(100vw-1.5rem)]">
              <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                <Avatar
                  name={activeUser.name}
                  src={activeUser.avatar}
                  size="sm"
                  status={activeUser.status}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">{activeUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{activeUser.email}</div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">{activeUser.designation}</div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate(`/employees/${activeUser.id}`);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  View My Profile
                </button>
              </div>

              {/* Active User Assigned Projects */}
              {(() => {
                const userProjects = projects.filter(
                  p => p.employeeIds.includes(activeUser.id) || p.managerId === activeUser.id
                );
                if (userProjects.length === 0) return null;
                return (
                  <div className="px-3 py-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Assigned Projects
                    </div>
                    <div className="space-y-1">
                      {userProjects.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigate(`/projects/${p.id}`);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left text-[11px] font-medium text-slate-700 hover:text-brand-600 truncate flex items-center gap-1.5 py-0.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                          <span className="truncate">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
