import { fetchApi } from "./index";
import { mockDb, MOCK_DOCTOR_CONSULTATION_FEES, MOCK_MEDICINES } from "./mockData";
import {
  AppointmentPriority,
  MedicineCatalogItem,
  OPDActivityLog,
  OPDVisit,
  OPDVisitStatus,
  OPDBillingStatus,
  PrescriptionItem,
} from "./types";

const USE_MOCK = true;
const DELAY = 300;

type CreateVisitFromAppointmentInput = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  priority: AppointmentPriority;
  tokenNo: string;
  isEmergency?: boolean;
  allowCredit?: boolean;
};

type CreateWalkInVisitInput = {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  priority: "Normal" | "Emergency";
  isEmergency?: boolean;
  allowCredit?: boolean;
};

type ConfirmBillingInput = {
  visitId: string;
  discount?: number;
  paymentMode: "Cash" | "UPI" | "Card";
};

type UpdateConsultationInput = {
  vitals?: OPDVisit["vitals"];
  symptoms?: string;
  commonSymptoms?: string[];
  diagnosis?: string;
  prescriptions?: PrescriptionItem[];
  notes?: string;
  followUpDate?: string;
  followUpRemarks?: string;
};

const allowedTransitions: Record<OPDVisitStatus, OPDVisitStatus[]> = {
  "Billing Pending": ["Waiting"],
  Waiting: ["In Consultation"],
  "In Consultation": ["Completed"],
  Completed: [],
};

function buildLog(visitId: string, status: OPDVisitStatus): OPDActivityLog {
  if (status === "In Consultation") {
    return {
      id: `opd-log-${Date.now()}`,
      visitId,
      action: "Consultation Started",
      description: "Doctor started consultation",
      performedBy: "Doctor",
      timestamp: new Date().toISOString(),
    };
  }

  return {
    id: `opd-log-${Date.now()}`,
    visitId,
    action: "Consultation Completed",
    description: "Consultation marked as completed",
    performedBy: "Doctor",
    timestamp: new Date().toISOString(),
  };
}

function toOpdPriority(priority: AppointmentPriority) {
  return priority === "Emergency" ? "Emergency" : "Normal";
}

function getConsultationFeeByDoctor(doctorId: string) {
  return MOCK_DOCTOR_CONSULTATION_FEES[doctorId] ?? 500;
}

function canBypassBilling(visit: OPDVisit) {
  return !!visit.isEmergency || !!visit.allowCredit || visit.consultationFee === 0;
}

