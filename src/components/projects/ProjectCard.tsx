import React from 'react';
import { Project } from '../../types';
import { useApp } from '../../hooks/useApp';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Avatar } from '../common/Avatar';
import { formatDate } from '../../utils/dateUtils';
import { Calendar, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onView: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onView,
  onDelete,
}) => {
  const { getEmployeeById, calculateProjectProgress, getProjectTasks } = useApp();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const manager = getEmployeeById(project.managerId);
  const progress = calculateProjectProgress(project.id);
  const tasks = getProjectTasks(project.id);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Header: ID, Priority, Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded-md font-mono">
              {project.id}
            </span>
            <PriorityBadge priority={project.priority} />
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onView(project);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(project);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-400" />
                    Edit Project
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(project);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    Delete Project
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <h3
          onClick={() => onView(project)}
          className="text-base font-bold text-slate-900 mb-1.5 hover:text-brand-600 cursor-pointer transition-colors line-clamp-1"
        >
          {project.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        {/* Status & Dates */}
        <div className="flex items-center justify-between text-xs mb-4">
          <StatusBadge status={project.status} />
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(project.endDate)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <ProgressBar progress={progress} showLabel size="sm" />
          <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
            <span>Tasks Completed</span>
            <span className="font-semibold text-slate-700">
              {completedTasks} / {tasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Manager and Team */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {manager && (
            <Avatar
              name={manager.name}
              src={manager.avatar}
              size="xs"
              status={manager.status}
            />
          )}
          <div className="text-[11px]">
            <span className="text-slate-400 block text-[10px] leading-tight">Lead</span>
            <span className="font-semibold text-slate-800 leading-tight">
              {manager ? manager.name.split(' ')[0] : 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Team member avatars */}
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {project.employeeIds.slice(0, 3).map(empId => {
            const member = getEmployeeById(empId);
            if (!member) return null;
            return (
              <Avatar
                key={empId}
                name={member.name}
                src={member.avatar}
                size="xs"
                className="ring-2 ring-white"
              />
            );
          })}
          {project.employeeIds.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-slate-600">
              +{project.employeeIds.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
