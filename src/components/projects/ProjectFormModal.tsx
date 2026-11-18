import React, { useState, useEffect } from 'react';
import { Project, ProjectPriority, ProjectStatus } from '../../types';
import { Modal } from '../common/Modal';
import { FormInput } from '../common/FormInput';
import { SelectInput } from '../common/SelectInput';
import { useApp } from '../../hooks/useApp';
import { validateProjectDates, generateNextProjectId } from '../../utils/validators';
import { Avatar } from '../common/Avatar';
import { AlertTriangle, Users } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Project, 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialProject?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialProject,
}) => {
  const { employees, projects } = useApp();
  const isEditing = Boolean(initialProject);

  const activeEmployees = employees.filter(e => e.status === 'Active');

  const [formData, setFormData] = useState<Omit<Project, 'createdAt' | 'updatedAt'>>({
    id: '',
    name: '',
    description: '',
    managerId: '',
    employeeIds: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    priority: 'Medium',
    status: 'Planning',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProject) {
      setFormData({
        id: initialProject.id,
        name: initialProject.name,
        description: initialProject.description,
        managerId: initialProject.managerId,
        employeeIds: initialProject.employeeIds,
        startDate: initialProject.startDate,
        endDate: initialProject.endDate,
        priority: initialProject.priority,
        status: initialProject.status,
      });
    } else {
      const nextId = generateNextProjectId(projects);
      const defaultManager = activeEmployees[0]?.id || '';
      setFormData({
        id: nextId,
        name: '',
        description: '',
        managerId: defaultManager,
        employeeIds: defaultManager ? [defaultManager] : [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        priority: 'Medium',
        status: 'Planning',
      });
    }
    setErrors({});
  }, [initialProject, isOpen, projects, employees]);

  const handleToggleEmployee = (empId: string) => {
    setFormData(prev => {
      const exists = prev.employeeIds.includes(empId);
      const newIds = exists
        ? prev.employeeIds.filter(id => id !== empId)
        : [...prev.employeeIds, empId];

      // If this employee is the manager, keep them in employeeIds
      if (empId === prev.managerId && exists) {
        // Warning: manager should ideally be in team members
      }
      return { ...prev, employeeIds: newIds };
    });
  };

  const handleManagerChange = (managerId: string) => {
    setFormData(prev => {
      // Ensure manager is included in assigned employees
      const ids = prev.employeeIds.includes(managerId)
        ? prev.employeeIds
        : [...prev.employeeIds, managerId];
      return { ...prev, managerId, employeeIds: ids };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.managerId) {
      newErrors.managerId = 'Project manager is required';
    }

    const dateErr = validateProjectDates(formData.startDate, formData.endDate);
    if (dateErr) {
      newErrors.endDate = dateErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save project' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Project (${formData.id})` : 'Create New Project'}
      subtitle="Define project timeline, lead manager, and allocate team members."
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.form && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            label="Project ID"
            value={formData.id}
            disabled
            helperText="Permanent Unique ID"
          />

          <div className="sm:col-span-2">
            <FormInput
              label="Project Name"
              placeholder="e.g. Mobile App Redesign"
              value={formData.name}
              required
              error={errors.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Project Description
          </label>
          <textarea
            rows={3}
            placeholder="High-level objectives, tech stack, and goals..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            label="Project Manager"
            value={formData.managerId}
            required
            options={activeEmployees.map(e => ({
              value: e.id,
              label: `${e.name} (${e.department} - ${e.designation})`,
            }))}
            error={errors.managerId}
            helperText="Must be an active employee"
            onChange={e => handleManagerChange(e.target.value)}
          />

          <SelectInput
            label="Priority"
            value={formData.priority}
            options={['Low', 'Medium', 'High', 'Urgent']}
            required
            onChange={e => setFormData({ ...formData, priority: e.target.value as ProjectPriority })}
          />

          <FormInput
            label="Start Date"
            type="date"
            value={formData.startDate}
            required
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
          />

          <FormInput
            label="Target End Date"
            type="date"
            value={formData.endDate}
            required
            error={errors.endDate}
            helperText="Cannot be earlier than start date"
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
          />

          <div className="sm:col-span-2">
            <SelectInput
              label="Project Status"
              value={formData.status}
              options={['Planning', 'In Progress', 'On Hold', 'Completed', 'Archived']}
              required
              onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
            />
          </div>
        </div>

        {/* Assigned Team Members (Multi-select) */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Assigned Team Members ({formData.employeeIds.length})</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Only active employees can be assigned
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
            {activeEmployees.map(emp => {
              const isAssigned = formData.employeeIds.includes(emp.id);
              const isManager = formData.managerId === emp.id;

              return (
                <label
                  key={emp.id}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    isAssigned
                      ? 'bg-brand-50/60 border-brand-200 text-brand-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isAssigned}
                    onChange={() => handleToggleEmployee(emp.id)}
                    className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                  />
                  <Avatar name={emp.name} src={emp.avatar} size="xs" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-800">
                      {emp.name} {isManager && <span className="text-[10px] text-brand-600 font-bold">(Manager)</span>}
                    </div>
                    <div className="truncate text-[10px] text-slate-400">
                      {emp.department} • {emp.designation}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
};
