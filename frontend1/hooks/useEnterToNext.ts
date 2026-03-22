import { useCallback } from "react";

/**
 * Returns a keydown handler to attach to a <form>.
 * When Enter is pressed inside any input or select (not textarea),
 * it moves focus to the next focusable form control instead of
 * submitting the form.
 */
export function useEnterToNext() {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key !== "Enter") return;

      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();

      // Let textareas keep their default Enter (newline) behaviour.
      if (tag === "textarea") return;

      // Don't interfere with buttons (submit / cancel).
      if (tag === "button") return;

      e.preventDefault();

      // Collect every focusable control inside the form.
      const form = e.currentTarget;
      const focusable = Array.from(
        form.querySelectorAll<HTMLElement>(
          'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
      ).filter((el) => {
        // Skip hidden inputs and read-only non-interactive elements.
        const input = el as HTMLInputElement;
        return input.type !== "hidden" && !input.readOnly;
      });

      const idx = focusable.indexOf(target);
      if (idx !== -1 && idx < focusable.length - 1) {
        focusable[idx + 1].focus();
      }
    },
    []
  );

  return handleKeyDown;
}
