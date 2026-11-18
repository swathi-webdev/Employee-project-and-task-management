import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, Subtask } from '../../types';
import { Modal } from '../common/Modal';
import { FormInput } from '../common/FormInput';
import { SelectInput } from '../common/SelectInput';
import { useApp } from '../../hooks/useApp';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  validateTaskDates,
  doesTaskExceedProjectEndDate,
  canCompleteTask,
  hasCircularTaskDependency,
  generateNextTaskId,
} from '../../utils/validators';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialTask?: Task | null;
  defaultStatus?: TaskStatus;
  defaultProjectId?: string;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  defaultStatus = 'To Do',
  defaultProjectId,
}) => {
  const { employees, projects, tasks: allTasks, currentUser } = useApp();
  const isEditing = Boolean(initialTask);

  const activeEmployees = employees.filter(e => e.status === 'Active');

  const [formData, setFormData] = useState<Omit<Task, 'createdAt' | 'updatedAt'>>({
    id: '',
    title: '',
    description: '',
    projectId: defaultProjectId || projects[0]?.id || '',
    assignedEmployeeId: activeEmployees[0]?.id || '',
    priority: 'Medium',
    status: defaultStatus,
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    estimatedHours: 8,
    actualHours: 0,
    parentTaskId: null,
    subtasks: [],
    comments: [],
    activityHistory: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtaskMandatory, setSubtaskMandatory] = useState(false);

  // Warning for project end date
  const [showEndDateWarningModal, setShowEndDateWarningModal] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setFormData({
        id: initialTask.id,
        title: initialTask.title,
        description: initialTask.description,
        projectId: initialTask.projectId,
        assignedEmployeeId: initialTask.assignedEmployeeId,
        priority: initialTask.priority,
        status: initialTask.status,
        startDate: initialTask.startDate,
        dueDate: initialTask.dueDate,
        estimatedHours: initialTask.estimatedHours,
        actualHours: initialTask.actualHours,
        parentTaskId: initialTask.parentTaskId,
        subtasks: initialTask.subtasks || [],
        comments: initialTask.comments || [],
        activityHistory: initialTask.activityHistory || [],
      });
    } else {
      const nextId = generateNextTaskId(allTasks);
      setFormData({
        id: nextId,
        title: '',
        description: '',
        projectId: defaultProjectId || projects[0]?.id || '',
        assignedEmployeeId: activeEmployees[0]?.id || '',
        priority: 'Medium',
        status: defaultStatus,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        estimatedHours: 8,
        actualHours: 0,
        parentTaskId: null,
        subtasks: [],
        comments: [],
        activityHistory: [
          {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'Created task',
            user: currentUser ? currentUser.name : 'System Admin',
          },
        ],
      });
    }
    setErrors({});
  }, [initialTask, isOpen, allTasks, projects, defaultStatus, defaultProjectId]);

  const selectedProject = projects.find(p => p.id === formData.projectId);

  // Eligible parent tasks
  const eligibleParents = allTasks.filter(
    t => t.id !== formData.id && !hasCircularTaskDependency(formData.id, t.id, allTasks)
  );

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: subtaskInput.trim(),
      completed: false,
      isMandatory: subtaskMandatory,
    };
    setFormData(prev => ({ ...prev, subtasks: [...prev.subtasks, newSub] }));
    setSubtaskInput('');
    setSubtaskMandatory(false);
  };

  const handleRemoveSubtask = (id: string) => {
    setFormData(prev => ({ ...prev, subtasks: prev.subtasks.filter(s => s.id !== id) }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    if (!formData.assignedEmployeeId) {
      newErrors.assignedEmployeeId = 'Assignee is required';
    }

    const dateErr = validateTaskDates(formData.startDate, formData.dueDate);
    if (dateErr) {
      newErrors.dueDate = dateErr;
    }

    // Check mandatory subtasks if marked completed
    if (formData.status === 'Completed') {
      const check = canCompleteTask(formData.subtasks);
      if (!check.allowed) {
        newErrors.status = check.reason || 'Mandatory subtasks are incomplete';
      }
    }

    // Circular dependency check
    if (
      formData.parentTaskId &&
      hasCircularTaskDependency(formData.id, formData.parentTaskId, allTasks)
    ) {
      newErrors.parentTaskId = 'Circular dependency detected in parent task';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check project end date warning
    if (
      selectedProject &&
      doesTaskExceedProjectEndDate(formData.dueDate, selectedProject.endDate) &&
      !showEndDateWarningModal
    ) {
      setShowEndDateWarningModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save task' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showEndDateWarningModal}
        onClose={onClose}
        title={isEditing ? `Edit Task (${formData.id})` : 'Create New Task'}
        subtitle="Specify task scope, assignee, sprint schedule, and subtasks."
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
              onClick={() => handleSubmit()}
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
                'Create Task'
              )}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput label="Task ID" value={formData.id} disabled helperText="Auto-generated" />

            <div className="sm:col-span-2">
              <FormInput
                label="Task Title"
                placeholder="e.g. Implement authentication middleware"
                value={formData.title}
                required
                error={errors.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Technical specs, acceptance criteria, links..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Project"
              value={formData.projectId}
              required
              options={projects.map(p => ({
                value: p.id,
                label: `${p.name} (${p.status})`,
              }))}
              error={errors.projectId}
              onChange={e => setFormData({ ...formData, projectId: e.target.value })}
            />

            <SelectInput
              label="Assigned Employee"
              value={formData.assignedEmployeeId}
              required
              options={activeEmployees.map(e => ({
                value: e.id,
                label: `${e.name} (${e.department})`,
              }))}
              error={errors.assignedEmployeeId}
              helperText="Only active employees can be assigned"
              onChange={e => setFormData({ ...formData, assignedEmployeeId: e.target.value })}
            />

            <SelectInput
              label="Priority"
              value={formData.priority}
              options={['Low', 'Medium', 'High', 'Urgent']}
              required
              onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
            />

            <SelectInput
              label="Status"
              value={formData.status}
              options={['To Do', 'In Progress', 'Review', 'Completed']}
              required
              error={errors.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
            />

            <FormInput
              label="Start Date"
              type="date"
              value={formData.startDate}
              required
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            />

            <FormInput
              label="Due Date"
              type="date"
              value={formData.dueDate}
              required
              error={errors.dueDate}
              helperText={selectedProject ? `Project ends: ${selectedProject.endDate}` : ''}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            />

            <FormInput
              label="Estimated Hours"
              type="number"
              min="0"
              value={formData.estimatedHours}
              onChange={e => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
            />

            <SelectInput
              label="Parent Task (Optional)"
              value={formData.parentTaskId || ''}
              placeholder="None (Top-level)"
              options={eligibleParents.map(t => ({
                value: t.id,
                label: `${t.id}: ${t.title}`,
              }))}
              error={errors.parentTaskId}
              helperText="Prevents circular dependencies"
              onChange={e => setFormData({ ...formData, parentTaskId: e.target.value || null })}
            />
          </div>

          {/* Subtasks Builder */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Subtasks Checklist ({formData.subtasks.length})
            </span>

            <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
              {formData.subtasks.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-slate-200"
                >
                  <span className="truncate flex-1 text-slate-700">
                    {s.title}{' '}
                    {s.isMandatory && (
                      <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1 py-0.2 rounded">
                        Mandatory
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(s.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {formData.subtasks.length === 0 && (
                <div className="text-xs text-slate-400 italic">No subtasks added yet.</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="New subtask title..."
                value={subtaskInput}
                onChange={e => setSubtaskInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
              <label className="flex items-center gap-1 text-[11px] text-slate-600 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={subtaskMandatory}
                  onChange={e => setSubtaskMandatory(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-rose-600"
                />
                <span>Mandatory</span>
              </label>
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirmation dialog for Task Due Date exceeding Project End Date */}
      {showEndDateWarningModal && (
        <ConfirmDialog
          isOpen={showEndDateWarningModal}
          onClose={() => setShowEndDateWarningModal(false)}
          onConfirm={async () => {
            setShowEndDateWarningModal(false);
            try {
              setIsSubmitting(true);
              await onSubmit(formData);
              onClose();
            } catch (err: any) {
              setErrors({ form: err.message || 'Failed to save task' });
            } finally {
              setIsSubmitting(false);
            }
          }}
          title="Task Due Date Exceeds Project End Date"
          message={`The due date for this task (${formData.dueDate}) is past the project's target end date (${selectedProject?.endDate}). Do you want to accept this due date anyway?`}
          confirmText="Confirm & Create"
          variant="warning"
        />
      )}
    </>
  );
};
