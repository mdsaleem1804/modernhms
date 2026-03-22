import React from "react";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export function FormTextarea({
  label,
  required,
  error,
  id,
  className,
  rows = 2,
  ...props
}: FormTextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={textareaId} className="text-xs font-medium text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          "w-full rounded-md border px-2.5 py-1.5 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 resize-none",
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          error
            ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
            : "border-gray-300 bg-white hover:border-gray-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
    </div>
  );
}
