import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { storage, DEFAULT_SETTINGS, DEFAULT_API_CONFIG } from '../../services/storage';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { FormInput } from '../../components/common/FormInput';
import { SelectInput } from '../../components/common/SelectInput';
import {
  Settings,
  Cpu,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Database,
  ShieldCheck,
  Server,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    apiConfig,
    updateApiConfig,
    resetToDefaultData,
    employees,
    projects,
    tasks,
  } = useApp();

  const [localSettings, setLocalSettings] = useState(settings);
  const [localApiConfig, setLocalApiConfig] = useState(apiConfig);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
  };

  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiConfig(localApiConfig);
  };

  const handleExportBackup = () => {
    const jsonStr = storage.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ems_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const content = ev.target?.result as string;
        const success = storage.importBackup(content);
        if (success) {
          setImportStatus('Backup successfully imported! Reloading page...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus('Failed to import backup. Please check JSON format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Platform & Mock API Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Tune asynchronous simulation, latency parameters, persistence, and system defaults.
            </p>
          </div>
        </div>
      </div>

      {/* Mock API Simulation Tuning Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Cpu className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mock API Simulator</h3>
            <p className="text-xs text-slate-500">
              Simulate real-world network conditions and test optimistic updates rollback in Kanban.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveApiConfig} className="space-y-5">
          {/* Latency Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
              <span>Network Latency Simulation</span>
              <span className="font-mono text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded">
                {localApiConfig.latencyMs} ms
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={localApiConfig.latencyMs}
              onChange={e =>
                setLocalApiConfig({ ...localApiConfig, latencyMs: Number(e.target.value) })
              }
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Fast (50ms)</span>
              <span>Default (350ms)</span>
              <span>Slow 3G (2000ms)</span>
            </div>
          </div>

          {/* Failure Simulation Toggle */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Simulate API Network Failures (500 Internal Error)
                </span>
                <span className="text-[11px] text-slate-500">
                  Enables testing of optimistic drag-and-drop rollback in Kanban.
                </span>
              </div>
              <input
                type="checkbox"
                checked={localApiConfig.simulateFailures}
                onChange={e =>
                  setLocalApiConfig({
                    ...localApiConfig,
                    simulateFailures: e.target.checked,
                    failureRate: e.target.checked ? (localApiConfig.failureRate || 0.25) : 0,
                  })
                }
                className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500"
              />
            </label>

            {localApiConfig.simulateFailures && (
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Failure Probability Rate</span>
                  <span className="font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                    {Math.round(localApiConfig.failureRate * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={localApiConfig.failureRate}
                  onChange={e =>
                    setLocalApiConfig({ ...localApiConfig, failureRate: Number(e.target.value) })
                  }
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Apply Simulation Settings
            </button>
          </div>
        </form>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Sliders className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">General Workspace Settings</h3>
            <p className="text-xs text-slate-500">Company branding and regional formats.</p>
          </div>
        </div>

        <form onSubmit={handleSaveGeneral} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Organization / Company Name"
              value={localSettings.companyName}
              onChange={e => setLocalSettings({ ...localSettings, companyName: e.target.value })}
            />

            <SelectInput
              label="Currency Unit"
              value={localSettings.currency}
              options={['USD ($)', 'EUR (€)', 'GBP (£)', 'CAD ($)', 'AUD ($)']}
              onChange={e => setLocalSettings({ ...localSettings, currency: e.target.value })}
            />

            <SelectInput
              label="Date Display Format"
              value={localSettings.dateFormat}
              options={['MMM dd, yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy']}
              onChange={e => setLocalSettings({ ...localSettings, dateFormat: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Save General Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Persistence & Data Diagnostics */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Data Storage & Diagnostics</h3>
            <p className="text-xs text-slate-500">
              Browser LocalStorage persistence metrics and backup utilities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Employees</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{employees.length}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Projects</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{projects.length}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tasks</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{tasks.length}</div>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-800 rounded-xl">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Demo Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={async () => {
          await resetToDefaultData();
          setShowResetConfirm(false);
        }}
        title="Reset All Application Data"
        message="Are you sure you want to reset all employees, projects, tasks, and settings back to the initial demo seed dataset? All custom additions will be replaced."
        confirmText="Reset All Data"
        variant="danger"
      />
    </div>
  );
};
