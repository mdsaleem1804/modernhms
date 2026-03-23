import { OPDVisit, Patient } from "@/services/api/types";

interface StickyPatientHeaderProps {
  patient: Patient;
  visit: OPDVisit;
}

export function StickyPatientHeader({ patient, visit }: StickyPatientHeaderProps) {
  return (
    <div className="sticky top-0 z-20 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <div className="grid gap-2 text-xs font-semibold text-gray-700 md:grid-cols-5">
        <p>
          <span className="font-black text-gray-500">Patient:</span> {patient.fullName}
        </p>
        <p>
          <span className="font-black text-gray-500">Age:</span> {patient.age || "-"}
        </p>
        <p>
          <span className="font-black text-gray-500">Gender:</span> {patient.gender || "-"}
        </p>
        <p>
          <span className="font-black text-gray-500">UHID:</span> {patient.uhid}
        </p>
        <p>
          <span className="font-black text-gray-500">Visit:</span> {visit.tokenNo}
        </p>
      </div>
    </div>
  );
}
