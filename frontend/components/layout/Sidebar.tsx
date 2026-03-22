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
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 lg:static overflow-visible",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center border-b border-gray-50 transition-all duration-500",
          isCollapsed ? "px-2 justify-center" : "px-6 justify-between"
        )}>
          <Link href="/" className="flex items-center gap-3 text-indigo-600 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-indigo-100">
              <Activity className="w-6 h-6 flex-shrink-0" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="font-black text-gray-900 leading-none tracking-tighter text-lg">ModernHMS</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Hospital Management</span>
              </div>
            )}
          </Link>
          
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto overflow-x-visible py-4 custom-scrollbar">
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
        <div className="mt-auto border-t border-gray-50 p-4 bg-gray-50/30">
          <div className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            isCollapsed ? "justify-center" : "px-2"
          )}>
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100">
              AD
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2">
                <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
                <p className="text-[10px] text-gray-500 truncate font-bold uppercase tracking-widest">Administrator</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button 
              onClick={onToggle}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Collapse Menu</span>
            </button>
          )}

          {isCollapsed && (
            <button 
              onClick={onToggle}
              className="mt-4 w-full flex items-center justify-center p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
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
