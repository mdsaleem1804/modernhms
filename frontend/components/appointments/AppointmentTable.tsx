"use client";

import React from "react";
import { 
  Eye, Edit2, CheckCircle2, XCircle, Stethoscope, 
  CheckCircle, AlertCircle, RefreshCw 
} from "lucide-react";
import { Appointment, AppointmentStatus } from "@/services/api/types";
import { cn } from "@/lib/utils";

interface AppointmentTableProps {
  appointments: Appointment[];
  onView: (app: Appointment) => void;
  onEdit: (app: Appointment) => void;
  onStatusUpdate: (id: string, status: AppointmentStatus) => void;
}

export function AppointmentTable({ appointments, onView, onEdit, onStatusUpdate }: AppointmentTableProps) {
  const getStatusStyle = (status: AppointmentStatus) => {
    switch (status) {
      case "Booked":
        return "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-700/10";
      case "Checked-In":
        return "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-700/10";
      case "In Consultation":
        return "bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-700/10";
      case "Completed":
        return "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-700/10";
      case "Cancelled":
        return "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-700/10";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-700/10";
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-20 text-center">
        <p className="text-gray-400 font-bold text-lg">No appointments found.</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or book a new appointment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-8">Token & Info</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Slot</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Details</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clinical Team</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right pr-8">Clinical Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appointments.map((app) => (
              <tr 
                key={app.id} 
                className={cn(
                  "group transition-colors",
                  app.priority === "Emergency" ? "bg-rose-50/30 hover:bg-rose-50/50" : "hover:bg-gray-50/50"
                )}
              >
                <td className="px-6 py-5 pl-8">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-black text-indigo-600 bg-white border border-indigo-100 px-2 py-1 rounded shadow-sm">
                      {app.tokenNo}
                    </span>
                    <div className="flex gap-1">
                      {app.priority === "Emergency" && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" title="Emergency Priority"></span>
                      )}
                      {app.visitType === "Follow-up" && (
                        <span className="h-2 w-2 rounded-full bg-amber-400" title="Follow-up Visit"></span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{app.time}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{app.shift} Shift</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{app.patientName}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">ID: {app.patientId}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{app.doctorName}</span>
                    <span className="text-[11px] text-indigo-600 font-bold uppercase tracking-tighter">{app.department}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider",
                    getStatusStyle(app.status)
                  )}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right pr-8">
                  <div className="flex items-center justify-end gap-1.5 ">
                    {/* View/Edit Actions */}
                    <div className="flex items-center gap-1 border-r border-gray-100 pr-2 mr-1">
                      <button
                        onClick={() => onView(app)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(app)}
                        disabled={app.status === "Completed" || app.status === "Cancelled"}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Edit Appointment"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Quick Status Actions */}
                    <div className="flex items-center gap-2">
                      {app.status === "Booked" && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(app.id, "Checked-In")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-tight rounded-md hover:bg-amber-100 transition-all border border-amber-100"
                            title="Patient Arrived"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Check-In
                          </button>
                          <button
                            onClick={() => onStatusUpdate(app.id, "Cancelled")}
                            className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {app.status === "Checked-In" && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(app.id, "In Consultation")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-tight rounded-md hover:bg-purple-100 transition-all border border-purple-100"
                            title="Start Medical Review"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            Consult
                          </button>
                          <button
                            onClick={() => onStatusUpdate(app.id, "Cancelled")}
                            className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Patient Left / Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {app.status === "In Consultation" && (
                        <button
                          onClick={() => onStatusUpdate(app.id, "Completed")}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tight rounded-md hover:bg-emerald-100 transition-all border border-emerald-100"
                          title="Finish Consultation"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="px-8 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">
          Clinical Audit: <span className="text-gray-900">{appointments.length}</span> Records in View
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-[10px] font-bold text-gray-400 bg-white border border-gray-100 rounded hover:border-gray-900 hover:text-gray-900 transition-all opacity-50">Prev</button>
          <button className="px-3 py-1 text-[10px] font-bold text-gray-400 bg-white border border-gray-100 rounded hover:border-gray-900 hover:text-gray-900 transition-all opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
