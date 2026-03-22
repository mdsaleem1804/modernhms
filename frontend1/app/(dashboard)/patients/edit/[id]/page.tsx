"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { PatientForm } from "@/modules/core/components/PatientForm";
import { patientService, type Patient } from "@/services/api/patientService";

export default function EditPatientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await patientService.getPatientById(id as string);
        setPatient(data);
      } catch (err: any) {
        setError(err.message || "Failed to load patient record.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading patient data...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-red-900">Patient Not Found</h2>
        <p className="text-sm text-red-700 mt-2 mb-6">{error || "The patient you are trying to edit does not exist."}</p>
        <button
          onClick={() => router.push("/patients")}
          className="bg-white border border-red-200 text-red-700 px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100 transition-colors"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 max-w-[1400px] mx-auto">
      {/* ── Header Area ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Patient Profile</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {patient.uhid}
            </span>
            <span className="text-xs text-gray-500">• {patient.fullName}</span>
          </div>
        </div>
      </div>

      <PatientForm mode="edit" initialData={patient} />
    </div>
  );
}
