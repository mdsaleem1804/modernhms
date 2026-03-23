"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Edit2, User, Loader2 } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { DataTable } from "@/components/ui/DataTable";
import { patientService, type Patient } from "@/services/api/patientService";
import { cn } from "@/lib/utils";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await patientService.getPatients();
        setPatients(data);
      } catch (err) {
        console.error("Failed to load patients", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(query) ||
      p.phone.includes(query) ||
      p.uhid.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      header: "Patient",
      accessor: (p: Patient) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 leading-none">{p.fullName}</span>
            <span className="text-[10px] text-gray-400 font-mono mt-1">{p.uhid}</span>
          </div>
        </div>
      ),
    },
    { header: "Age", accessor: (p: Patient) => p.age || "N/A" },
    { header: "Gender", accessor: (p: Patient) => p.gender || "N/A" },
    { header: "Mobile", accessor: (p: Patient) => p.phone },
    {
      header: "Actions",
      className: "text-right",
      accessor: (p: Patient) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Link
            href={`/patients/view/${p.id}`}
            title="View Details"
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/patients/edit/${p.id}`}
            title="Edit Patient"
            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Patients</h1>
          <p className="text-xs text-gray-400">Manage and view registration records of all patients.</p>
        </div>
        <Link
          href="/patients/add"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient</span>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
        <SearchInput
          placeholder="Search by name, mobile or UHID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
        />
        <div className="text-[11px] text-gray-400 font-medium">
          Showing <span className="text-gray-900">{filteredPatients.length}</span> results
        </div>
      </div>

      <DataTable
        columns={columns as any}
        data={filteredPatients}
        isLoading={isLoading}
        emptyMessage={searchQuery ? "No patients match your search." : "No patient records found."}
      />
    </div>
  );
}



