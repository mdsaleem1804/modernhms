import React from "react";
import { User, Phone, MapPin, Calendar, Hash } from "lucide-react";
import { type Patient } from "@/services/api/types";

interface PatientInfoCardProps {
  patient: Patient;
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100/50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          Patient Information
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem 
            icon={Hash} 
            label="UHID" 
            value={patient.uhid} 
            valueClassName="font-mono text-indigo-600 font-bold"
          />
          <InfoItem 
            icon={User} 
            label="Full Name" 
            value={patient.fullName} 
            valueClassName="font-semibold text-gray-900"
          />
          <InfoItem 
            icon={Calendar} 
            label="Age / Gender" 
            value={`${patient.age || "N/A"} / ${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}`} 
          />
          <InfoItem 
            icon={Phone} 
            label="Mobile Number" 
            value={patient.phone} 
          />
          <InfoItem 
            icon={MapPin} 
            label="Address" 
            value={`${patient.address || ""}, ${patient.city || ""}, ${patient.state || ""}`.trim().replace(/^, |, $/g, '') || "N/A"} 
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ 
  icon: Icon, 
  label, 
  value, 
  className = "", 
  valueClassName = "text-gray-700 font-medium" 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {label}
      </span>
      <span className={`text-sm md:text-base ${valueClassName}`}>
        {value || "-"}
      </span>
    </div>
  );
}
