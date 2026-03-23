"use client";

import Link from "next/link";
import { Check, CheckCircle2, CreditCard, MoreHorizontal, PlayCircle, Stethoscope, TriangleAlert } from "lucide-react";
import { OPDVisit } from "@/services/api/types";
import { cn } from "@/lib/utils";

interface OPDQueueTableProps {
  visits: OPDVisit[];
  onPayAndConfirm: (visit: OPDVisit) => void;
  onStartConsultation: (visit: OPDVisit) => void;
  onMarkCompleted: (visit: OPDVisit) => void;
}

const statusClassMap: Record<OPDVisit["status"], string> = {
  "Billing Pending": "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  Waiting: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "In Consultation": "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export function OPDQueueTable({ visits, onPayAndConfirm, onStartConsultation, onMarkCompleted }: OPDQueueTableProps) {
  const getDisplayToken = (token: string) => {
    const numeric = token.replace(/\D/g, "");
    return numeric ? `#${numeric}` : token;
  };

  if (visits.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-16 text-center">
        <Stethoscope className="mx-auto mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm font-bold text-gray-700">No OPD visits in queue.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Token</th>
              <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Patient</th>
              <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Doctor</th>
              <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Visit Type</th>
              <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Payment</th>
              <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Priority</th>
              <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visits.map((visit) => (
              <tr
                key={visit.id}
                className={cn(
                  "group transition-colors hover:bg-gray-50/70"
                )}
              >
                <td className="px-3 py-2.5">
                  <span className="text-xs font-semibold text-gray-700">
                    {getDisplayToken(visit.tokenNo)}
                  </span>
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <p className="text-sm font-bold text-gray-900">{visit.patientName}</p>
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400">ID: {visit.patientId}</p>
                </td>
                <td className="px-3 py-2.5 text-xs font-semibold text-gray-700">{visit.doctorName}</td>
                <td className="px-3 py-2.5">
                  <span className="text-xs font-semibold text-gray-600">{visit.source}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={cn("inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide", statusClassMap[visit.status])}>
                    {visit.status}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700">
                    {visit.billingStatus === "Paid" ? <Check className="h-3.5 w-3.5 text-gray-500" /> : <TriangleAlert className="h-3.5 w-3.5 text-gray-500" />}
                    {visit.billingStatus === "Paid" ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-xs font-semibold text-gray-500">{visit.priority}</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    {visit.status === "Billing Pending" ? (
                      <button
                        onClick={() => onPayAndConfirm(visit)}
                        className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-bold text-gray-700 hover:bg-gray-50"
                      >
                        <CreditCard className="h-3 w-3" />
                        Pay Now
                      </button>
                    ) : visit.status === "Waiting" ? (
                      <button
                        onClick={() => onStartConsultation(visit)}
                        disabled={visit.billingStatus !== "Paid" && !visit.isEmergency && !visit.allowCredit}
                        title={visit.billingStatus !== "Paid" && !visit.isEmergency && !visit.allowCredit ? "Complete billing before consultation" : "Start consultation"}
                        className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <PlayCircle className="h-3 w-3" />
                        Start
                      </button>
                    ) : (
                      <Link
                        href={`/opd/${visit.id}`}
                        className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-bold text-gray-700 hover:bg-gray-50"
                      >
                        View
                      </Link>
                    )}
                    <details className="relative">
                      <summary className="list-none cursor-pointer rounded border border-gray-300 bg-white p-1 text-gray-600 hover:bg-gray-50">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </summary>
                      <div className="absolute right-0 z-10 mt-1 w-36 rounded border border-gray-200 bg-white shadow-sm">
                        <Link href={`/opd/${visit.id}`} className="block px-2 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                          Open Visit
                        </Link>
                        {visit.status === "In Consultation" && (
                          <button
                            onClick={() => onMarkCompleted(visit)}
                            className="flex w-full items-center gap-1 px-2 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </details>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
