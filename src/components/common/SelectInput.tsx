import React from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: (string | Option)[];
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  prefixIcon?: React.ReactNode;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  error,
  helperText,
  required,
  placeholder,
  prefixIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const normalizedOptions: Option[] = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className="w-full space-y-1">
      <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {prefixIcon}
          </div>
        )}

        <select
          id={inputId}
          className={`w-full py-2 pr-8 text-sm bg-white border rounded-lg appearance-none transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            prefixIcon ? 'pl-9' : 'px-3'
          } ${
            error
              ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 text-rose-900'
              : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalizedOptions.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </span>
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
