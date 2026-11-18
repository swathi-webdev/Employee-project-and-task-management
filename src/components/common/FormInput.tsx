import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  prefixIcon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  required,
  prefixIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

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

        <input
          id={inputId}
          className={`w-full py-2 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            prefixIcon ? 'pl-9 pr-3' : 'px-3'
          } ${
            error
              ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 text-rose-900 bg-rose-50/20'
              : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium animate-in fade-in duration-150">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
