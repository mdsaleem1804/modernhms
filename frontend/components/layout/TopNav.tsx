"use client";

import { Menu, Bell, Search, LogOut, Activity } from "lucide-react";

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-4 flex-none">
        <button
          onClick={onMenuClick}
          className="text-gray-500 hover:text-gray-700 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-gray-400 font-medium text-sm hidden sm:block">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-2xl mx-8 hidden md:block">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search in Patients, Appointments... (/)"
            className="w-full pl-11 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:outline-none transition-all placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="hidden lg:flex items-center gap-2 mr-2">
            <span className="text-xs font-semibold text-gray-500">Live Demo Clinic</span>
            <div className="h-6 w-px bg-gray-200"></div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md shadow-sm transition-colors">
          <Search className="w-4 h-4 sm:hidden" />
          <div className="hidden sm:flex items-center justify-center">
            <span className="text-lg font-bold leading-none">+</span>
          </div>
        </button>

        <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
        
        <button className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-gray-200 flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=cbd5e1&color=475569" alt="User" />
            </div>
        </button>

        <button className="text-gray-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors" title="Logout">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
