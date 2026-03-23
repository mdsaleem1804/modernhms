"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, RotateCcw, Filter, CalendarCheck2, Stethoscope, Building2 } from "lucide-react";
import { MOCK_DOCTORS, MOCK_DEPARTMENTS } from "@/services/api/mockData";
import { cn } from "@/lib/utils";

export interface AppointmentFiltersData {
  smartSearch: string;
  date: string;
  doctor: string;
  department: string;
  status: string;
}

interface AppointmentFiltersProps {
  filters: AppointmentFiltersData;
  setFilters: (filters: AppointmentFiltersData) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function AppointmentFilters({ filters, setFilters, onSearch, onReset }: AppointmentFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Debounced search for smartSearch field
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.smartSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-0 z-50">
      <div className="flex flex-col md:flex-row items-stretch border-b border-gray-50">
        
        {/* Smart Search Bar */}
        <div className="flex-1 relative group border-r border-gray-50">
          <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            name="smartSearch"
            placeholder="Search by Name / Mobile / Token Reference..."
            value={filters.smartSearch}
            onChange={handleChange}
            className="w-full h-14 pl-12 bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 placeholder:text-gray-300 transition-all uppercase tracking-tight"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 px-6 bg-gray-50/50">
          <button
            onClick={onReset}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="h-6 w-[1.5px] bg-gray-200 mx-2" />
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-0 py-1.5 pl-1 pr-8 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Booked">Booked</option>
              <option value="Checked-In">Checked-In</option>
              <option value="In Consultation">Consulting</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters (Date, Doctor, Dept) */}
      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <CalendarCheck2 className="w-3 h-3" />
            Duty Date
          </label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full h-10 bg-gray-50/50 border-gray-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-100 transition-all border"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Stethoscope className="w-3 h-3" />
            Physician
          </label>
          <select
            name="doctor"
            value={filters.doctor}
            onChange={handleChange}
            className="w-full h-10 bg-gray-50/50 border-gray-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-100 border"
          >
            <option value="All">Filter by Doctor</option>
            {MOCK_DOCTORS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Building2 className="w-3 h-3" />
            Department
          </label>
          <select
            name="department"
            value={filters.department}
            onChange={handleChange}
            className="w-full h-10 bg-gray-50/50 border-gray-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-100 border"
          >
            <option value="All">Filter by Department</option>
            {MOCK_DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
