"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MENU_CONFIG, Role } from "@/constants/menuConfig";
import { SidebarGroup } from "./SidebarGroup";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggle }: SidebarProps) {
  // Mocking the user role - in a real app, this would come from an Auth Context
  const [userRole] = useState<Role>("admin");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white text-slate-600 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 lg:static overflow-visible border-r border-slate-200 shadow-xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Header Section */}
        <div className={cn(
          "h-[72px] flex items-center border-b border-slate-200 transition-all duration-500 bg-slate-50/80",
          isCollapsed ? "px-2 justify-center" : "px-6 justify-between"
        )}>
          {!isCollapsed ? (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              MAIN MENU
            </span>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <Activity className="w-5 h-5 flex-shrink-0" />
            </div>
          )}
          
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto overflow-x-visible py-4 custom-scrollbar space-y-1">
          {MENU_CONFIG.map((section) => (
            <SidebarGroup 
              key={section.title} 
              section={section} 
              isCollapsed={isCollapsed} 
              userRole={userRole} 
            />
          ))}
        </nav>

        {/* Bottom Section: User & Collapse Toggle */}
        <div className="mt-auto border-t border-slate-200 bg-slate-50/80 p-4">
          <div className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            isCollapsed ? "justify-center" : "px-2"
          )}>
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin+User&background=cbd5e1&color=475569" alt="Avatar" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2">
                <p className="text-sm font-bold text-slate-800 truncate">Admin User</p>
                <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-widest">Administrator</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button 
              onClick={onToggle}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-all group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Collapse</span>
            </button>
          )}

          {isCollapsed && (
            <button 
              onClick={onToggle}
              className="mt-6 w-full flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Expand Menu"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
