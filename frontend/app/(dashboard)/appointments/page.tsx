"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, CalendarCheck2, LayoutDashboard } from "lucide-react";
import { AppointmentFilters, AppointmentFiltersData } from "@/components/appointments/AppointmentFilters";
import { AppointmentTable } from "@/components/appointments/AppointmentTable";
import { BookAppointmentModal } from "@/components/appointments/BookAppointmentModal";
import { AppointmentViewDrawer } from "@/components/appointments/AppointmentViewDrawer";
import { appointmentService } from "@/services/api/appointmentService";
import { Appointment, AppointmentStatus } from "@/services/api/types";
import { mockDb } from "@/services/api/mockData";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const initialFilters: AppointmentFiltersData = {
    smartSearch: "",
    date: new Date().toISOString().split("T")[0],
    doctor: "All",
    department: "All",
    status: "All"
  };
  const [filters, setFilters] = useState<AppointmentFiltersData>(initialFilters);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await appointmentService.getAppointments();
      
      const filtered = data.filter(app => {
        // Smart Search Logic
        let matchesSmartSearch = true;
        if (filters.smartSearch) {
          const search = filters.smartSearch.toLowerCase().trim();
          const isNumeric = /^\d+$/.test(search);
          
          if (isNumeric) {
            // Match mobile (need to lookup patient) OR Token
            const patient = mockDb.getById(app.patientId);
            matchesSmartSearch = app.tokenNo.toLowerCase().includes(search) || 
                               !!(patient?.phone && patient.phone.includes(search));
          } else {
            // Match Name
            matchesSmartSearch = app.patientName.toLowerCase().includes(search);
          }
        }

        const matchesDate = !filters.date || app.date === filters.date;
        const matchesDoctor = filters.doctor === "All" || app.doctorName === filters.doctor;
        const matchesDept = filters.department === "All" || app.department === filters.department;
        const matchesStatus = filters.status === "All" || app.status === filters.status;
        
        return matchesSmartSearch && matchesDate && matchesDoctor && matchesDept && matchesStatus;
      });

      setAppointments(filtered);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters.date]); // Re-fetch on date change by default

  const handleSearch = () => fetchAppointments();
  const handleReset = () => {
    setFilters(initialFilters);
  };

  const handleView = (app: Appointment) => {
    setSelectedAppointment(app);
    setIsDrawerOpen(true);
  };

  const handleEdit = (app: Appointment) => {
    setSelectedAppointment(app);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    await appointmentService.updateStatus(id, status);
    fetchAppointments();
  };

  const handleBookNew = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (selectedAppointment) {
      // Update existing
      await appointmentService.updateAppointment(selectedAppointment.id, data);
    } else {
      // Create new
      await appointmentService.createAppointment(data);
    }
    fetchAppointments();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Utility Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Clinical Operations</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Appointment Management & Workflow</p>
          </div>
        </div>

        <button 
          onClick={handleBookNew}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-xs font-black shadow-md hover:bg-indigo-700 transition-all active:scale-95 group"
        >
          <Plus className="w-4 h-4" />
          <span>NEW APPOINTMENT</span>
        </button>
      </div>

      {/* Filters Area */}
      <AppointmentFilters 
        filters={filters} 
        setFilters={setFilters} 
        onSearch={handleSearch} 
        onReset={handleReset} 
      />

      {/* Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Clinical Records...</p>
        </div>
      ) : (
        <AppointmentTable 
          appointments={appointments}
          onView={handleView}
          onEdit={handleEdit}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Modal Form */}
      <BookAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        initialData={selectedAppointment}
      />

      {/* View Drawer */}
      <AppointmentViewDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
