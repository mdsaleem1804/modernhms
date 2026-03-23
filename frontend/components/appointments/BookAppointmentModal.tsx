"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, CreditCard, User, AlertCircle, Building2, Stethoscope, Briefcase, Hash } from "lucide-react";
import { MOCK_DOCTORS, MOCK_DEPARTMENTS, MOCK_PATIENTS } from "@/services/api/mockData";
import { cn } from "@/lib/utils";
import { AppointmentPriority, VisitType, ShiftType, Appointment } from "@/services/api/types";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Appointment | null;
}

const MORNING_SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM"];
const EVENING_SLOTS = ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM"];

export function BookAppointmentModal({ isOpen, onClose, onSubmit, initialData }: BookAppointmentModalProps) {
  const isEditMode = !!initialData;
  const isLocked = initialData?.status === "Completed" || initialData?.status === "Cancelled";

  const [formData, setFormData] = useState({
    patientId: "",
    visitType: "New Consultation" as VisitType,
    previousVisitId: "",
    appointmentType: "Scheduled" as "Scheduled" | "Walk-in",
    shift: "Morning" as ShiftType,
    date: new Date().toISOString().split("T")[0],
    timeSlot: "10:00 AM",
    department: "",
    doctorId: "",
    priority: "Normal" as AppointmentPriority,
    paymentType: "Cash" as "Cash" | "Insurance" | "Corporate",
    remarks: ""
  });

  // Load initial data for Edit Mode
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        patientId: initialData.patientId,
        visitType: initialData.visitType,
        previousVisitId: initialData.previousVisitId || "",
        appointmentType: initialData.appointmentType,
        shift: initialData.shift,
        date: initialData.date,
        timeSlot: initialData.time,
        department: initialData.department,
        doctorId: initialData.doctorId,
        priority: initialData.priority,
        paymentType: initialData.paymentType,
        remarks: initialData.remarks || ""
      });
    } else if (!isEditMode && isOpen) {
      // Reset for new booking
      setFormData({
        patientId: "",
        visitType: "New Consultation",
        previousVisitId: "",
        appointmentType: "Scheduled",
        shift: "Morning",
        date: new Date().toISOString().split("T")[0],
        timeSlot: "10:00 AM",
        department: "",
        doctorId: "",
        priority: "Normal",
        paymentType: "Cash",
        remarks: ""
      });
    }
  }, [initialData, isOpen, isEditMode]);

  // Update time slot when shift changes (only for new/edit if not manually selected)
  useEffect(() => {
    if (!isLocked) {
      const slots = formData.shift === "Morning" ? MORNING_SLOTS : EVENING_SLOTS;
      if (!slots.includes(formData.timeSlot)) {
        setFormData(prev => ({ ...prev, timeSlot: slots[0] }));
      }
    }
  }, [formData.shift, isLocked]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    onSubmit(formData);
    onClose();
  };

  const InputLabel = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-tight flex items-center gap-1.5 mb-1 opacity-70">
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </label>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Compact Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tight">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            {isEditMode ? "Edit Clinical Appointment" : "Reception Booking Portal"}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-all active:scale-90">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Form Body */}
        <form onSubmit={handleSubmit} className="p-5">
           {isLocked && (
            <div className="mb-4 bg-rose-50 border border-rose-100 p-3 rounded-md flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-tight">
                This appointment is {initialData?.status}. Changes are restricted after clinical completion.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            
            {/* Read-only Token for Edit Mode */}
            {isEditMode && (
              <div className="col-span-2 space-y-1">
                <InputLabel icon={Hash}>Token Reference</InputLabel>
                <input 
                  disabled
                  value={initialData?.tokenNo}
                  className="w-full bg-gray-100 border border-gray-200 rounded-md text-sm font-black py-2 px-3 text-indigo-600"
                />
              </div>
            )}

            {/* Row 1: Patient | Visit Type */}
            <div className="space-y-1">
              <InputLabel icon={User}>Patient</InputLabel>
              <select 
                required
                disabled={isEditMode || isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm transition-all h-10",
                  (isEditMode || isLocked) ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" : "bg-white border-gray-200 shadow-sm"
                )}
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              >
                <option value="">Search Patient...</option>
                {MOCK_PATIENTS.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.uhid})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <InputLabel>Visit Type</InputLabel>
              <select 
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm transition-all h-10",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-200"
                )}
                value={formData.visitType}
                onChange={(e) => setFormData({...formData, visitType: e.target.value as VisitType})}
              >
                <option value="New Consultation">New Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="IPD Consultation">IPD Consultation</option>
              </select>
            </div>

            {/* Hidden field for Follow-up */}
            {formData.visitType === "Follow-up" && (
              <div className="col-span-2 bg-amber-50 p-3 rounded-md border border-amber-100 animate-in slide-in-from-top-2">
                <InputLabel>Previous Visit ID / Token</InputLabel>
                <input 
                  type="text"
                  disabled={isLocked}
                  placeholder="e.g. T-105"
                  className="w-full bg-white border border-amber-200 rounded-md text-sm py-2 px-3 outline-none focus:border-amber-500 h-10"
                  value={formData.previousVisitId}
                  onChange={(e) => setFormData({...formData, previousVisitId: e.target.value})}
                />
              </div>
            )}

            {/* Row 2: Doctor | Department */}
            <div className="space-y-1">
              <InputLabel icon={Stethoscope}>Doctor</InputLabel>
              <select 
                required
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm transition-all h-10",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-200"
                )}
                value={formData.doctorId}
                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              >
                <option value="">Select Doctor...</option>
                {MOCK_DOCTORS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <InputLabel icon={Building2}>Department</InputLabel>
              <select 
                required
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm transition-all h-10",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-200"
                )}
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="">Select Dept...</option>
                {MOCK_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Row 3: Date | Shift */}
            <div className="space-y-1">
              <InputLabel icon={Calendar}>Date</InputLabel>
              <input 
                type="date"
                required
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all h-10",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-200"
                )}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <InputLabel>Shift</InputLabel>
              <select 
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all h-10",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-200"
                )}
                value={formData.shift}
                onChange={(e) => setFormData({...formData, shift: e.target.value as ShiftType})}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            {/* Row 4: Time Slot | Priority */}
            <div className="space-y-1">
              <InputLabel icon={Clock}>Time Slot</InputLabel>
              <select 
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all h-10",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-200"
                )}
                value={formData.timeSlot}
                onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
              >
                {(formData.shift === "Morning" ? MORNING_SLOTS : EVENING_SLOTS).map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <InputLabel icon={AlertCircle}>Priority</InputLabel>
              <select 
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm font-bold py-2 px-3 focus:outline-none h-10",
                  formData.priority === "Emergency" 
                    ? "bg-rose-50 border-rose-200 text-rose-600 focus:ring-rose-200" 
                    : "bg-white border-gray-200 focus:ring-indigo-200 text-gray-700"
                )}
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as AppointmentPriority})}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            {/* Row 5: Appointment Type | Payment Type */}
            <div className="space-y-1">
              <InputLabel>Appt. Type</InputLabel>
              <select 
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 transition-all h-10",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-200"
                )}
                value={formData.appointmentType}
                onChange={(e) => setFormData({...formData, appointmentType: e.target.value as any})}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>

            <div className="space-y-1">
              <InputLabel icon={CreditCard}>Payment</InputLabel>
              <select 
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 transition-all h-10",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-200"
                )}
                value={formData.paymentType}
                onChange={(e) => setFormData({...formData, paymentType: e.target.value as any})}
              >
                <option value="Cash">Cash / UPI</option>
                <option value="Insurance">Insurance</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            {/* Remarks (Full width) */}
            <div className="col-span-2 space-y-1 mt-1">
              <InputLabel>Remarks / Complaints</InputLabel>
              <textarea 
                disabled={isLocked}
                className={cn(
                  "w-full border rounded-md text-sm py-2 px-3 h-16 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50",
                  isLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200 shadow-none" : "bg-white border-gray-200 shadow-sm"
                )}
                placeholder="Notes..."
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              />
            </div>

          </div>
        </form>

        {/* Flat Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          {!isLocked && (
            <button 
              type="submit" 
              onClick={handleSubmit}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-bold text-white shadow-sm transition-all active:scale-95",
                formData.priority === "Emergency" ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {isEditMode ? "Save Changes" : "Book Appointment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
