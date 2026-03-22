import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export function FormSelect({
  label,
  options,
  required,
  error,
  placeholder,
  id,
  className,
  ...props
}: FormSelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-xs font-medium text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "h-9 w-full appearance-none rounded-md border px-2.5 py-1.5 text-sm text-gray-900 shadow-sm outline-none transition-all pr-8",
            "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
            error
              ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
              : "border-gray-300 bg-white hover:border-gray-400",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
      </div>
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
    </div>
  );
}
