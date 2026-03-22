"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Module = "core" | "pharmacy" | "lab" | "billing";

interface ModuleContextType {
  activeModules: Module[];
  toggleModule: (module: Module) => void;
  isModuleEnabled: (module: Module) => boolean;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: ReactNode }) {
  // Mock enabled modules - e.g. "core" and "pharmacy" are enabled by default
  const [activeModules, setActiveModules] = useState<Module[]>(["core", "pharmacy"]);

  const toggleModule = (module: Module) => {
    setActiveModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  const isModuleEnabled = (module: Module) => activeModules.includes(module);

  return (
    <ModuleContext.Provider value={{ activeModules, toggleModule, isModuleEnabled }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error("useModules must be used within a ModuleProvider");
  }
  return context;
}
