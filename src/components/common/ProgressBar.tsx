import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getColorClass = () => {
    if (clamped === 100) return 'bg-emerald-500';
    if (clamped >= 60) return 'bg-indigo-600';
    if (clamped >= 30) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs text-slate-500 font-medium">
          <span>Progress</span>
          <span className="text-slate-800 font-semibold">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} rounded-full transition-all duration-500 ease-out ${getColorClass()}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
