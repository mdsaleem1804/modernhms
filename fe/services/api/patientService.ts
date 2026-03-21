import { fetchApi } from "./index";
import { mockDb } from "./mockData";
import { Patient, PatientPayload } from "./types";
import { generateUHID } from "@/lib/helpers";

export type { Patient, PatientPayload };

// ─── API Service ───────────────────────────────────────────────────────────

const USE_MOCK = true;
const DELAY = 600;

export const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    if (USE_MOCK) {
      await delay(DELAY);
      return mockDb.getAll();
    }
    return fetchApi<Patient[]>("/patients");
  },

  getPatientById: async (id: string): Promise<Patient> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const patient = mockDb.getById(id);
      if (!patient) throw new Error("Patient not found");
      return patient;
    }
    return fetchApi<Patient>(`/patients/${id}`);
  },

  createPatient: async (data: PatientPayload): Promise<Patient> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const total = mockDb.getTotal();
      const newPatient: Patient = {
        ...data,
        id: String(Date.now()),
        uhid: generateUHID(total),
        createdAt: new Date().toISOString(),
      };
      return mockDb.add(newPatient);
    }
    return fetchApi<Patient>("/patients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updatePatient: async (id: string, data: Partial<PatientPayload>): Promise<Patient> => {
    if (USE_MOCK) {
      await delay(DELAY);
      const updated = mockDb.update(id, data);
      if (!updated) throw new Error("Patient not found");
      return updated;
    }
    return fetchApi<Patient>(`/patients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  getDashboardStats: async () => {
    if (USE_MOCK) {
      await delay(DELAY);
      const all = mockDb.getAll();
      const today = new Date().toISOString().split("T")[0];
      const todayCount = all.filter((p) => p.registrationDate.startsWith(today)).length;
      
      return {
        totalPatients: all.length,
        todayRegistrations: todayCount,
        pendingFollowups: Math.floor(all.length * 0.4), // Simulated
        activeAppointments: 12, // Simulated
      };
    }
    return fetchApi<{ totalPatients: number; todayRegistrations: number; pendingFollowups: number; activeAppointments: number }>("/dashboard/stats");
  },

  getRecentPatients: async (limit = 5): Promise<Patient[]> => {
    if (USE_MOCK) {
      await delay(DELAY);
      return mockDb.getAll().slice(0, limit);
    }
    return fetchApi<Patient[]>(`/patients/recent?limit=${limit}`);
  },
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
