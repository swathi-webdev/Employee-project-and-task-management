import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, Subtask } from '../../types';
import { useApp } from '../../hooks/useApp';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Avatar } from '../common/Avatar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDate, formatDateTime, isTaskOverdue } from '../../utils/dateUtils';
import {
  validateTaskDates,
  doesTaskExceedProjectEndDate,
  canCompleteTask,
  hasCircularTaskDependency,
} from '../../utils/validators';
import {
  X,
  Calendar,
  Clock,
  CheckSquare,
  MessageSquare,
  History,
  AlertTriangle,
  Plus,
  Trash2,
  Send,
  Save,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (task: Task) => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onDelete,
}) => {
  const {
    employees,
    projects,
    tasks: allTasks,
    updateTask,
    toggleSubtask,
    addCommentToTask,
    getEmployeeById,
    getProjectById,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskMandatory, setNewSubtaskMandatory] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Warning for project end date
  const [showEndDateWarningModal, setShowEndDateWarningModal] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<Partial<Task> | null>(null);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setIsEditing(false);
      setErrorMessage('');
      setNewCommentText('');
      setNewSubtaskTitle('');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const project = getProjectById(task.projectId);
  const assignee = getEmployeeById(task.assignedEmployeeId);
  const overdue = isTaskOverdue(task.dueDate, task.status);

  // Active employees for assignment
  const activeEmployees = employees.filter(e => e.status === 'Active');

  // Eligible parent tasks (same project or any project, excluding self and descendants)
  const eligibleParentTasks = allTasks.filter(
    t => t.id !== task.id && !hasCircularTaskDependency(task.id, t.id, allTasks)
  );

  const handleFieldChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAttempt = async () => {
    setErrorMessage('');

    // 1. Date order check
    const start = editedTask.startDate || task.startDate;
    const due = editedTask.dueDate || task.dueDate;
    const dateErr = validateTaskDates(start, due);
    if (dateErr) {
      setErrorMessage(dateErr);
      return;
    }

    // 2. Circular dependency check
    if (
      editedTask.parentTaskId &&
      hasCircularTaskDependency(task.id, editedTask.parentTaskId, allTasks)
    ) {
      setErrorMessage('Cannot set parent task: circular dependency detected.');
      return;
    }

    // 3. Mandatory subtasks completion check
    const targetStatus = editedTask.status || task.status;
    const currentSubtasks = editedTask.subtasks || task.subtasks;
    if (targetStatus === 'Completed') {
      const check = canCompleteTask(currentSubtasks);
      if (!check.allowed) {
        setErrorMessage(check.reason || 'Mandatory subtasks are incomplete.');
        return;
      }
    }

    // 4. Project End Date Exceeded Warning
    if (project && doesTaskExceedProjectEndDate(due, project.endDate)) {
      setPendingSaveData(editedTask);
      setShowEndDateWarningModal(true);
      return;
    }

    await performSave(editedTask);
  };

  const performSave = async (data: Partial<Task>) => {
    try {
      setIsSaving(true);
      await updateTask(task.id, data, task.version);
      setIsEditing(false);
      setShowEndDateWarningModal(false);
      setPendingSaveData(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update task.');
    } finally {
      setIsSaving(false);
    }
  };

  // Subtask handlers
  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
      isMandatory: newSubtaskMandatory,
    };

    const updatedSubtasks = [...(editedTask.subtasks || task.subtasks), newSubtask];
    handleFieldChange('subtasks', updatedSubtasks);

    // If not in full edit mode, save immediately
    if (!isEditing) {
      updateTask(task.id, { subtasks: updatedSubtasks }, task.version);
    }

    setNewSubtaskTitle('');
    setNewSubtaskMandatory(false);
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = (editedTask.subtasks || task.subtasks).filter(s => s.id !== subtaskId);
    handleFieldChange('subtasks', updatedSubtasks);

    if (!isEditing) {
      updateTask(task.id, { subtasks: updatedSubtasks }, task.version);
    }
  };

  const handleSubtaskCheckbox = async (subtaskId: string) => {
    await toggleSubtask(task.id, subtaskId);
  };

  // Comment handler
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    await addCommentToTask(task.id, newCommentText);
    setNewCommentText('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                  {task.id}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
                  {project?.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                  >
                    Edit Task
                  </button>
                ) : (
                  <button
                    onClick={handleSaveAttempt}
                    disabled={isSaving}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(task)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border-b border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title & Description */}
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">Task Title</label>
                    <input
                      type="text"
                      value={editedTask.title ?? ''}
                      onChange={e => handleFieldChange('title', e.target.value)}
                      className="w-full px-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
                    />

                    <label className="block text-xs font-bold text-slate-700">Description</label>
                    <textarea
                      rows={3}
                      value={editedTask.description ?? ''}
                      onChange={e => handleFieldChange('description', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                      {task.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {task.description || 'No detailed description provided.'}
                    </p>
                  </>
                )}
              </div>

              {/* Status & Priority Grid */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Status
                  </span>
                  {isEditing ? (
                    <select
                      value={editedTask.status ?? task.status}
                      onChange={e => handleFieldChange('status', e.target.value as TaskStatus)}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-1.5"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <StatusBadge status={task.status} />
                  )}
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Priority
                  </span>
                  {isEditing ? (
                    <select
                      value={editedTask.priority ?? task.priority}
                      onChange={e => handleFieldChange('priority', e.target.value as TaskPriority)}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-1.5"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  ) : (
                    <PriorityBadge priority={task.priority} />
                  )}
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Assignee
                  </span>
                  {isEditing ? (
                    <select
                      value={editedTask.assignedEmployeeId ?? task.assignedEmployeeId}
                      onChange={e => handleFieldChange('assignedEmployeeId', e.target.value)}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-1.5"
                    >
                      {activeEmployees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.department})
                        </option>
                      ))}
                    </select>
                  ) : assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={assignee.name} src={assignee.avatar} size="xs" status={assignee.status} />
                      <span className="text-xs font-medium text-slate-800">{assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                  )}
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Due Date
                  </span>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedTask.dueDate ?? task.dueDate}
                      onChange={e => handleFieldChange('dueDate', e.target.value)}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-1.5"
                    />
                  ) : (
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        overdue ? 'text-rose-600' : 'text-slate-700'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(task.dueDate)}
                      {overdue && <span className="text-[10px] text-rose-500 font-bold">(Overdue)</span>}
                    </span>
                  )}
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Start Date
                  </span>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedTask.startDate ?? task.startDate}
                      onChange={e => handleFieldChange('startDate', e.target.value)}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-1.5"
                    />
                  ) : (
                    <span className="text-xs font-medium text-slate-700">
                      {formatDate(task.startDate)}
                    </span>
                  )}
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Hours (Est / Act)
                  </span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Est"
                        value={editedTask.estimatedHours ?? task.estimatedHours}
                        onChange={e => handleFieldChange('estimatedHours', Number(e.target.value))}
                        className="w-16 text-xs bg-white border border-slate-300 rounded p-1"
                      />
                      <span>/</span>
                      <input
                        type="number"
                        placeholder="Act"
                        value={editedTask.actualHours ?? task.actualHours}
                        onChange={e => handleFieldChange('actualHours', Number(e.target.value))}
                        className="w-16 text-xs bg-white border border-slate-300 rounded p-1"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-700">
                      {task.estimatedHours}h est. / {task.actualHours}h actual
                    </span>
                  )}
                </div>

                {/* Parent Task Selector */}
                <div className="col-span-2">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Parent Task (Hierarchy)
                  </span>
                  {isEditing ? (
                    <select
                      value={editedTask.parentTaskId ?? ''}
                      onChange={e => handleFieldChange('parentTaskId', e.target.value || null)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5"
                    >
                      <option value="">None (Top-level task)</option>
                      {eligibleParentTasks.map(pt => (
                        <option key={pt.id} value={pt.id}>
                          {pt.id}: {pt.title}
                        </option>
                      ))}
                    </select>
                  ) : task.parentTaskId ? (
                    <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {task.parentTaskId}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">None (Top-level task)</span>
                  )}
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-brand-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Mandatory items block task completion
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {(editedTask.subtasks || task.subtasks).map(sub => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50/60 transition-colors text-xs"
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          onChange={() => handleSubtaskCheckbox(sub.id)}
                          className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                        />
                        <span
                          className={`truncate ${
                            sub.completed ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {sub.title}
                        </span>
                        {sub.isMandatory && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                            Mandatory
                          </span>
                        )}
                      </label>

                      <button
                        onClick={() => handleDeleteSubtask(sub.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Delete subtask"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {(editedTask.subtasks || task.subtasks).length === 0 && (
                    <div className="text-xs text-slate-400 italic py-2">
                      No subtasks added yet.
                    </div>
                  )}
                </div>

                {/* Add Subtask Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add a new subtask..."
                    value={newSubtaskTitle}
                    onChange={e => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newSubtaskMandatory}
                      onChange={e => setNewSubtaskMandatory(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-rose-600 border-slate-300 focus:ring-rose-500"
                    />
                    <span>Mandatory</span>
                  </label>
                  <button
                    onClick={handleAddSubtask}
                    className="px-3 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Discussion ({task.comments.length})
                  </h3>
                </div>

                <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
                  {task.comments.map(c => (
                    <div key={c.id} className="flex gap-2.5 text-xs">
                      <Avatar name={c.authorName} src={c.authorAvatar} size="xs" />
                      <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{c.authorName}</span>
                          <span className="text-[10px] text-slate-400">
                            {formatDateTime(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}

                  {task.comments.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      No comments yet. Start the conversation!
                    </p>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </form>
              </div>

              {/* Activity Log */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Activity History
                  </h3>
                </div>

                <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-2">
                  {task.activityHistory.map(act => (
                    <div key={act.id} className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">{act.user}</span>{' '}
                      <span>{act.action}</span>
                      <span className="block text-[10px] text-slate-400">
                        {formatDateTime(act.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning confirmation for task due date exceeding project end date */}
      {showEndDateWarningModal && (
        <ConfirmDialog
          isOpen={showEndDateWarningModal}
          onClose={() => {
            setShowEndDateWarningModal(false);
            setPendingSaveData(null);
          }}
          onConfirm={() => {
            if (pendingSaveData) {
              performSave(pendingSaveData);
            }
          }}
          title="Task Exceeds Project Deadline"
          message={`The proposed task due date (${editedTask.dueDate}) is later than the parent project's scheduled end date (${project?.endDate}). Are you sure you want to proceed?`}
          confirmText="Accept & Save Anyway"
          variant="warning"
          warnings={{
            title: 'Project Milestone Warning',
            items: [
              `Project: ${project?.name} (${project?.id})`,
              `Project End Date: ${project?.endDate}`,
              `Task Due Date: ${editedTask.dueDate}`,
              'This may cause project timeline slippage.',
            ],
          }}
        />
      )}
    </>
  );
};
