import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | FilterOption)[];
  icon?: React.ReactNode;
  allLabel?: string;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
  allLabel,
  className = '',
}) => {
  const normalizedOptions: FilterOption[] = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const isActive = Boolean(value);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="relative w-full">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full appearance-none pl-8 pr-8 py-2 text-sm rounded-lg border transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
            isActive
              ? 'bg-brand-50/50 border-brand-300 text-brand-900 font-medium'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="">{allLabel || `All ${label}`}</option>
          {normalizedOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon || <Filter className="w-3.5 h-3.5" />}
        </span>

        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </span>
      </div>
    </div>
  );
};
