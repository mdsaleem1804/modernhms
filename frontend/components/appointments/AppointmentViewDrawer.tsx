"use client";

import React, { useState, useEffect } from "react";
import { 
  X, User, Calendar, Clock, Stethoscope, Building2, 
  Info, History, CheckCircle, AlertCircle, RefreshCw,
  Edit2, Package, UserPlus
} from "lucide-react";
import { Appointment, AppointmentStatus, ActivityLog } from "@/services/api/types";
import { appointmentService } from "@/services/api/appointmentService";
import { cn } from "@/lib/utils";

interface AppointmentViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export function AppointmentViewDrawer({ isOpen, onClose, appointment }: AppointmentViewDrawerProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (appointment && isOpen) {
      setIsLoading(true);
      appointmentService.getActivityLogs(appointment.id).then(data => {
        setLogs(data);
        setIsLoading(false);
      });
    }
  }, [appointment, isOpen]);

  if (!appointment) return null;

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "Booked": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Checked-In": return "bg-orange-50 text-orange-600 border-orange-100";
      case "In Consultation": return "bg-purple-50 text-purple-600 border-purple-100";
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getActionIcon = (action: ActivityLog["action"]) => {
    switch (action) {
      case "Created": return <UserPlus className="w-3 h-3" />;
      case "Edited": return <Edit2 className="w-3 h-3" />;
      case "Checked-In": return <Package className="w-3 h-3" />;
      case "Consultation Started": return <Stethoscope className="w-3 h-3" />;
      case "Completed": return <CheckCircle className="w-3 h-3" />;
      case "Cancelled": return <AlertCircle className="w-3 h-3" />;
      default: return <RefreshCw className="w-3 h-3" />;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[101] bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      )}

      <div className={cn(
        "fixed inset-y-0 right-0 z-[102] w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ease-in-out font-sans border-l border-gray-100",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gray-50/50 relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-[0.03] p-4">
                <LayoutDashboardIcon className="w-24 h-24 rotate-12" />
             </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                Clinical Docket Details
              </h2>
              <span className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-widest leading-none bg-indigo-50 px-2 py-1 rounded border border-indigo-100 mt-1.5 inline-block">
                Ref ID: {appointment.tokenNo}
              </span>
            </div>
            <button onClick={onClose} className="rounded-xl p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white transition-all active:scale-90 shadow-sm border border-gray-50">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            {/* Status Section */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-50 shadow-sm">
              <span className={cn(
                "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border",
                getStatusColor(appointment.status)
              )}>
                {appointment.status}
              </span>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Priority</p>
                <p className={cn(
                  "text-xs font-black uppercase tracking-tight",
                  appointment.priority === "Emergency" ? "text-rose-600" : "text-gray-900"
                )}>
                  {appointment.priority}
                </p>
              </div>
            </div>

            {/* Combined Info Grid */}
            <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
              <DetailItem label="Patient Name" value={appointment.patientName} icon={User} />
              <DetailItem label="Hospital ID" value={appointment.patientId} />
              <DetailItem label="Consulting Dr." value={appointment.doctorName} icon={Stethoscope} />
              <DetailItem label="Department" value={appointment.department} />
              <DetailItem label="Duty Shift" value={appointment.shift} icon={Clock} />
              <DetailItem label="Time Slot" value={appointment.time} />
            </div>

            {/* Audit Logs / Activity Timeline */}
            <div className="space-y-6 pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                    <History className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Activity History</h3>
                </div>
                {isLoading && <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />}
              </div>

              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gradient-to-b before:from-indigo-100 before:to-gray-50">
                {logs.length === 0 && !isLoading && (
                  <p className="text-[10px] text-gray-400 font-bold uppercase py-2">No activity recorded</p>
                )}
                {logs.map((log) => (
                  <div key={log.id} className="relative group">
                    {/* Dot */}
                    <div className={cn(
                      "absolute -left-[22.5px] top-1 w-6 h-6 rounded-lg border bg-white flex items-center justify-center transition-all shadow-sm group-hover:scale-110 group-hover:shadow-md z-10",
                      log.action === "Cancelled" ? "text-rose-600 border-rose-100" : "text-indigo-600 border-indigo-100"
                    )}>
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "text-[11px] font-black uppercase tracking-tight transition-colors",
                          log.action === "Cancelled" ? "text-rose-600" : "text-gray-900 group-hover:text-indigo-600"
                        )}>
                          {log.action}
                        </p>
                        <time className="text-[10px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed bg-white rounded-lg pl-1 group-hover:border-l-2 group-hover:border-indigo-500 transition-all">
                        {log.description}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1 opacity-60">
                        <User className="w-2.5 h-2.5" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Auth: {log.performedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="border-t border-gray-100 p-6 bg-gray-50/30">
             <button onClick={onClose} className="w-full py-3.5 text-xs font-black text-gray-400 hover:text-gray-900 border border-gray-200 rounded-xl bg-white transition-all shadow-sm active:scale-95 uppercase tracking-widest">
              Exit Dossier View
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailItem({ label, value, icon: Icon }: { label: string, value: string, icon?: any }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-indigo-400" />}
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{label}</p>
      </div>
      <p className="text-xs font-black text-gray-900 tracking-tight leading-tight">{value}</p>
    </div>
  );
}

function LayoutDashboardIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
