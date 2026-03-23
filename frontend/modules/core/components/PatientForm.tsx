"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Loader2, AlertCircle, ExternalLink, CheckCircle2, Activity } from "lucide-react";
import { useEnterToNext } from "@/hooks/useEnterToNext";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { patientService, type Patient, type PatientPayload } from "@/services/api/patientService";
import { type ModeOfArrival } from "@/services/api/types";
import { calculateAge, isValidIndianMobile, isValidAadhaar } from "@/lib/helpers";
import { cn } from "@/lib/utils";

// ─── Options ─────────────────────────────────────────────────────────────────
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
  fullName: "", gender: "", dateOfBirth: "", age: "",
  phone: "", alternatePhone: "",
  idProofType: "", idProofNumber: "",
  address: "", city: "", state: "", pincode: "",
  bloodGroup: "", maritalStatus: "", occupation: "",
  guardianName: "", guardianRelation: "",
  occupyingPersonName: "", occupyingPersonPhone: "", occupyingPersonRelation: "", occupyingPersonIdProofType: "", occupyingPersonIdProofNumber: "",
  referredBy: "",
  emergencyContactName: "", emergencyContactRelation: "", emergencyContactPhone: "",
  allergies: "", existingConditions: "", notes: "",
  modeOfArrival: {
    drName: "", drDepartment: "", drHospital: "",
    patientReferral: "", patientReferralOther: "",
    searchEngine: [], searchEngineOther: "",
    socialMedia: [], socialMediaOther: "",
    transportAds: [], transportAdsOther: "",
    publicPlacesAds: [], publicPlacesAdsOther: "",
    signages: [], signagesOther: "",
    massMedia: [], massMediaOther: "",
    gatherings: [], gatheringsOther: ""
  }
};

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
  const [activeTab, setActiveTab] = useState("address");
  
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

  const upd = (f: keyof PatientPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [f]: e.target.value }));
    if (f in errors) setErrors((p) => ({ ...p, [f]: undefined }));
  };

  const updMoAText = (f: keyof ModeOfArrival) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, modeOfArrival: { ...p.modeOfArrival, [f]: e.target.value } }));
  };

  const toggleMoA = (f: keyof ModeOfArrival, val: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => {
      const arr = (p.modeOfArrival?.[f] as string[]) || [];
      const newArr = e.target.checked ? [...arr, val] : arr.filter((x) => x !== val);
      return { ...p, modeOfArrival: { ...p.modeOfArrival, [f]: newArr } };
    });
  };

  const toggleRadioMoA = (f: keyof ModeOfArrival, val: string) => () => {
    setForm((p) => ({ ...p, modeOfArrival: { ...p.modeOfArrival, [f]: val } }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof PatientPayload, string>> = {};

    if (!form.fullName.trim()) e.fullName = "Full Name is required";
    if (!form.gender) e.gender = "Gender is required";
    
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

  const tabs = [
    { id: "address", label: "Address Details" },
    { id: "guardian", label: "Guardian / Relationship" },
    { id: "occupying", label: "Occupying Person" },
    { id: "referral", label: "Mode of Arrival" },
    { id: "medical", label: "Medical History" },
    { id: "other", label: "Other Details" },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate onKeyDown={handleEnterKey} className="pb-24 bg-slate-50/30">
      {/* ── Main Information Section ──────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
        <div className="max-w-4xl space-y-3">
          <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-3">Patient Identity</h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="text-[13px] font-medium text-slate-700 w-32 sm:w-40 shrink-0">Primary Name <span className="text-red-500">*</span></label>
            <div className="flex-1 max-w-md">
              <FormInput label="" placeholder="Enter Full Name" value={form.fullName} onChange={upd("fullName")} error={errors.fullName} ref={nameRef} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="text-[13px] font-medium text-slate-700 w-32 sm:w-40 shrink-0">Gender & DOB <span className="text-red-500">*</span></label>
            <div className="flex-1 max-w-md flex gap-2">
              <div className="w-[110px]">
                 <FormSelect label="" options={genderOpts} value={form.gender} onChange={upd("gender")} error={errors.gender} />
              </div>
              <div className="flex-1 flex items-center gap-2">
                 <FormInput label="" type="date" value={form.dateOfBirth} onChange={upd("dateOfBirth")} className="w-[130px]" />
                 <FormInput label="" type="number" placeholder="Age" value={form.age} onChange={upd("age")} className="w-[70px]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="text-[13px] font-medium text-slate-700 w-32 sm:w-40 shrink-0">Contact Number <span className="text-red-500">*</span></label>
            <div className="flex-1 max-w-md flex gap-2">
              <div className="w-1/2 relative">
                 <FormInput label="" maxLength={10} placeholder="Mobile" value={form.phone} onChange={upd("phone")} error={errors.phone} ref={phoneRef} className="pl-9" />
                 <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[11px]">+91</div>
              </div>
              <div className="w-1/2">
                 <FormInput label="" maxLength={10} placeholder="Alternate Mobile" value={form.alternatePhone} onChange={upd("alternatePhone")} className="w-full" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 pt-3 border-t border-slate-50">
            <label className="text-[13px] font-medium text-slate-700 w-32 sm:w-40 shrink-0">Identity Proof</label>
            <div className="flex-1 max-w-md flex gap-2">
              <div className="w-1/3">
                 <FormSelect label="" options={idProofOpts} value={form.idProofType} onChange={upd("idProofType")} />
              </div>
              <div className="w-2/3">
                 <FormInput label="" placeholder={idProofPlaceholders[form.idProofType!] || "ID Number"} value={form.idProofNumber} onChange={upd("idProofNumber")} error={errors.idProofNumber} />
              </div>
            </div>
          </div>
        </div>

        {duplicatePatient && (
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-4 animate-in slide-in-from-top-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">Record Found with same Mobile</h4>
              <p className="text-xs text-amber-700">{duplicatePatient.fullName} ({duplicatePatient.uhid})</p>
            </div>
            <button type="button" onClick={() => router.push(`/patients/view/${duplicatePatient.id}`)} className="ml-auto px-4 py-1.5 bg-white border border-amber-200 rounded text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors">
              Go to Profile
            </button>
          </div>
        )}
      </div>

      {/* ── Tabs Section ──────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 text-[13px] font-bold transition-all relative",
                activeTab === tab.id
                  ? "text-blue-600 bg-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "address" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Current Residence Address
                </h4>
                <div className="space-y-4">
                  <FormTextarea label="Street Address" value={form.address} onChange={upd("address")} rows={2} className="bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="City" value={form.city} onChange={upd("city")} className="bg-slate-50/50 border-slate-200" />
                    <FormSelect label="State" options={indianStates} value={form.state} onChange={upd("state")} className="bg-slate-50/50 border-slate-200" />
                  </div>
                  <FormInput label="Zip/Pincode" maxLength={6} value={form.pincode} onChange={upd("pincode")} className="w-28 bg-slate-50/50 border-slate-200" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    Permanent Address
                  </h4>
                  <button type="button" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Same as current
                  </button>
                </div>
                <div className="space-y-4 opacity-60">
                  <FormTextarea label="Street Address" rows={2} className="bg-slate-50/30 border-slate-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="City" className="bg-slate-50/30 border-slate-100" />
                    <FormSelect label="State" options={indianStates} className="bg-slate-50/30 border-slate-100" />
                  </div>
                  <FormInput label="Zip/Pincode" className="w-28 bg-slate-50/30 border-slate-100" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "guardian" && (
            <div className="max-w-2xl space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Guardian/Parent Name" value={form.guardianName} onChange={upd("guardianName")} />
                  <FormSelect label="Relation with Patient" options={relationOpts} value={form.guardianRelation} onChange={upd("guardianRelation")} />
               </div>
               <div className="border-t border-slate-100 pt-6 mt-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Contact Person Name" value={form.emergencyContactName} onChange={upd("emergencyContactName")} />
                    <FormSelect label="Relationship" options={relationOpts} value={form.emergencyContactRelation} onChange={upd("emergencyContactRelation")} />
                    <FormInput label="Emergency Phone" value={form.emergencyContactPhone} onChange={upd("emergencyContactPhone")} />
                  </div>
               </div>
            </div>
          )}

           {activeTab === "occupying" && (
            <div className="max-w-2xl space-y-6">
               <h4 className="text-sm font-bold text-slate-900 mb-4">Occupying Person Details</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Name" value={form.occupyingPersonName} onChange={upd("occupyingPersonName")} placeholder="Full Name of occupying person" />
                  <FormInput label="Contact Number" value={form.occupyingPersonPhone} onChange={upd("occupyingPersonPhone")} placeholder="Mobile / Phone number" />
                  <FormInput label="Relationship" value={form.occupyingPersonRelation} onChange={upd("occupyingPersonRelation")} placeholder="e.g. Self, Son, Daughter, Tenant" />
               </div>
               <div className="border-t border-slate-100 pt-6 mt-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Identity Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput label="ID Proof Type" value={form.occupyingPersonIdProofType} onChange={upd("occupyingPersonIdProofType")} placeholder="e.g. Aadhaar, PAN (write 'Not Available' if none)" />
                      <FormInput label="ID Proof Number" value={form.occupyingPersonIdProofNumber} onChange={upd("occupyingPersonIdProofNumber")} placeholder="Enter identification number" />
                  </div>
               </div>
            </div>
          )}

          {activeTab === "referral" && (
            <div className="space-y-6">
              <div className="text-center font-bold uppercase tracking-widest text-sm border-b-2 border-slate-900 pb-2 mb-4">
                Patient Mode of Arrival Form
                <p className="text-xs font-normal text-slate-500 normal-case mt-1">[Tick the appropriate check boxes and write the details wherever indicated]</p>
              </div>

              {/* Referrals */}
              <div>
                <h4 className="text-[#0ea5e9] text-sm mb-3">Referrals:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold w-max shrink-0">Doctor's Referral: Name</span>
                    <FormInput label="" placeholder="" className="w-40 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" value={form.modeOfArrival?.drName || ""} onChange={updMoAText('drName')} />
                    <span className="text-sm font-semibold ml-2">Department</span>
                    <FormInput label="" placeholder="" className="w-32 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" value={form.modeOfArrival?.drDepartment || ""} onChange={updMoAText('drDepartment')} />
                    <span className="text-sm font-semibold ml-2">Hospital</span>
                    <FormInput label="" placeholder="" className="w-48 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" value={form.modeOfArrival?.drHospital || ""} onChange={updMoAText('drHospital')} />
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-semibold shrink-0">Patient/Relatives Referral:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" className="w-4 h-4" name="patient-ref" checked={form.modeOfArrival?.patientReferral === "Same Department"} onChange={toggleRadioMoA('patientReferral', 'Same Department')} /> Same Department</label>
                    <label className="flex items-center gap-1.5 cursor-pointer ml-4"><input type="radio" className="w-4 h-4" name="patient-ref" checked={form.modeOfArrival?.patientReferral === "Others"} onChange={toggleRadioMoA('patientReferral', 'Others')} /> Others</label>
                    <FormInput label="" placeholder="" className="w-64 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" disabled={form.modeOfArrival?.patientReferral !== "Others"} value={form.modeOfArrival?.patientReferralOther || ""} onChange={updMoAText('patientReferralOther')} />
                  </div>
                </div>
              </div>

              {/* Online Advertisements */}
              <div className="pt-2">
                <h4 className="text-[#0ea5e9] text-sm mb-3">Online Advertisements:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold w-32 shrink-0">Search Engine:</span>
                    {["Google", "Hospital Website"].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer mr-4"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.searchEngine?.includes(opt))} onChange={toggleMoA('searchEngine', opt)} /> {opt}</label>
                    ))}
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.searchEngine?.includes("Others"))} onChange={toggleMoA('searchEngine', "Others")} /> Others</label>
                    <FormInput label="" disabled={!form.modeOfArrival?.searchEngine?.includes("Others")} className="w-64 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" value={form.modeOfArrival?.searchEngineOther || ""} onChange={updMoAText('searchEngineOther')} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold w-32 shrink-0">Social Media:</span>
                    {["Facebook", "Instagram", "WhatsApp"].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer mr-4"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.socialMedia?.includes(opt))} onChange={toggleMoA('socialMedia', opt)} /> {opt}</label>
                    ))}
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.socialMedia?.includes("Others"))} onChange={toggleMoA('socialMedia', "Others")} /> Others</label>
                    <FormInput label="" disabled={!form.modeOfArrival?.socialMedia?.includes("Others")} className="w-48 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" value={form.modeOfArrival?.socialMediaOther || ""} onChange={updMoAText('socialMediaOther')} />
                  </div>
                </div>
              </div>

              {/* Offline Advertisements */}
              <div className="pt-2">
                <h4 className="text-[#0ea5e9] text-sm mb-3">Offline Advertisements:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold w-36 shrink-0">Transport Ads:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer mr-10"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.transportAds?.includes("Buses"))} onChange={toggleMoA('transportAds', "Buses")} /> Buses</label>
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.transportAds?.includes("Others"))} onChange={toggleMoA('transportAds', "Others")} /> Others</label>
                    <FormInput label="" className="w-[400px] border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" disabled={!form.modeOfArrival?.transportAds?.includes("Others")} value={form.modeOfArrival?.transportAdsOther || ""} onChange={updMoAText('transportAdsOther')} />
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold w-36 shrink-0">Public places Ads:</span>
                    {["Theatres", "Banners", "Barricades", "Roadside displays"].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer mr-4"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.publicPlacesAds?.includes(opt))} onChange={toggleMoA('publicPlacesAds', opt)} /> {opt}</label>
                    ))}
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.publicPlacesAds?.includes("Others"))} onChange={toggleMoA('publicPlacesAds', "Others")} /> Others</label>
                    <FormInput label="" className="w-40 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" disabled={!form.modeOfArrival?.publicPlacesAds?.includes("Others")} value={form.modeOfArrival?.publicPlacesAdsOther || ""} onChange={updMoAText('publicPlacesAdsOther')} />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold w-36 shrink-0">Signages:</span>
                    {["Outside Name Boards", "Pamphlets"].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer mr-4"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.signages?.includes(opt))} onChange={toggleMoA('signages', opt)} /> {opt}</label>
                    ))}
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.signages?.includes("Others"))} onChange={toggleMoA('signages', "Others")} /> Others</label>
                    <FormInput label="" className="w-64 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" disabled={!form.modeOfArrival?.signages?.includes("Others")} value={form.modeOfArrival?.signagesOther || ""} onChange={updMoAText('signagesOther')} />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold w-36 shrink-0">Mass Media:</span>
                    {["TV News", "FM Ad", "Newspapers"].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer mr-4"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.massMedia?.includes(opt))} onChange={toggleMoA('massMedia', opt)} /> {opt}</label>
                    ))}
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.massMedia?.includes("Others"))} onChange={toggleMoA('massMedia', "Others")} /> Others</label>
                    <FormInput label="" className="w-[300px] border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" disabled={!form.modeOfArrival?.massMedia?.includes("Others")} value={form.modeOfArrival?.massMediaOther || ""} onChange={updMoAText('massMediaOther')} />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold w-36 shrink-0">Gatherings:</span>
                    {["Health Camps", "Awareness Programs"].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer mr-4"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.gatherings?.includes(opt))} onChange={toggleMoA('gatherings', opt)} /> {opt}</label>
                    ))}
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={Boolean(form.modeOfArrival?.gatherings?.includes("Others"))} onChange={toggleMoA('gatherings', "Others")} /> Others</label>
                    <FormInput label="" className="w-64 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none shadow-none px-0" disabled={!form.modeOfArrival?.gatherings?.includes("Others")} value={form.modeOfArrival?.gatheringsOther || ""} onChange={updMoAText('gatheringsOther')} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "medical" && (
            <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormTextarea label="Known Allergies" value={form.allergies} onChange={upd("allergies")} rows={3} placeholder="e.g. No known drug allergies" />
               <FormTextarea label="Existing Medical Conditions" value={form.existingConditions} onChange={upd("existingConditions")} rows={3} />
               <div className="md:col-span-2">
                  <FormTextarea label="Important Medical Notes" value={form.notes} onChange={upd("notes")} rows={3} />
               </div>
            </div>
          )}

          {activeTab === "other" && (
           <div className="max-w-3xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect label="Blood Group" options={bloodGroupOpts} value={form.bloodGroup} onChange={upd("bloodGroup")} />
                <FormSelect label="Marital Status" options={maritalOpts} value={form.maritalStatus} onChange={upd("maritalStatus")} />
              </div>
              <FormInput label="Occupation" value={form.occupation} onChange={upd("occupation")} />
              <FormInput label="Referrer Name / Entity" value={form.referredBy} onChange={upd("referredBy")} placeholder="e.g. Dr. Satish Pal" />
           </div>
          )}
        </div>
      </div>

      {/* ── Fixed Footer Action Bar ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-end gap-3 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <button
          type="button"
          onClick={() => router.push("/patients")}
          disabled={isSaving}
          className="px-6 py-2.5 rounded text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-10 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === "create" ? "Save & Register Patient" : "Apply Changes"}
        </button>
      </div>
    </form>
  );
}
