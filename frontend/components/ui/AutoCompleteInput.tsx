"use client";

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AutoCompleteOption = {
  id: string;
  label: string;
  meta?: string;
};

interface AutoCompleteInputProps {
  value: string;
  options: AutoCompleteOption[];
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
  onSelectOption?: (option: AutoCompleteOption) => void;
  inputRef?: (el: HTMLInputElement | null) => void;
}

export function AutoCompleteInput({
  value,
  options,
  placeholder,
  className,
  onChange,
  onSelectOption,
  inputRef,
}: AutoCompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!value.trim()) return options.slice(0, 8);
    return options
      .filter((option) => option.label.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 8);
  }, [options, value]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectOption = (option: AutoCompleteOption) => {
    onChange(option.label);
    onSelectOption?.(option);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
      return;
    }

    if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      event.stopPropagation();
      selectOption(filtered[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className={cn("h-9 w-full rounded-md border border-gray-200 px-2 text-xs font-semibold outline-none", className)}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filtered.map((option, idx) => (
            <button
              key={option.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option)}
              className={cn(
                "flex w-full items-center justify-between px-2 py-1.5 text-left text-xs",
                idx === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
              )}
            >
              <span className="font-semibold text-gray-700">{option.label}</span>
              {option.meta ? <span className="text-[10px] text-gray-400">{option.meta}</span> : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
