"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Edit2, 
  Stethoscope, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  Trash2,
  Share2,
  Printer
} from "lucide-react";
import { patientService } from "@/services/api/patientService";
import { type Patient } from "@/services/api/types";
import { PatientInfoCard } from "@/components/patients/PatientInfoCard";
import { VisitHistoryTable } from "@/components/patients/VisitHistoryTable";
import Link from "next/link";

export default function PatientDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatient() {
      try {
        setIsLoading(true);
        const data = await patientService.getPatientById(id as string);
        setPatient(data);
      } catch (err: any) {
        setError(err.message || "Failed to load patient details.");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadPatient();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium pulse">Loading patient profile...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center ring-1 ring-red-50">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 ring-4 ring-white shadow-inner">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Patient Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The requested patient record could not be retrieved. It may have been deleted or the ID is incorrect.
        </p>
        <button
          onClick={() => router.push("/patients")}
          className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Patient List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* ── Header & Breadcrumbs ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            <Link href="/patients" className="hover:text-indigo-600 transition-colors">Patients</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900">Patient Details</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all hover:shadow-md active:scale-90 lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Patient Details
            </h1>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.back()}
            className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-3 rounded-xl text-sm font-bold hover:border-gray-900 hover:text-gray-900 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <button
            onClick={() => router.push(`/patients/edit/${patient.id}`)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl text-sm font-black hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Patient</span>
          </button>

          <button
            onClick={() => {/* Start Consultation Logic */}}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 group"
          >
            <Stethoscope className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Start Consultation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Patient Info Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Patient Overview</h2>
            <div className="flex gap-2">
              <button disabled className="p-2 text-gray-300 hover:text-gray-500 transition-colors cursor-not-allowed">
                <Printer className="w-5 h-5" />
              </button>
              <button disabled className="p-2 text-gray-300 hover:text-gray-500 transition-colors cursor-not-allowed">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <PatientInfoCard patient={patient} />
        </section>

        {/* Visit History Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Visit History</h2>
          <VisitHistoryTable visits={patient.visitHistory || []} />
        </section>
      </div>

      {/* Quick Action Footer for Mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:hidden z-50">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-4 flex gap-3">
          <button
            onClick={() => {/* Logic */}}
            className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Stethoscope className="w-4 h-4" />
            Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
