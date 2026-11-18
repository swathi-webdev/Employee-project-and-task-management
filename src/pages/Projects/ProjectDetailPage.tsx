import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ProjectFormModal } from '../../components/projects/ProjectFormModal';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { TaskDrawer } from '../../components/tasks/TaskDrawer';
import { formatDate } from '../../utils/dateUtils';
import { Task, TaskStatus } from '../../types';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Users,
  CheckSquare,
  Plus,
  Clock,
  AlertTriangle,
  FolderGit2,
  CheckCircle2,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getProjectById,
    getEmployeeById,
    getProjectTasks,
    calculateProjectProgress,
    updateProject,
    deleteProject,
    createTask,
    optimisticMoveTaskStatus,
    deleteTask,
  } = useApp();

  const project = getProjectById(id || '');

  // Modals & Drawers
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Task filter inside project
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('');

  if (!project) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The project with ID "{id}" could not be found or has been deleted.
        </p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-xs"
        >
          Return to Projects Portfolio
        </button>
      </div>
    );
  }

  const manager = getEmployeeById(project.managerId);
  const progress = calculateProjectProgress(project.id);
  const projectTasks = getProjectTasks(project.id);

  const filteredTasks = taskStatusFilter
    ? projectTasks.filter(t => t.status === taskStatusFilter)
    : projectTasks;

  const completedTasksCount = projectTasks.filter(t => t.status === 'Completed').length;
  const activeTasks = projectTasks.filter(t => t.status !== 'Completed');

  const handleDelete = async () => {
    await deleteProject(project.id);
    navigate('/projects');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-xl hover:bg-brand-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Project</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Project Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded">
                  {project.id}
                </span>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <PriorityBadge priority={project.priority} />
            <StatusBadge status={project.status} size="md" />
          </div>
        </div>

        {/* Project Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-1">Project Lead</span>
            {manager ? (
              <Link
                to={`/employees/${manager.id}`}
                className="font-bold text-slate-900 hover:text-brand-600 flex items-center gap-2"
              >
                <Avatar name={manager.name} src={manager.avatar} size="xs" status={manager.status} />
                <span>{manager.name}</span>
              </Link>
            ) : (
              <span className="text-slate-400 italic">Unassigned</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-1">Timeline Schedule</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(project.startDate)} – {formatDate(project.endDate)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-1">Tasks Completed</span>
            <span className="font-bold text-slate-900">
              {completedTasksCount} / {projectTasks.length} ({progress}%)
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-1">Team Allocation</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {project.employeeIds.length} Engineer{project.employeeIds.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Calculated Progress Bar */}
        <div className="pt-2">
          <ProgressBar progress={progress} showLabel size="md" />
        </div>

        {/* Formatted Project Scope & Description */}
        {project.description && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Project Scope & Description
            </h4>
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              {project.description.split('\n').map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={idx} className="h-1" />;
                const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
                if (isBullet) {
                  const bulletContent = trimmed.replace(/^[•\-*]\s*/, '');
                  return (
                    <div key={idx} className="flex items-start gap-2.5 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 mt-2" />
                      <span className="flex-1 leading-relaxed text-slate-700">{bulletContent}</span>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Two Columns: Team Members & Associated Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocated Team Members */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-600" />
              Team Members ({project.employeeIds.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {project.employeeIds.map(empId => {
              const member = getEmployeeById(empId);
              if (!member) return null;
              const isManager = member.id === project.managerId;

              return (
                <Link
                  key={empId}
                  to={`/employees/${member.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      name={member.name}
                      src={member.avatar}
                      size="sm"
                      status={member.status}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {member.designation}
                      </div>
                    </div>
                  </div>

                  {isManager && (
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full shrink-0">
                      Lead
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Project Tasks Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600" />
                Sprint Tasks ({projectTasks.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage deliverables tied directly to this project's scope.
              </p>
            </div>

            {/* Task Filter */}
            <div className="flex items-center gap-2">
              <select
                value={taskStatusFilter}
                onChange={e => setTaskStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTasks.map(task => {
              const assignee = getEmployeeById(task.assignedEmployeeId);

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="py-3.5 first:pt-0 last:pb-0 hover:bg-slate-50/70 rounded-xl px-2.5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-slate-400">{task.id}</span>
                      <PriorityBadge priority={task.priority} />
                      <h4 className="font-bold text-slate-800 hover:text-brand-600 transition-colors truncate">
                        {task.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-slate-600">
                        {assignee ? (
                          <>
                            <Avatar name={assignee.name} src={assignee.avatar} size="xs" />
                            <span>{assignee.name}</span>
                          </>
                        ) : (
                          <span className="italic">Unassigned</span>
                        )}
                      </span>
                      <span>•</span>
                      <span>Due: {formatDate(task.dueDate)}</span>
                      {task.subtasks.length > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <select
                      value={task.status}
                      onClick={e => e.stopPropagation()}
                      onChange={async e => {
                        e.stopPropagation();
                        await optimisticMoveTaskStatus(task.id, e.target.value as TaskStatus);
                      }}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-medium cursor-pointer"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 italic">
                No tasks found for this project matching the selected filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialProject={project}
        onSubmit={async data => {
          await updateProject(project.id, data);
        }}
      />

      {/* Task Drawer */}
      <TaskDrawer
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onDelete={async t => {
          await deleteTask(t.id);
          setSelectedTask(null);
        }}
      />

      {/* New Task for this project modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        defaultProjectId={project.id}
        onSubmit={async data => {
          await createTask(data);
        }}
      />

      {/* Delete Project Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${project.name}" (${project.id})? All associated tasks will also be deleted.`}
        confirmText="Delete Project"
        variant="danger"
        warnings={
          activeTasks.length > 0
            ? {
                title: 'Active Tasks Found',
                items: activeTasks.map(t => `${t.title} (${t.status})`),
              }
            : undefined
        }
      />
    </div>
  );
};
