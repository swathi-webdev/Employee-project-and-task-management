import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '../../types';
import { useApp } from '../../hooks/useApp';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import { Calendar, CheckCircle2, Clock, MessageSquare, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isDraggingOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  isDraggingOverlay = false,
}) => {
  const { getEmployeeById, getProjectById } = useApp();

  const assignee = getEmployeeById(task.assignedEmployeeId);
  const project = getProjectById(task.projectId);
  const overdue = isTaskOverdue(task.dueDate, task.status);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick(task)}
      className={`bg-white rounded-xl p-3.5 border transition-all duration-150 cursor-grab active:cursor-grabbing select-none text-left ${
        isDragging
          ? 'opacity-30 border-brand-300 scale-95'
          : isDraggingOverlay
          ? 'shadow-2xl border-brand-500 ring-2 ring-brand-400 rotate-2'
          : 'border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Top: Project name and Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[140px]" title={project?.name}>
          {project?.name || task.projectId}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2 mb-2.5">
        {task.title}
      </h4>

      {/* Subtasks Progress Bar (if subtasks exist) */}
      {totalSubtasks > 0 && (
        <div className="mb-2.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
              Subtasks
            </span>
            <span className="font-semibold text-slate-700">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                completedSubtasks === totalSubtasks ? 'bg-emerald-500' : 'bg-brand-500'
              }`}
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom: Assignee, Due date, Comments */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {assignee ? (
            <Avatar
              name={assignee.name}
              src={assignee.avatar}
              size="xs"
              status={assignee.status}
            />
          ) : (
            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
          )}

          <div
            className={`flex items-center gap-1 text-[11px] font-medium ${
              overdue ? 'text-rose-600 font-semibold' : 'text-slate-500'
            }`}
          >
            {overdue ? <AlertCircle className="w-3 h-3 text-rose-500" /> : <Calendar className="w-3 h-3 text-slate-400" />}
            <span>{formatDate(task.dueDate, 'MMM d')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          {task.estimatedHours > 0 && (
            <span className="flex items-center gap-0.5" title="Estimated hours">
              <Clock className="w-3 h-3" />
              {task.estimatedHours}h
            </span>
          )}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-0.5" title="Comments">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
