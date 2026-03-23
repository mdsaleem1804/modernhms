"use client";

import { PatientForm } from "@/modules/core/components/PatientForm";

export default function AddPatientPage() {
  return (
    <div className="pb-24 max-w-5xl">
      {/* ── Header Area ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Patient Registration</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Register a new patient to the hospital system.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">System UHID</p>
            <p className="text-xs font-mono font-bold text-blue-600">AUTO-GENERATED</p>
          </div>
          <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Entry Date</p>
            <p className="text-xs font-bold text-gray-700">{new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      <PatientForm mode="create" />
    </div>
  );
}
