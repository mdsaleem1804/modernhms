"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, PlayCircle, Save, Stethoscope } from "lucide-react";
import { opdService } from "@/services/api/opdService";
import { patientService } from "@/services/api/patientService";
import { MedicineCatalogItem, OPDActivityLog, OPDVisit, Patient, PrescriptionItem } from "@/services/api/types";
import { VisitHistoryTable } from "@/components/patients/VisitHistoryTable";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { StickyPatientHeader } from "@/components/opd/StickyPatientHeader";
import { validateConsultationForCompletion } from "@/lib/consultationValidation";
import { AutoCompleteInput } from "@/components/ui/AutoCompleteInput";
import { getDatePlusDays } from "@/lib/dateTime";
import { userPreferences } from "@/lib/userPreferences";
import { OPDActivityLogList } from "@/components/opd/OPDActivityLog";

const COMMON_SYMPTOMS = ["Fever", "Cough", "Headache", "Body Pain", "Breathlessness", "Vomiting"];
const VITAL_PLACEHOLDERS = {
  temperature: "e.g. 98.6 F",
  bloodPressure: "e.g. 120/80 mmHg",
  pulse: "e.g. 72 bpm",
  weight: "e.g. 65 kg",
};

export default function OPDConsultationPage() {
  const params = useParams<{ visitId: string }>();
  const router = useRouter();
  const visitId = params.visitId;

  const [visit, setVisit] = useState<OPDVisit | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [logs, setLogs] = useState<OPDActivityLog[]>([]);
  const [medicines, setMedicines] = useState<MedicineCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [topError, setTopError] = useState<string>("");
  const [diagnosisError, setDiagnosisError] = useState<string>("");
  const [prescriptionWarning, setPrescriptionWarning] = useState<string>("");
  const [form, setForm] = useState({
    temperature: "",
    bloodPressure: "",
    pulse: "",
    weight: "",
    symptoms: "",
    commonSymptoms: [] as string[],
    diagnosis: "",
    notes: "",
    followUpDate: getDatePlusDays(7),
    followUpRemarks: "",
  });
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { id: "rx-1", medicineName: "", dosage: "", frequency: "1-0-1", foodTiming: "After Food", duration: "", instructions: "" },
  ]);
  const consultationRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const prescriptionInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await opdService.getVisitById(visitId);
      const [patientData, activity] = await Promise.all([
        patientService.getPatientById(data.patientId),
        opdService.getActivityLogs(data.id),
      ]);
      const catalog = await opdService.getMedicineCatalog();

      setVisit(data);
      setPatient(patientData);
      setLogs(activity);
      setMedicines(catalog);
      setForm({
        temperature: data.vitals?.temperature ?? "",
        bloodPressure: data.vitals?.bloodPressure ?? "",
        pulse: data.vitals?.pulse ?? "",
        weight: data.vitals?.weight ?? "",
        symptoms: data.symptoms ?? "",
        commonSymptoms: data.commonSymptoms ?? [],
        diagnosis: data.diagnosis ?? "",
        notes: data.notes ?? "",
        followUpDate: data.followUpDate ?? getDatePlusDays(7),
        followUpRemarks: data.followUpRemarks ?? "",
      });
      const defaultFrequency = userPreferences.getLastPrescriptionFrequency() || "1-0-1";
      const defaultFoodTiming =
        (userPreferences.getLastPrescriptionFoodTiming() as "Before Food" | "After Food" | null) || "After Food";
      setPrescriptions(
        data.prescriptions.length > 0
          ? data.prescriptions
          : [{ id: "rx-1", medicineName: "", dosage: "", frequency: defaultFrequency, foodTiming: defaultFoodTiming, duration: "", instructions: "" }]
      );
    } finally {
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    if (visitId) loadData();
  }, [visitId, loadData]);

  useEffect(() => {
    if (loading) return;
    firstInputRef.current?.focus();
  }, [loading]);

  const isPrescriptionValid = useMemo(() => {
    return prescriptions.every((item) => !item.medicineName || (item.dosage && item.duration && item.frequency));
  }, [prescriptions]);

  const medicineOptions = useMemo(
    () =>
      medicines.map((medicine) => ({
        id: medicine.id,
        label: medicine.name,
        meta: medicine.standardDosage,
      })),
    [medicines]
  );

  const saveConsultation = useCallback(async () => {
    if (!visit) return;
    setSaving(true);
    try {
      await opdService.updateConsultation(visit.id, {
        vitals: {
          temperature: form.temperature,
          bloodPressure: form.bloodPressure,
          pulse: form.pulse,
          weight: form.weight,
        },
        symptoms: form.symptoms,
        commonSymptoms: form.commonSymptoms,
        diagnosis: form.diagnosis,
        prescriptions: prescriptions.filter((item) => item.medicineName),
        notes: form.notes,
        followUpDate: form.followUpDate || undefined,
        followUpRemarks: form.followUpRemarks,
      });
      await loadData();
    } finally {
      setSaving(false);
    }
  }, [visit, form, prescriptions, loadData]);

  const getFocusableElements = useCallback(() => {
    const scope = consultationRef.current;
    if (!scope) return [] as HTMLElement[];
    const nodes = Array.from(
      scope.querySelectorAll<HTMLElement>(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
      )
    ).filter((element) => element.tabIndex >= 0);
    return nodes;
  }, []);

  const focusNextField = useCallback(() => {
    const elements = getFocusableElements();
    const active = document.activeElement as HTMLElement | null;
    const index = active ? elements.indexOf(active) : -1;
    const next = index >= 0 ? elements[index + 1] : elements[0];
    next?.focus();
  }, [getFocusableElements]);

  const focusPreviousField = useCallback(() => {
    const elements = getFocusableElements();
    const active = document.activeElement as HTMLElement | null;
    const index = active ? elements.indexOf(active) : -1;
    const previous = index > 0 ? elements[index - 1] : elements[elements.length - 1];
    previous?.focus();
  }, [getFocusableElements]);

  const addPrescriptionRow = useCallback(() => {
    const id = `rx-${Date.now()}`;
    const defaultFrequency = userPreferences.getLastPrescriptionFrequency() || "1-0-1";
    const defaultFoodTiming =
      (userPreferences.getLastPrescriptionFoodTiming() as "Before Food" | "After Food" | null) || "After Food";
    setPrescriptions((prev) => [
      ...prev,
      { id, medicineName: "", dosage: "", frequency: defaultFrequency, foodTiming: defaultFoodTiming, duration: "", instructions: "" },
    ]);
    setTimeout(() => {
      prescriptionInputRefs.current[id]?.focus();
    }, 0);
  }, []);

  const completeConsultation = useCallback(async () => {
    if (!visit || visit.status !== "In Consultation" || isCompleting) return;

    const validation = validateConsultationForCompletion({
      diagnosis: form.diagnosis,
      prescriptions,
    });
    setDiagnosisError(validation.errors.diagnosis || "");
    setPrescriptionWarning(validation.warnings.prescriptions || "");
    setTopError(validation.topMessage || "");

    if (!validation.valid) return;

    setIsCompleting(true);
    try {
      await saveConsultation();
      await opdService.updateVisitStatus(visit.id, "Completed");
      router.push("/opd");
    } finally {
      setIsCompleting(false);
    }
  }, [visit, isCompleting, form.diagnosis, prescriptions, router, saveConsultation]);

  useKeyboardShortcuts({
    scopeRef: consultationRef,
    onNextField: focusNextField,
    onPrevField: focusPreviousField,
    onSave: saveConsultation,
    onComplete: completeConsultation,
    onAddPrescription: addPrescriptionRow,
  });

  const updateStatus = async (status: OPDVisit["status"]) => {
    if (!visit) return;
    await opdService.updateVisitStatus(visit.id, status);
    await loadData();
  };

  if (loading) {
    return (
      <div className="grid place-items-center rounded-xl border border-gray-100 bg-white p-20">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!visit || !patient) {
    return (
      <div className="rounded-xl border border-rose-100 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
        OPD visit not found.
      </div>
    );
  }

  return (
    <div ref={consultationRef} className="space-y-4 pb-16">
      <StickyPatientHeader patient={patient} visit={visit} />
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600 p-2 text-white">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-black text-gray-900">OPD Consultation</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {visit.tokenNo} | {visit.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {visit.status === "Waiting" && (
              <button
                onClick={() => updateStatus("In Consultation")}
                className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-purple-700"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Start Consultation
              </button>
            )}
            {visit.status === "In Consultation" && (
              <button
                onClick={completeConsultation}
                disabled={isCompleting}
                className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isCompleting ? "Completing..." : "Complete Consultation"}
              </button>
            )}
            <button
              onClick={saveConsultation}
              disabled={!isPrescriptionValid || saving}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
            <button
              onClick={() => router.push("/opd")}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-gray-600"
            >
              Back to Queue
            </button>
          </div>
        </div>
      </div>

      {topError && (
        <div className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700">
          {topError}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 lg:col-span-2">
          <h2 className="mb-2 text-[11px] font-black uppercase tracking-widest text-gray-500">Patient Summary</h2>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <p><span className="font-bold text-gray-600">Name:</span> {patient.fullName}</p>
            <p><span className="font-bold text-gray-600">UHID:</span> {patient.uhid}</p>
            <p><span className="font-bold text-gray-600">Age:</span> {patient.age || "-"}</p>
            <p><span className="font-bold text-gray-600">Gender:</span> {patient.gender || "-"}</p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-2 text-[11px] font-black uppercase tracking-widest text-gray-500">Activity Log</h2>
          <OPDActivityLogList logs={logs} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="mb-3 text-[11px] font-black uppercase tracking-widest text-gray-500">Consultation Form</h2>

        <div className="grid gap-2 md:grid-cols-4">
          <input ref={firstInputRef} className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold" placeholder={VITAL_PLACEHOLDERS.temperature} value={form.temperature} onChange={(e) => setForm((p) => ({ ...p, temperature: e.target.value }))} />
          <input className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold" placeholder={VITAL_PLACEHOLDERS.bloodPressure} value={form.bloodPressure} onChange={(e) => setForm((p) => ({ ...p, bloodPressure: e.target.value }))} />
          <input className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold" placeholder={VITAL_PLACEHOLDERS.pulse} value={form.pulse} onChange={(e) => setForm((p) => ({ ...p, pulse: e.target.value }))} />
          <input className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold" placeholder={VITAL_PLACEHOLDERS.weight} value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} />
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <textarea className="min-h-20 rounded-md border border-gray-200 p-2 text-xs font-semibold" placeholder="Symptoms / complaints" value={form.symptoms} onChange={(e) => setForm((p) => ({ ...p, symptoms: e.target.value }))} />
          <textarea
            className={`min-h-20 rounded-md border p-2 text-xs font-semibold ${diagnosisError ? "border-gray-400" : "border-gray-200"}`}
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={(e) => {
              setForm((p) => ({ ...p, diagnosis: e.target.value }));
              if (diagnosisError && e.target.value.trim()) {
                setDiagnosisError("");
                setTopError("");
              }
            }}
          />
        </div>
        {diagnosisError && <p className="mt-1 text-[11px] font-semibold text-gray-600">{diagnosisError}</p>}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {COMMON_SYMPTOMS.map((symptom) => {
            const selected = form.commonSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    commonSymptoms: selected
                      ? prev.commonSymptoms.filter((s) => s !== symptom)
                      : [...prev.commonSymptoms, symptom],
                  }))
                }
                className={selected
                  ? "rounded-full border border-indigo-300 bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-700"
                  : "rounded-full border border-gray-200 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wide text-gray-500"}
              >
                {symptom}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500">Prescription</h3>
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="rounded-md border border-gray-200 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-gray-600"
            >
              Add Medicine
            </button>
          </div>
          <div className="space-y-2">
            {prescriptions.map((item) => (
              <div key={item.id} className="grid gap-2 md:grid-cols-6">
                <AutoCompleteInput
                  inputRef={(element) => {
                    prescriptionInputRefs.current[item.id] = element;
                  }}
                  options={medicineOptions}
                  placeholder="Medicine Name"
                  value={item.medicineName}
                  onChange={(value) =>
                    setPrescriptions((prev) => prev.map((p) => (p.id === item.id ? { ...p, medicineName: value } : p)))
                  }
                  onSelectOption={(option) => {
                    const selected = medicines.find((medicine) => medicine.id === option.id);
                    if (!selected) return;
                    setPrescriptions((prev) =>
                      prev.map((p) =>
                        p.id === item.id
                          ? {
                              ...p,
                              medicineName: selected.name,
                              dosage: p.dosage || selected.standardDosage,
                              frequency: p.frequency || selected.frequency,
                              foodTiming: p.foodTiming || selected.foodTiming,
                            }
                          : p
                      )
                    );
                  }}
                />
                <input
                  className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold"
                  placeholder="Dosage"
                  value={item.dosage}
                  onChange={(e) =>
                    setPrescriptions((prev) => prev.map((p) => (p.id === item.id ? { ...p, dosage: e.target.value } : p)))
                  }
                />
                <input
                  className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold"
                  placeholder="Frequency (1-0-1)"
                  value={item.frequency || ""}
                  onChange={(e) => {
                    userPreferences.setLastPrescriptionFrequency(e.target.value);
                    setPrescriptions((prev) => prev.map((p) => (p.id === item.id ? { ...p, frequency: e.target.value } : p)));
                  }}
                />
                <select
                  className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold"
                  value={item.foodTiming || "After Food"}
                  onChange={(e) => {
                    const value = e.target.value as "Before Food" | "After Food";
                    userPreferences.setLastPrescriptionFoodTiming(value);
                    setPrescriptions((prev) => prev.map((p) => (p.id === item.id ? { ...p, foodTiming: value } : p)));
                  }}
                >
                  <option value="After Food">After Food</option>
                  <option value="Before Food">Before Food</option>
                </select>
                <input
                  className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold"
                  placeholder="Duration"
                  value={item.duration}
                  onChange={(e) =>
                    setPrescriptions((prev) => prev.map((p) => (p.id === item.id ? { ...p, duration: e.target.value } : p)))
                  }
                />
                <input
                  className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold"
                  placeholder="Instructions"
                  value={item.instructions || ""}
                  onChange={(e) =>
                    setPrescriptions((prev) => prev.map((p) => (p.id === item.id ? { ...p, instructions: e.target.value } : p)))
                  }
                />
              </div>
            ))}
          </div>
        </div>
        {prescriptionWarning && <p className="mt-2 text-[11px] font-semibold text-gray-500">{prescriptionWarning}</p>}

        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <textarea className="min-h-20 rounded-md border border-gray-200 p-2 text-xs font-semibold" placeholder="Consultation notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          <div className="grid gap-2">
            <input type="date" className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold" value={form.followUpDate} onChange={(e) => setForm((p) => ({ ...p, followUpDate: e.target.value }))} />
            <textarea className="min-h-10 rounded-md border border-gray-200 p-2 text-xs font-semibold" placeholder="Follow-up remarks" value={form.followUpRemarks} onChange={(e) => setForm((p) => ({ ...p, followUpRemarks: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="mb-2 text-[11px] font-black uppercase tracking-widest text-gray-500">Previous Visit History</h2>
        <VisitHistoryTable visits={patient.visitHistory || []} />
      </div>
    </div>
  );
}
