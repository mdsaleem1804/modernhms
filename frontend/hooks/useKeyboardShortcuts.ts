import { RefObject, useEffect } from "react";

type UseKeyboardShortcutsOptions = {
  scopeRef: RefObject<HTMLElement | null>;
  onNextField: () => void;
  onPrevField: () => void;
  onSave: () => void;
  onComplete: () => void;
  onAddPrescription: () => void;
};

function isTextArea(target: EventTarget | null) {
  return target instanceof HTMLElement && target.tagName.toLowerCase() === "textarea";
}

function isInsideScope(scope: HTMLElement | null, target: EventTarget | null) {
  return !!(scope && target instanceof Node && scope.contains(target));
}

export function useKeyboardShortcuts({
  scopeRef,
  onNextField,
  onPrevField,
  onSave,
  onComplete,
  onAddPrescription,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const scope = scopeRef.current;
      const active = document.activeElement;
      const insideScope = isInsideScope(scope, active) || isInsideScope(scope, event.target);

      if (!insideScope) return;

      if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        onSave();
        return;
      }

      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        onComplete();
        return;
      }

      if (event.altKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        onAddPrescription();
        return;
      }

      if (event.key === "Enter" && !event.ctrlKey && !event.altKey && !isTextArea(event.target)) {
        event.preventDefault();
        if (event.shiftKey) {
          onPrevField();
          return;
        }
        onNextField();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scopeRef, onNextField, onPrevField, onSave, onComplete, onAddPrescription]);
}
