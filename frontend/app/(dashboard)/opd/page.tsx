"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Loader2, PlusCircle, RefreshCw, Stethoscope } from "lucide-react";
import { OPDQueueTable } from "@/components/opd/OPDQueueTable";
import { OPDBillingModal } from "@/components/opd/OPDBillingModal";
import { opdService } from "@/services/api/opdService";
import { patientService } from "@/services/api/patientService";
import { MOCK_DOCTORS } from "@/services/api/mockData";
import { OPDVisit, OPDVisitStatus, Patient } from "@/services/api/types";
import { userPreferences } from "@/lib/userPreferences";

type QueueFilters = {
  doctorId: string;
  status: "All" | OPDVisitStatus;
  fromDate: string;
  toDate: string;
};

const initialDate = new Date().toISOString().split("T")[0];

export default function OPDPage() {
  const [visits, setVisits] = useState<OPDVisit[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<OPDVisit | null>(null);
  const [filters, setFilters] = useState<QueueFilters>({
    doctorId: "All",
    status: "All",
    fromDate: initialDate,
    toDate: initialDate,
  });
  const [walkInForm, setWalkInForm] = useState({
    patientId: "",
    doctorId: "",
    priority: "Normal" as "Normal" | "Emergency",
  });

  useEffect(() => {
    const lastDoctorId = userPreferences.getLastOpdDoctorId();
    if (!lastDoctorId) return;
    if (!MOCK_DOCTORS.some((doctor) => doctor.id === lastDoctorId)) return;
    setWalkInForm((prev) => ({ ...prev, doctorId: lastDoctorId, priority: "Normal" }));
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [visitData, patientData] = await Promise.all([opdService.getVisits(), patientService.getPatients()]);
      setVisits(visitData);
      setPatients(patientData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      opdService.getVisits().then(setVisits).catch(() => undefined);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const visitDate = visit.visitDateTime.slice(0, 10);
      const matchesDoctor = filters.doctorId === "All" || visit.doctorId === filters.doctorId;
      const matchesStatus = filters.status === "All" || visit.status === filters.status;
      const matchesFrom = !filters.fromDate || visitDate >= filters.fromDate;
      const matchesTo = !filters.toDate || visitDate <= filters.toDate;
      return matchesDoctor && matchesStatus && matchesFrom && matchesTo;
    });
  }, [visits, filters]);

  const handleStatusUpdate = async (visitId: string, status: OPDVisitStatus) => {
    await opdService.updateVisitStatus(visitId, status);
    const nextVisits = await opdService.getVisits();
    setVisits(nextVisits);
  };

  const openBillingModal = (visit: OPDVisit) => {
    setSelectedVisit(visit);
    setBillingModalOpen(true);
  };

  const handleBillingConfirm = async (payload: { visitId: string; discount: number; paymentMode: "Cash" | "UPI" | "Card" }) => {
    await opdService.confirmBilling(payload);
    setVisits(await opdService.getVisits());
  };

  const handleCreateWalkIn = async () => {
    if (!walkInForm.patientId || !walkInForm.doctorId) return;
    setSubmitting(true);
    try {
      const patient = patients.find((item) => item.id === walkInForm.patientId);
      const doctor = MOCK_DOCTORS.find((item) => item.id === walkInForm.doctorId);
      if (!patient || !doctor) return;

      await opdService.createWalkInVisit({
        patientId: patient.id,
        patientName: patient.fullName,
        doctorId: doctor.id,
        doctorName: doctor.name,
        priority: walkInForm.priority,
      });
      userPreferences.setLastOpdDoctorId(doctor.id);
      setWalkInOpen(false);
      setWalkInForm({ patientId: "", doctorId: doctor.id, priority: "Normal" });
      setVisits(await opdService.getVisits());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">OPD Queue Management</h1>
            <p className="text-[10px] font-semibold tracking-wide text-gray-400">Today: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-[10px] font-bold text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            onClick={() => setWalkInOpen(true)}
            className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            New Visit
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2">
        <select
          value={filters.doctorId}
          onChange={(event) => setFilters((prev) => ({ ...prev, doctorId: event.target.value }))}
          className="h-7 rounded border border-gray-200 bg-gray-50 px-2 text-[11px] font-semibold text-gray-700 outline-none"
        >
          <option value="All">All Doctors</option>
          {MOCK_DOCTORS.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value as QueueFilters["status"] }))}
          className="h-7 rounded border border-gray-200 bg-gray-50 px-2 text-[11px] font-semibold text-gray-700 outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Billing Pending">Billing Pending</option>
          <option value="Waiting">Waiting</option>
          <option value="In Consultation">In Consultation</option>
          <option value="Completed">Completed</option>
        </select>
        <label className="relative">
          <CalendarDays className="pointer-events-none absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
            className="h-7 w-full rounded border border-gray-200 bg-gray-50 pl-8 pr-2 text-[11px] font-semibold text-gray-700 outline-none"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white p-16">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : (
        <OPDQueueTable
          visits={filteredVisits}
          onPayAndConfirm={openBillingModal}
          onStartConsultation={(visit) => handleStatusUpdate(visit.id, "In Consultation")}
          onMarkCompleted={(visit) => handleStatusUpdate(visit.id, "Completed")}
        />
      )}

      <OPDBillingModal
        visit={selectedVisit}
        isOpen={billingModalOpen}
        onClose={() => setBillingModalOpen(false)}
        onConfirm={handleBillingConfirm}
      />

      {walkInOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">Direct OPD Registration</h2>
            <div className="mt-3 grid gap-2">
              <select
                value={walkInForm.patientId}
                onChange={(event) => setWalkInForm((prev) => ({ ...prev, patientId: event.target.value }))}
                className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold outline-none focus:border-indigo-500"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.fullName} ({patient.uhid})
                  </option>
                ))}
              </select>
              <select
                value={walkInForm.doctorId}
                onChange={(event) => setWalkInForm((prev) => ({ ...prev, doctorId: event.target.value }))}
                className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold outline-none focus:border-indigo-500"
              >
                <option value="">Select Doctor</option>
                {MOCK_DOCTORS.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              <select
                value={walkInForm.priority}
                onChange={(event) =>
                  setWalkInForm((prev) => ({ ...prev, priority: event.target.value as "Normal" | "Emergency" }))
                }
                className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold outline-none focus:border-indigo-500"
              >
                <option value="Normal">Normal</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setWalkInOpen(false)}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWalkIn}
                disabled={submitting}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Visit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
