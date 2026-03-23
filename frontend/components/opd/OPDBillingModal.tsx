"use client";

import { useMemo, useState } from "react";
import { OPDVisit } from "@/services/api/types";

interface OPDBillingModalProps {
  visit: OPDVisit | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { visitId: string; discount: number; paymentMode: "Cash" | "UPI" | "Card" }) => Promise<void>;
}

export function OPDBillingModal({ visit, isOpen, onClose, onConfirm }: OPDBillingModalProps) {
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<"Cash" | "UPI" | "Card">("Cash");
  const [submitting, setSubmitting] = useState(false);

  const fee = visit?.consultationFee ?? 0;
  const finalAmount = useMemo(() => Math.max(fee - discount, 0), [fee, discount]);

  if (!isOpen || !visit) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">OPD Billing</h2>
        <div className="mt-3 grid gap-2">
          <input value={visit.patientName} readOnly className="h-9 rounded-md border border-gray-200 bg-gray-50 px-2 text-xs font-semibold text-gray-700" />
          <input value={visit.doctorName} readOnly className="h-9 rounded-md border border-gray-200 bg-gray-50 px-2 text-xs font-semibold text-gray-700" />
          <input value={fee} readOnly className="h-9 rounded-md border border-gray-200 bg-gray-50 px-2 text-xs font-semibold text-gray-700" />
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold outline-none focus:border-indigo-500"
            placeholder="Discount"
          />
          <input value={finalAmount} readOnly className="h-9 rounded-md border border-gray-200 bg-gray-50 px-2 text-xs font-semibold text-gray-700" />
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as "Cash" | "UPI" | "Card")}
            className="h-9 rounded-md border border-gray-200 px-2 text-xs font-semibold outline-none focus:border-indigo-500"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-gray-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-gray-600">
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              try {
                await onConfirm({ visitId: visit.id, discount, paymentMode });
                onClose();
              } finally {
                setSubmitting(false);
              }
            }}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white disabled:opacity-60"
          >
            {submitting ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
