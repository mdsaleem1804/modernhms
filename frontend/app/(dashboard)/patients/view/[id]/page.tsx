"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit2, User, Phone, Calendar, Clock, MapPin, Heart, AlertCircle, FileText } from "lucide-react";
import { patientService, type Patient } from "@/services/api/patientService";
import { cn } from "@/lib/utils";

export default function ViewPatientPage() {
  const router = useRouter();
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await patientService.getPatientById(id as string);
        setPatient(data);
      } catch (err: any) {
        setError(err.message || "Failed to load patient.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500">Retrieving patient data...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-red-900">Error Loading Patient</h2>
        <p className="text-sm text-red-700 mt-2 mb-6">{error || "The requested patient could not be found."}</p>
        <button
          onClick={() => router.push("/patients")}
          className="bg-white border border-red-200 text-red-700 px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100 transition-colors"
        >
          Back to Patient List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* ── Header Area ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/patients")}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{patient.fullName}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded leading-none">
                {patient.uhid}
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                patient.patientType === "opd" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
              )}>
                {patient.patientType} – Outpatient
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push(`/patients/edit/${patient.id}`)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Essential Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-50 pb-2">Primary Info</h3>
            <div className="space-y-4 text-sm">
              <InfoItem icon={User} label="Gender" value={patient.gender} />
              <InfoItem icon={Calendar} label="Age" value={patient.age || "N/A"} />
              <InfoItem icon={Phone} label="Mobile" value={patient.phone} />
              <InfoItem icon={MapPin} label="Location" value={`${patient.city || ""}, ${patient.state || ""}`.trim() || "N/A"} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-50 pb-2">Registration</h3>
            <div className="space-y-4 text-sm">
              <InfoItem icon={Clock} label="Reg Date" value={new Date(patient.registrationDate).toLocaleDateString("en-IN")} />
              <InfoItem icon={FileText} label="Department" value={patient.department || "N/A"} />
              <InfoItem icon={Heart} label="Visit Type" value={patient.visitType} />
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Tabs/Sections */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4">Patient Profile Detail</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <DetailGroup label="Full Address" value={patient.address || "-"} fullWidth />
              <DetailGroup label="Blood Group" value={patient.bloodGroup || "-"} />
              <DetailGroup label="Marital Status" value={patient.maritalStatus || "-"} />
              <DetailGroup label="Guardian Details" value={patient.guardianName ? `${patient.guardianName} (${patient.guardianRelation})` : "-"} />
              <DetailGroup label="Emergency Contact" value={patient.emergencyContactName ? `${patient.emergencyContactName} - ${patient.emergencyContactPhone}` : "-"} />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 space-y-6">
              <DetailGroup label="Allergies" value={patient.allergies || "No allergies documented"} className="text-red-600 font-medium" />
              <DetailGroup label="Existing Medical Conditions" value={patient.existingConditions || "No chronic conditions documented"} />
              <DetailGroup label="Notes" value={patient.notes || "-"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter leading-none">{label}</p>
        <p className="text-gray-900 font-semibold capitalize mt-1">{value || "-"}</p>
      </div>
    </div>
  );
}

function DetailGroup({ label, value, fullWidth = false, className = "" }: { label: string; value: string; fullWidth?: boolean; className?: string }) {
  return (
    <div className={cn(fullWidth ? "col-span-1 md:col-span-2" : "")}>
      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none mb-1.5">{label}</p>
      <p className={cn("text-gray-700 whitespace-pre-wrap leading-relaxed", className)}>{value}</p>
    </div>
  );
}
