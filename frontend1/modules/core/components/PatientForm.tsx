"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Loader2, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { useEnterToNext } from "@/hooks/useEnterToNext";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { patientService, type Patient, type PatientPayload } from "@/services/api/patientService";
import { calculateAge, isValidIndianMobile, isValidAadhaar } from "@/lib/helpers";
import { cn } from "@/lib/utils";

// ─── Options ─────────────────────────────────────────────────────────────────

const patientTypeOpts = [
  { value: "opd", label: "OPD – Outpatient" },
  { value: "ipd", label: "IPD – Inpatient" },
  { value: "emergency", label: "Emergency" },
];
const visitTypeOpts = [
  { value: "new", label: "New Visit" },
  { value: "followup", label: "Follow-up" },
];
const departmentOpts = [
  { value: "general", label: "General Medicine" },
  { value: "surgery", label: "Surgery" },
  { value: "gynaecology", label: "Gynaecology & Obstetrics" },
  { value: "paediatrics", label: "Paediatrics" },
  { value: "orthopaedics", label: "Orthopaedics" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "ent", label: "ENT" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "radiology", label: "Radiology" },
  { value: "pathology", label: "Pathology" },
  { value: "dental", label: "Dental" },
  { value: "physiotherapy", label: "Physiotherapy" },
];
const genderOpts = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
const bloodGroupOpts = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map(
  (v) => ({ value: v, label: v })
);
const maritalOpts = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];
const relationOpts = [
  { value: "spouse", label: "Spouse" },
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "child", label: "Child" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];
const idProofOpts = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "driving", label: "Driving Licence" },
  { value: "voter", label: "Voter ID" },
  { value: "passport", label: "Passport" },
];
const idProofPlaceholders: Record<string, string> = {
  aadhaar: "XXXX XXXX XXXX",
  pan: "ABCDE1234F",
  driving: "DL-XXXXXXXXXX",
  voter: "ABC1234567",
  passport: "A1234567",
};
const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Delhi","Jammu & Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
].map((s) => ({ value: s, label: s }));

function nowLocal() {
  const d = new Date();
  return d.toISOString().slice(0, 16);
}

const INITIAL: PatientPayload = {
  registrationDate: nowLocal(),
  patientType: "", visitType: "new", department: "",
  fullName: "", gender: "", dateOfBirth: "", age: "",
  phone: "", alternatePhone: "",
  idProofType: "", idProofNumber: "",
  address: "", city: "", state: "", pincode: "",
  bloodGroup: "", maritalStatus: "", occupation: "",
  guardianName: "", guardianRelation: "",
  referredBy: "",
  emergencyContactName: "", emergencyContactRelation: "", emergencyContactPhone: "",
  allergies: "", existingConditions: "", notes: "",
};

// ─── Utility Components ──────────────────────────────────────────────────────

