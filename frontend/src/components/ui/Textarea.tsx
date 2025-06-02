import React from 'react';
import { cn } from '@/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helper,
  className,
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors resize-none',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500',
          'dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helper}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
