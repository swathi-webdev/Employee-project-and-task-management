import React from 'react';
import { ProjectPriority, TaskPriority } from '../../types';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: ProjectPriority | TaskPriority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  const getConfig = () => {
    switch (priority) {
      case 'Urgent':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <AlertCircle className="w-3 h-3 text-rose-600" />,
        };
      case 'High':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <ArrowUp className="w-3 h-3 text-orange-600" />,
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertTriangle className="w-3 h-3 text-amber-600" />,
        };
      case 'Low':
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
          icon: <ArrowDown className="w-3 h-3 text-slate-500" />,
        };
    }
  };

  const { bg, icon } = getConfig();

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium text-xs px-2 py-0.5 rounded-md border ${bg} select-none`}
    >
      {showIcon && icon}
      <span>{priority}</span>
    </span>
  );
};
