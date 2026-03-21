import { fetchApi } from "./index";

// ─── Patient Types ─────────────────────────────────────────────────────────

export interface PatientPayload {
  // Admin
  patientType: string;
  visitType: string;
  department: string;
  registrationDate: string;
  // Basic
  fullName: string;
  gender: string;
  dateOfBirth?: string;
  age?: string;
  // Contact
  phone: string;
  alternatePhone?: string;
  // ID
  idProofType?: string;
  idProofNumber?: string;
  // Address
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  // Personal
  bloodGroup?: string;
  maritalStatus?: string;
  occupation?: string;
  // Guardian
  guardianName?: string;
  guardianRelation?: string;
  // Referral
  referredBy?: string;
  // Emergency
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  // Medical
  allergies?: string;
  existingConditions?: string;
  notes?: string;
}

export interface Patient extends PatientPayload {
  id: string;
  uhid: string;
  createdAt: string;
}

// ─── API ───────────────────────────────────────────────────────────────────

/** Toggle to false once the backend /patients endpoint is live. */
const USE_MOCK = true;

export const patientsApi = {
  /**
   * Fetch all patients.
   */
  getPatients: async (): Promise<Patient[]> => {
    if (USE_MOCK) {
      await delay(400);
      return MOCK_PATIENTS;
    }
    return fetchApi<Patient[]>("/patients");
  },

  /**
   * Fetch a single patient by ID.
   */
  getPatientById: async (id: string): Promise<Patient> => {
    if (USE_MOCK) {
      await delay(300);
      const p = MOCK_PATIENTS.find((p) => p.id === id);
      if (!p) throw new Error("Patient not found");
      return p;
    }
    return fetchApi<Patient>(`/patients/${id}`);
  },

  /**
   * Register a new patient.
   * Resolves with the created patient object (incl. UHID assigned by server).
   */
  createPatient: async (data: PatientPayload): Promise<Patient> => {
    if (USE_MOCK) {
      await delay(800); // simulate network latency
      const newPatient: Patient = {
        ...data,
        id: String(Date.now()),
        uhid: `HMS-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
        createdAt: new Date().toISOString(),
      };
      return newPatient;
    }
    return fetchApi<Patient>("/patients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing patient.
   */
  updatePatient: async (id: string, data: Partial<PatientPayload>): Promise<Patient> => {
    if (USE_MOCK) {
      await delay(600);
      const existing = MOCK_PATIENTS.find((p) => p.id === id);
      if (!existing) throw new Error("Patient not found");
      return { ...existing, ...data };
    }
    return fetchApi<Patient>(`/patients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    uhid: "HMS-2026-00001",
    fullName: "Ramesh Kumar Sharma",
    gender: "male",
    dateOfBirth: "1985-05-15",
    phone: "9876543210",
    patientType: "opd",
    visitType: "new",
    department: "general",
    registrationDate: "2026-01-10T09:00",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "2",
    uhid: "HMS-2026-00002",
    fullName: "Sunita Devi",
    gender: "female",
    dateOfBirth: "1992-09-22",
    phone: "9123456780",
    patientType: "ipd",
    visitType: "followup",
    department: "gynaecology",
    registrationDate: "2026-02-15T11:30",
    createdAt: "2026-02-15T11:30:00.000Z",
  },
];
