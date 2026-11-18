import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastNotification } from './components/common/ToastNotification';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Pages
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { EmployeeListPage } from './pages/Employees/EmployeeListPage';
import { EmployeeDetailPage } from './pages/Employees/EmployeeDetailPage';
import { ProjectListPage } from './pages/Projects/ProjectListPage';
import { ProjectDetailPage } from './pages/Projects/ProjectDetailPage';
import { TaskManagementPage } from './pages/Tasks/TaskManagementPage';

const AppLayout: React.FC = () => {
  const { loading } = useApp();
  const { width, isResizing, setIsMobileOpen } = useSidebar();
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Initializing enterprise workspace..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area dynamically offset by adjustable sidebar width */}
      <div
        style={{ paddingLeft: isDesktop ? `${width}px` : 0 }}
        className={`flex-1 flex flex-col min-w-0 ${isResizing ? 'transition-none' : 'transition-all duration-200'}`}
      >
        <Header onToggleSidebar={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full animate-in fade-in duration-200">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/projects" element={<ProjectListPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/tasks" element={<TaskManagementPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          <SidebarProvider>
            <AppLayout />
          </SidebarProvider>
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
