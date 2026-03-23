"use client";

import { Menu, Bell, Search, Globe, Calendar as CalendarIcon, Calculator, ClipboardList, LogOut } from "lucide-react";

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-[72px] flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0 shadow-sm relative">
      <div className="flex items-center gap-4 flex-none">
        <button
          onClick={onMenuClick}
          className="text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Lakshmi Hospitals Branding */}
        <div className="flex flex-col select-none">
           <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-red-600 font-bold text-white flex items-center justify-center rounded shadow-sm text-sm tracking-tighter flex-shrink-0">
                 LH
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none" style={{ fontFamily: "serif" }}>
                Lakshmi Hospitals
              </span>
           </div>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-1 ml-9">
             Hospital Management Information System (HMIS)
           </span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Search Bars */}
        <div className="hidden xl:flex items-center gap-3 mr-2">
           <div className="relative group">
              <Search className="w-[14px] h-[14px] absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
              <input 
                type="text" 
                placeholder="Patient Search..." 
                className="w-[180px] pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium" 
              />
           </div>
           <div className="relative group">
              <Search className="w-[14px] h-[14px] absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600" />
              <input 
                type="text" 
                placeholder="Doctor Search..." 
                className="w-[180px] pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 font-medium" 
              />
           </div>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>

        {/* Action Icons */}
        <div className="flex items-center gap-0.5">
           <button className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-md transition-colors" title="Language">
             <Globe className="w-4 h-4" />
           </button>
           <button className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-md transition-colors" title="Calendar">
             <CalendarIcon className="w-4 h-4" />
           </button>
           <button className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-md transition-colors" title="Calculator">
             <Calculator className="w-4 h-4" />
           </button>
           <button className="text-slate-500 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-md transition-colors relative" title="Pending Tasks">
             <ClipboardList className="w-4 h-4" />
             <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full border border-white"></span>
           </button>
           <button className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors relative" title="Notifications">
             <Bell className="w-4 h-4" />
             <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full border border-white"></span>
           </button>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

        {/* User Login Profile */}
        <div className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-lg border border-transparent cursor-pointer transition-all">
           <div className="w-8 h-8 rounded-md bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shadow-sm">
               <img src="https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff" alt="User" />
           </div>
           <div className="hidden sm:flex flex-col justify-center">
             <span className="text-xs font-bold text-slate-800 leading-none mb-1">Admin User</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Administrator</span>
           </div>
        </div>
      </div>
    </header>
  );
}
