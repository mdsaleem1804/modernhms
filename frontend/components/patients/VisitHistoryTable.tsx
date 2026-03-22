import React from "react";
import { Clock, ClipboardList, UserCheck, Stethoscope } from "lucide-react";
import { type Visit } from "@/services/api/types";
import { cn } from "@/lib/utils";

interface VisitHistoryTableProps {
  visits: Visit[];
}

export function VisitHistoryTable({ visits }: VisitHistoryTableProps) {
  if (!visits || visits.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No Visit History</h3>
        <p className="text-gray-500 max-w-xs mx-auto mt-2">
          This patient hasn't recorded any visits yet. Start a new consultation to begin their journey.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100/50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-emerald-600" />
          Visit History
        </h3>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
          {visits.length} Total Visits
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Complaint</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doctor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {new Date(visit.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700 font-medium">
                    {visit.complaint}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Stethoscope className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {visit.doctor}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                    visit.type === 'OPD' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                  )}>
                    {visit.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
