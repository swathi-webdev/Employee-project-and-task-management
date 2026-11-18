import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
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
import { SettingsPage } from './pages/Settings/SettingsPage';

const AppLayout: React.FC = () => {
  const { loading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner fullPage message="Initializing enterprise workspace..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/projects" element={<ProjectListPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/tasks" element={<TaskManagementPage />} />
            <Route path="/settings" element={<SettingsPage />} />
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
          <AppLayout />
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