function canStartConsultation(visit: OPDVisit) {
  return visit.status === "Waiting" && (visit.billingStatus === "Paid" || canBypassBilling(visit));
}

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const opdService = {
  getVisits: async (): Promise<OPDVisit[]> => {
    if (USE_MOCK) {
      await delay(DELAY);
      return mockDb.getOPDVisits();
    }
    return fetchApi<OPDVisit[]>("/opd/visits");
  },

  getVisitById: async (id: string): Promise<OPDVisit> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const visit = mockDb.getOPDVisitById(id);
      if (!visit) throw new Error("OPD visit not found");
      return visit;
    }
    return fetchApi<OPDVisit>(`/opd/visits/${id}`);
  },

  getActivityLogs: async (visitId: string): Promise<OPDActivityLog[]> => {
    if (USE_MOCK) {
      await delay(100);
      return mockDb.getOPDActivityLogs(visitId);
    }
    return fetchApi<OPDActivityLog[]>(`/opd/visits/${visitId}/activity`);
  },

  getMedicineCatalog: async (): Promise<MedicineCatalogItem[]> => {
    if (USE_MOCK) {
      await delay(120);
      return MOCK_MEDICINES;
    }
    return fetchApi<MedicineCatalogItem[]>("/opd/medicines");
  },

  getConsultationFeeByDoctor: async (doctorId: string): Promise<number> => {
    if (USE_MOCK) {
      await delay(100);
      return getConsultationFeeByDoctor(doctorId);
    }
    return fetchApi<number>(`/opd/consultation-fee?doctorId=${doctorId}`);
  },

  canStartConsultation,

  convertAppointmentToVisit: async (input: CreateVisitFromAppointmentInput): Promise<OPDVisit> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const existing = mockDb.getOPDVisitByAppointmentId(input.appointmentId);
      if (existing) return existing;

      const visit: OPDVisit = {
        id: makeId("opd"),
        tokenNo: input.tokenNo,
        patientId: input.patientId,
        patientName: input.patientName,
        doctorId: input.doctorId,
        doctorName: input.doctorName,
        appointmentId: input.appointmentId,
        source: "Appointment",
        status: "Billing Pending",
        priority: toOpdPriority(input.priority),
        visitDateTime: new Date().toISOString(),
        consultationFeeApplicable: false,
        prescriptions: [],
        billingStatus: "Pending",
        consultationFee: getConsultationFeeByDoctor(input.doctorId),
        finalAmount: getConsultationFeeByDoctor(input.doctorId),
        isEmergency: !!input.isEmergency || toOpdPriority(input.priority) === "Emergency",
        allowCredit: !!input.allowCredit,
      };
      if (canBypassBilling(visit)) {
        visit.status = "Waiting";
      }
      mockDb.addOPDVisit(visit);
      mockDb.addOPDLog({
        id: `opd-log-${Date.now()}`,
        visitId: visit.id,
        action: "Check-In",
        description: "Appointment converted to OPD visit",
        performedBy: "Receptionist",
        timestamp: new Date().toISOString(),
      });
      return visit;
    }

    return fetchApi<OPDVisit>("/opd/visits/convert", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  createWalkInVisit: async (input: CreateWalkInVisitInput): Promise<OPDVisit> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const tokenNo = `W-${100 + mockDb.getOPDVisits().length + 1}`;
      const visit: OPDVisit = {
        id: makeId("opd"),
        tokenNo,
        patientId: input.patientId,
        patientName: input.patientName,
        doctorId: input.doctorId,
        doctorName: input.doctorName,
        appointmentId: null,
        source: "Walk-in",
        status: "Billing Pending",
        priority: input.priority,
        visitDateTime: new Date().toISOString(),
        consultationFeeApplicable: false,
        prescriptions: [],
        billingStatus: "Pending",
        consultationFee: getConsultationFeeByDoctor(input.doctorId),
        finalAmount: getConsultationFeeByDoctor(input.doctorId),
        isEmergency: !!input.isEmergency || input.priority === "Emergency",
        allowCredit: !!input.allowCredit,
      };
      if (canBypassBilling(visit)) {
        visit.status = "Waiting";
      }
      mockDb.addOPDVisit(visit);
      mockDb.addOPDLog({
        id: `opd-log-${Date.now()}`,
        visitId: visit.id,
        action: "Check-In",
        description: "Direct walk-in OPD registration",
        performedBy: "Receptionist",
        timestamp: new Date().toISOString(),
      });
      return visit;
    }

    return fetchApi<OPDVisit>("/opd/visits", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateVisitStatus: async (id: string, nextStatus: OPDVisitStatus): Promise<OPDVisit> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const current = mockDb.getOPDVisitById(id);
      if (!current) throw new Error("Visit not found");

      if (!allowedTransitions[current.status].includes(nextStatus)) {
        throw new Error(`Invalid status transition: ${current.status} -> ${nextStatus}`);
      }
      if (nextStatus === "In Consultation" && !canStartConsultation(current)) {
        throw new Error("Complete billing before consultation");
      }

      const updated = mockDb.updateOPDVisit(id, {
        status: nextStatus,
        consultationFeeApplicable: nextStatus === "Completed",
        completedAt: nextStatus === "Completed" ? new Date().toISOString() : undefined,
      });
      if (!updated) throw new Error("Failed to update OPD visit");

      mockDb.addOPDLog(buildLog(id, nextStatus));
      return updated;
    }

    return fetchApi<OPDVisit>(`/opd/visits/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });
  },

  confirmBilling: async ({ visitId, discount = 0, paymentMode }: ConfirmBillingInput): Promise<OPDVisit> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const visit = mockDb.getOPDVisitById(visitId);
      if (!visit) throw new Error("Visit not found");

      const finalAmount = Math.max((visit.consultationFee || 0) - discount, 0);
      const nextStatus: OPDVisitStatus = "Waiting";
      const nextBillingStatus: OPDBillingStatus = "Paid";

      const updated = mockDb.updateOPDVisit(visitId, {
        discount,
        finalAmount,
        billingStatus: nextBillingStatus,
        paymentMode,
        paidAt: new Date().toISOString(),
        status: nextStatus,
      });
      if (!updated) throw new Error("Failed to update billing");

      mockDb.addOPDLog({
        id: `opd-log-${Date.now()}`,
        visitId,
        action: "Payment Completed",
        description: "Payment completed",
        performedBy: "Billing",
        timestamp: new Date().toISOString(),
      });
      return updated;
    }

    return fetchApi<OPDVisit>(`/opd/visits/${visitId}/billing`, {
      method: "PATCH",
      body: JSON.stringify({ discount, paymentMode }),
    });
  },

  updateConsultation: async (id: string, payload: UpdateConsultationInput): Promise<OPDVisit> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const updated = mockDb.updateOPDVisit(id, payload);
      if (!updated) throw new Error("Visit not found");
      return updated;
    }

    return fetchApi<OPDVisit>(`/opd/visits/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