function CollapsibleSection({
  title,
  defaultOpen = false,
  optional = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn(
      "rounded-lg overflow-hidden transition-all duration-200",
      optional
        ? "border border-dashed border-gray-200 bg-gray-50/40"
        : "border border-gray-200 bg-white shadow-xs"
    )}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50/80 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-semibold",
            optional ? "text-gray-500" : "text-gray-700"
          )}>{title}</span>
          {optional && (
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 leading-none shadow-sm">
              Optional
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            optional ? "text-gray-300" : "text-gray-400",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        ref={contentRef}
        className={cn(
          "transition-all duration-200 ease-in-out overflow-hidden",
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-3 pt-1 border-t border-gray-100">{children}</div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface PatientFormProps {
  mode: "create" | "edit";
  initialData?: Patient;
}

export function PatientForm({ mode, initialData }: PatientFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PatientPayload>(initialData || INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof PatientPayload, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [duplicatePatient, setDuplicatePatient] = useState<Patient | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const handleEnterKey = useEnterToNext();

  // ─── Side Effects ──────────────────────────────────────────────────────────

  // Sync Age from DOB
  useEffect(() => {
    if (form.dateOfBirth) {
      const age = calculateAge(form.dateOfBirth);
      setForm((p) => ({ ...p, age }));
    }
  }, [form.dateOfBirth]);

  // Duplicate Check with Debounce
  useEffect(() => {
    if (mode === "edit" || form.phone.length < 10) {
      setDuplicatePatient(null);
      return;
    }

    const timer = setTimeout(async () => {
      if (isValidIndianMobile(form.phone)) {
        setIsCheckingDuplicate(true);
        try {
          const patients = await patientService.getPatients();
          const found = patients.find(p => p.phone === form.phone);
          setDuplicatePatient(found || null);
        } catch (err) {
          console.error("Duplicate check failed", err);
        } finally {
          setIsCheckingDuplicate(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.phone, mode]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const upd =
    (f: keyof PatientPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [f]: e.target.value }));
      if (f in errors) setErrors((p) => ({ ...p, [f]: undefined }));
    };

  const validate = (): boolean => {
    const e: Partial<Record<keyof PatientPayload, string>> = {};

    if (!form.fullName.trim()) e.fullName = "Full Name is required";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.patientType) e.patientType = "Registration type required";
    
    if (!form.phone.trim()) {
      e.phone = "Mobile is required";
    } else if (!isValidIndianMobile(form.phone)) {
      e.phone = "Enter valid 10-digit mobile number (starting 6-9)";
    }

    if (form.idProofType === "aadhaar" && form.idProofNumber && !isValidAadhaar(form.idProofNumber)) {
      e.idProofNumber = "Enter valid 12-digit Aadhaar number";
    }

    const ageNum = parseInt(form.age || "0");
    if (form.age && (ageNum < 0 || ageNum > 120)) {
      e.age = "Invalid age range (0-120)";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors.");
      return;
    }

    setIsSaving(true);
    try {
      if (mode === "edit" && initialData) {
        await patientService.updatePatient(initialData.id, form);
        toast.success("Patient updated successfully!");
        router.push("/patients");
      } else {
        const created = await patientService.createPatient(form);
        toast.success(`Registered: ${created.uhid}`, {
          description: created.fullName,
        });
        setForm({ ...INITIAL, registrationDate: nowLocal() });
        setErrors({});
        nameRef.current?.focus();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save patient.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate onKeyDown={handleEnterKey} className="space-y-4">
      {/* ── UHID / Status Badge ───────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-xs mb-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">UHID Status</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-mono font-bold leading-none",
                mode === "edit" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 border border-gray-200"
              )}>
                {mode === "edit" ? initialData?.uhid : "AUTO-GENERATED ON SAVE"}
              </span>
              {mode === "edit" && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Mode:</span>
           <span className={cn(
             "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
             mode === "create" ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"
           )}>
             {mode === "create" ? "New Registration" : "Profile Update"}
           </span>
        </div>
      </div>

      {/* Quick Registration (Required) */}
      <div className="bg-white rounded-xl border-2 border-indigo-100/50 shadow-sm px-4 py-5 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">A. Quick Registration</span>
          <div className="h-[1px] flex-1 bg-indigo-50"></div>
          <span className="text-[10px] font-bold text-white bg-indigo-500 rounded-full px-2 py-0.5 leading-none shadow-xs">Critical Fields</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Patient Type"
            required
            options={patientTypeOpts}
            value={form.patientType}
            onChange={upd("patientType")}
            error={errors.patientType}
          />
          <FormSelect
            label="Visit Type"
            options={visitTypeOpts}
            value={form.visitType}
            onChange={upd("visitType")}
          />
          <FormSelect
            label="Department"
            options={departmentOpts}
            value={form.department}
            onChange={upd("department")}
          />
        </div>

        <FormInput
          ref={nameRef}
          label="Full Name"
          required
          placeholder="e.g. Ramesh Kumar"
          value={form.fullName}
          onChange={upd("fullName")}
          error={errors.fullName}
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <FormSelect
            label="Gender"
            required
            options={genderOpts}
            value={form.gender}
            onChange={upd("gender")}
            error={errors.gender}
          />
          <FormInput
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={upd("dateOfBirth")}
            max={new Date().toISOString().split("T")[0]}
          />
          <FormInput
            label="Age"
            type="number"
            placeholder="Auto"
            value={form.age}
            onChange={upd("age")}
            error={errors.age}
          />
          <div className="relative">
            <FormInput
              label="Mobile Number"
              required
              maxLength={10}
              placeholder="10 digits"
              value={form.phone}
              onChange={upd("phone")}
              error={errors.phone}
            />
            {isCheckingDuplicate && (
              <div className="absolute right-0 top-0 mt-7.5 mr-2">
                <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              </div>
            )}
            
            {/* Duplicate Warning */}
            {duplicatePatient && (
              <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-amber-900 leading-tight">Patient already exists</p>
                    <p className="text-[10px] text-amber-700 mt-0.5 truncate">{duplicatePatient.fullName} ({duplicatePatient.uhid})</p>
                    <button
                      type="button"
                      onClick={() => router.push(`/patients/view/${duplicatePatient.id}`)}
                      className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-tight"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <FormInput
            label="Alt Mobile"
            maxLength={10}
            value={form.alternatePhone}
            onChange={upd("alternatePhone")}
          />
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-3">
        <CollapsibleSection title="B. Address & ID Proof (Optional)" optional>
          <div className="space-y-4 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                label="ID Proof Type"
                options={idProofOpts}
                value={form.idProofType}
                onChange={upd("idProofType")}
              />
              <div className="md:col-span-2">
                <FormInput
                  label="ID Number"
                  placeholder={idProofPlaceholders[form.idProofType!] || "Enter number"}
                  value={form.idProofNumber}
                  onChange={upd("idProofNumber")}
                  error={errors.idProofNumber}
                />
              </div>
            </div>
            <FormTextarea label="Address" value={form.address} onChange={upd("address")} rows={2} />
            <div className="grid grid-cols-3 gap-4">
              <FormInput label="City" value={form.city} onChange={upd("city")} />
              <FormSelect label="State" options={indianStates} value={form.state} onChange={upd("state")} />
              <FormInput label="Pincode" maxLength={6} value={form.pincode} onChange={upd("pincode")} />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="C. Personal & Guardian Details (Optional)" optional>
          <div className="space-y-4 pt-3">
            <div className="grid grid-cols-3 gap-4">
              <FormSelect label="Blood Group" options={bloodGroupOpts} value={form.bloodGroup} onChange={upd("bloodGroup")} />
              <FormSelect label="Marital Status" options={maritalOpts} value={form.maritalStatus} onChange={upd("maritalStatus")} />
              <FormInput label="Occupation" value={form.occupation} onChange={upd("occupation")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormInput label="Guardian Name" value={form.guardianName} onChange={upd("guardianName")} />
              </div>
              <FormSelect label="Relation" options={relationOpts} value={form.guardianRelation} onChange={upd("guardianRelation")} />
            </div>
            <FormInput label="Referred By" value={form.referredBy} onChange={upd("referredBy")} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="D. Emergency Contact (Optional)" optional>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            <FormInput label="Contact Name" value={form.emergencyContactName} onChange={upd("emergencyContactName")} />
            <FormSelect label="Relation" options={relationOpts} value={form.emergencyContactRelation} onChange={upd("emergencyContactRelation")} />
            <FormInput label="Contact Mobile" value={form.emergencyContactPhone} onChange={upd("emergencyContactPhone")} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="E. Medical History (Optional)" optional>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            <FormTextarea label="Allergies" value={form.allergies} onChange={upd("allergies")} rows={2} />
            <FormTextarea label="Conditions" value={form.existingConditions} onChange={upd("existingConditions")} rows={2} />
            <div className="md:col-span-2">
              <FormTextarea label="Notes" value={form.notes} onChange={upd("notes")} rows={2} />
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] transition-all">
        <span className="text-[11px] font-medium text-gray-400 mr-auto hidden lg:flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5" />
          Fields marked with * are mandatory for registration.
        </span>
        <button
          type="button"
          onClick={() => router.push("/patients")}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all active:scale-95 shadow-xs"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-10 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white shadow-md disabled:bg-indigo-400 transition-all active:scale-95"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {mode === "create" ? "Confirm & Register" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
