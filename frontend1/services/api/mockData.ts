import { Patient } from "./types";

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    uhid: "HMS-2026-000001",
    fullName: "Ramesh Kumar Sharma",
    gender: "male",
    dateOfBirth: "1985-05-15",
    age: "41",
    phone: "9876543210",
    patientType: "opd",
    visitType: "new",
    department: "general",
    registrationDate: "2026-01-10T09:00",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "2",
    uhid: "HMS-2026-000002",
    fullName: "Sunita Devi",
    gender: "female",
    dateOfBirth: "1992-09-22",
    age: "34",
    phone: "9123456780",
    patientType: "ipd",
    visitType: "followup",
    department: "gynaecology",
    registrationDate: "2026-02-15T11:30",
    createdAt: "2026-02-15T11:30:00.000Z",
  },
];

// In-memory mock store
let patients = [...MOCK_PATIENTS];

export const mockDb = {
  getAll: () => patients,
  getTotal: () => patients.length,
  getById: (id: string) => patients.find((p) => p.id === id),
  add: (patient: Patient) => {
    patients = [patient, ...patients];
    return patient;
  },
  update: (id: string, data: Partial<Patient>) => {
    patients = patients.map((p) => (p.id === id ? { ...p, ...data } : p));
    return patients.find((p) => p.id === id);
  },
};
