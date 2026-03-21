"use client";

import React from "react";
import Link from "next/link";
import { Eye, Edit2, User, ArrowRight } from "lucide-react";
import { Patient } from "@/services/api/patientService";
import { cn } from "@/lib/utils";

interface RecentPatientsTableProps {
  patients: Patient[];
  isLoading?: boolean;
}

export function RecentPatientsTable({ patients, isLoading = false }: RecentPatientsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="h-5 w-32 bg-gray-100 rounded" />
          <div className="h-4 w-20 bg-gray-50 rounded" />
        </div>
        <div className="p-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
              <div className="w-10 h-10 bg-gray-50 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-50 rounded" />
              </div>
              <div className="h-8 w-24 bg-gray-50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No recent patients</h3>
        <p className="text-sm text-gray-500 mt-2">New registrations will appear here.</p>
        <Link 
          href="/patients/add"
          className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mt-6 hover:gap-3 transition-all"
        >
          <span>Register a Patient</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Activity</h3>
        <Link href="/patients" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          View All Patients
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">UHID</th>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile</th>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reg Date</th>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-none">{p.fullName}</p>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-1.5 inline-block uppercase tracking-tight">
                        {p.gender} • {p.age || "N/A"} yr
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {p.uhid}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-500">{p.phone}</td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-gray-700">
                    {new Date(p.registrationDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(p.registrationDate).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/patients/view/${p.id}`}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/patients/edit/${p.id}`}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-gray-50/20 text-center border-t border-gray-50">
         <Link href="/patients/add" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
           + Rapid Registration
         </Link>
      </div>
    </div>
  );
}
