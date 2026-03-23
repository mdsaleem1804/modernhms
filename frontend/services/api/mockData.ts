import { Patient, Appointment, ActivityLog, OPDVisit, OPDActivityLog } from "./types";

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    uhid: "HMS-2026-000001",
    fullName: "Ramesh Kumar Sharma",
    gender: "male",
    dateOfBirth: "1985-05-15",
    age: "41",
    phone: "9876543210",
    registrationDate: "2026-01-10T09:00",
    createdAt: "2026-01-10T09:00:00.000Z",
    visitHistory: [
      { id: "v1", date: "2026-01-10", complaint: "Severe Fever & Cough", doctor: "Dr. Sandeep Aggarwal", type: "OPD" },
      { id: "v2", date: "2026-02-05", complaint: "Follow-up for Fever", doctor: "Dr. Sandeep Aggarwal", type: "OPD" },
      { id: "v3", date: "2026-03-12", complaint: "Chest Pain", doctor: "Dr. Vinay Malhotra", type: "IPD" },
    ]
  },
  {
    id: "2",
    uhid: "HMS-2026-000002",
    fullName: "Sunita Devi",
    gender: "female",
    dateOfBirth: "1992-09-22",
    age: "34",
    phone: "9123456780",
    registrationDate: "2026-02-15T11:30",
    createdAt: "2026-02-15T11:30:00.000Z",
    visitHistory: [
      { id: "v4", date: "2026-02-15", complaint: "Routine Checkup", doctor: "Dr. Ananya Singh", type: "OPD" },
      { id: "v5", date: "2026-03-01", complaint: "Gynaecology consultation", doctor: "Dr. Ananya Singh", type: "IPD" },
    ]
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "a1", tokenNo: "T-101", time: "09:30 AM", patientId: "1", patientName: "Ramesh Kumar Sharma", doctorId: "d1", doctorName: "Dr. Sandeep Aggarwal", department: "General Medicine", status: "Booked", priority: "Normal", visitType: "New Consultation", appointmentType: "Scheduled", shift: "Morning", paymentType: "Cash", date: new Date().toISOString().split("T")[0] },
  { id: "a2", tokenNo: "T-102", time: "10:00 AM", patientId: "2", patientName: "Sunita Devi", doctorId: "d2", doctorName: "Dr. Ananya Singh", department: "Gynaecology", status: "Checked-In", priority: "Normal", visitType: "Follow-up", appointmentType: "Scheduled", shift: "Morning", paymentType: "Insurance", date: new Date().toISOString().split("T")[0] },
  { id: "a3", tokenNo: "T-103", time: "10:30 AM", patientId: "3", patientName: "Rahul Verma", doctorId: "d1", doctorName: "Dr. Sandeep Aggarwal", department: "General Medicine", status: "Completed", priority: "Normal", visitType: "New Consultation", appointmentType: "Scheduled", shift: "Morning", paymentType: "Cash", date: new Date().toISOString().split("T")[0] },
  { id: "a4", tokenNo: "T-104", time: "11:00 AM", patientId: "1", patientName: "Ramesh Kumar Sharma", doctorId: "d3", doctorName: "Dr. Vinay Malhotra", department: "Cardiology", status: "Cancelled", priority: "Urgent", visitType: "New Consultation", appointmentType: "Scheduled", shift: "Morning", paymentType: "Corporate", date: new Date().toISOString().split("T")[0], remarks: "Patient cancelled due to emergency" },
  { id: "a5", tokenNo: "T-105", time: "11:30 AM", patientId: "4", patientName: "Priya Das", doctorId: "d2", doctorName: "Dr. Ananya Singh", department: "Gynaecology", status: "Booked", priority: "Emergency", visitType: "IPD Consultation", appointmentType: "Walk-in", shift: "Morning", paymentType: "Cash", date: new Date().toISOString().split("T")[0] },
  { id: "a6", tokenNo: "T-106", time: "12:00 PM", patientId: "5", patientName: "Amit Singh", doctorId: "d1", doctorName: "Dr. Sandeep Aggarwal", department: "General Medicine", status: "Booked", priority: "Normal", visitType: "New Consultation", appointmentType: "Scheduled", shift: "Morning", paymentType: "Cash", date: new Date().toISOString().split("T")[0] },
  { id: "a7", tokenNo: "T-107", time: "02:00 PM", patientId: "2", patientName: "Sunita Devi", doctorId: "d4", doctorName: "Dr. Megha Rao", department: "Dermatology", status: "Booked", priority: "Normal", visitType: "Follow-up", appointmentType: "Scheduled", shift: "Evening", paymentType: "Cash", date: new Date().toISOString().split("T")[0] },
  { id: "a8", tokenNo: "T-108", time: "02:30 PM", patientId: "6", patientName: "Siddharth Malhotra", doctorId: "d3", doctorName: "Dr. Vinay Malhotra", department: "Cardiology", status: "Checked-In", priority: "Urgent", visitType: "New Consultation", appointmentType: "Scheduled", shift: "Evening", paymentType: "Insurance", date: new Date().toISOString().split("T")[0] },
  { id: "a9", tokenNo: "T-109", time: "03:00 PM", patientId: "7", patientName: "Sneha Kapoor", doctorId: "d1", doctorName: "Dr. Sandeep Aggarwal", department: "General Medicine", status: "Completed", priority: "Normal", visitType: "New Consultation", appointmentType: "Scheduled", shift: "Evening", paymentType: "Cash", date: new Date().toISOString().split("T")[0] },
  { id: "a10", tokenNo: "T-110", time: "04:00 PM", patientId: "8", patientName: "Vikram Gupta", doctorId: "d4", doctorName: "Dr. Megha Rao", department: "Dermatology", status: "Booked", priority: "Normal", visitType: "New Consultation", appointmentType: "Walk-in", shift: "Evening", paymentType: "Cash", date: new Date().toISOString().split("T")[0] },
];

export const MOCK_DOCTORS = [
  { id: "d1", name: "Dr. Sandeep Aggarwal", department: "General Medicine" },
  { id: "d2", name: "Dr. Ananya Singh", department: "Gynaecology" },
  { id: "d3", name: "Dr. Vinay Malhotra", department: "Cardiology" },
  { id: "d4", name: "Dr. Megha Rao", department: "Dermatology" },
];

export const MOCK_DEPARTMENTS = [
  "General Medicine", "Gynaecology", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Ophthalmology"
];

export const MOCK_SOP = [
  "Fever Protocol", "Diabetes Check", "General Consultation", "Hypertension Screening", "Post-Op Followup", "Pre-Surgery Clearance"
];

export const MOCK_MEDICINES = [
  { id: "m1", name: "Paracetamol 650", standardDosage: "650 mg", frequency: "1-0-1", foodTiming: "After Food" as const },
  { id: "m2", name: "Azithromycin 500", standardDosage: "500 mg", frequency: "1-0-0", foodTiming: "After Food" as const },
  { id: "m3", name: "Pantoprazole 40", standardDosage: "40 mg", frequency: "1-0-0", foodTiming: "Before Food" as const },
  { id: "m4", name: "Cetirizine 10", standardDosage: "10 mg", frequency: "0-0-1", foodTiming: "After Food" as const },
  { id: "m5", name: "Amoxicillin 500", standardDosage: "500 mg", frequency: "1-1-1", foodTiming: "After Food" as const },
];

export const MOCK_DOCTOR_CONSULTATION_FEES: Record<string, number> = {
  d1: 500,
  d2: 700,
  d3: 900,
  d4: 600,
};

// In-memory mock store
let patients = [...MOCK_PATIENTS];
let appointments = [...MOCK_APPOINTMENTS];
let allActivityLogs: ActivityLog[] = [];
let opdVisits: OPDVisit[] = [];
let opdActivityLogs: OPDActivityLog[] = [];

// Seed logs
appointments.forEach(a => {
  allActivityLogs.push({
    id: `log-${a.id}-1`,
    appointmentId: a.id,
    action: "Created",
    description: "Appointment created via portal",
    performedBy: "Admin",
    timestamp: new Date().toISOString()
  });
});

appointments
  .filter((a) => a.status === "Checked-In" || a.status === "In Consultation" || a.status === "Completed")
  .forEach((appointment, index) => {
    const visitStatus =
      appointment.status === "Checked-In"
        ? "Billing Pending"
        : appointment.status === "In Consultation"
          ? "In Consultation"
          : "Completed";

    const visit: OPDVisit = {
      id: `opd-seed-${appointment.id}`,
      tokenNo: appointment.tokenNo,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      appointmentId: appointment.id,
      source: "Appointment",
      status: visitStatus,
      priority: appointment.priority === "Emergency" ? "Emergency" : "Normal",
      visitDateTime: `${appointment.date}T09:00:00.000Z`,
      consultationFeeApplicable: visitStatus === "Completed",
      prescriptions: [],
      billingStatus: visitStatus === "Completed" || visitStatus === "In Consultation" ? "Paid" : "Pending",
      consultationFee: MOCK_DOCTOR_CONSULTATION_FEES[appointment.doctorId] ?? 500,
      finalAmount: MOCK_DOCTOR_CONSULTATION_FEES[appointment.doctorId] ?? 500,
      paidAt: visitStatus === "Completed" || visitStatus === "In Consultation" ? new Date().toISOString() : undefined,
      paymentMode: visitStatus === "Completed" || visitStatus === "In Consultation" ? "Cash" : undefined,
      isEmergency: appointment.priority === "Emergency",
      allowCredit: false,
    };

    opdVisits.push(visit);
    opdActivityLogs.unshift({
      id: `opd-log-seed-${index + 1}`,
      visitId: visit.id,
      action: "Check-In",
      description: "Appointment converted to OPD visit",
      performedBy: "Receptionist",
      timestamp: new Date().toISOString(),
    });

    if (visit.status === "In Consultation" || visit.status === "Completed") {
      opdActivityLogs.unshift({
        id: `opd-log-seed-start-${index + 1}`,
        visitId: visit.id,
        action: "Consultation Started",
        description: "Doctor started consultation",
        performedBy: "Doctor",
        timestamp: new Date().toISOString(),
      });
    }

    if (visit.status === "Completed") {
      opdActivityLogs.unshift({
        id: `opd-log-seed-complete-${index + 1}`,
        visitId: visit.id,
        action: "Consultation Completed",
        description: "Consultation marked as completed",
        performedBy: "Doctor",
        timestamp: new Date().toISOString(),
      });
    }
  });

export const mockDb = {
  getAppointments: () => appointments,
  getActivityLogs: (appId: string) => allActivityLogs.filter(l => l.appointmentId === appId),
  addLog: (log: ActivityLog) => {
    allActivityLogs = [log, ...allActivityLogs];
    return log;
  },
  addAppointment: (app: Appointment) => {
    appointments = [app, ...appointments];
    return app;
  },
  updateAppointment: (id: string, data: Partial<Appointment>) => {
    appointments = appointments.map(a => a.id === id ? { ...a, ...data } : a);
    return appointments.find(a => a.id === id);
  },
  getOPDVisits: () => opdVisits,
  getOPDVisitById: (id: string) => opdVisits.find((visit) => visit.id === id),
  getOPDVisitByAppointmentId: (appointmentId: string) =>
    opdVisits.find((visit) => visit.appointmentId === appointmentId),
  addOPDVisit: (visit: OPDVisit) => {
    opdVisits = [visit, ...opdVisits];
    return visit;
  },
  updateOPDVisit: (id: string, data: Partial<OPDVisit>) => {
    opdVisits = opdVisits.map((visit) => (visit.id === id ? { ...visit, ...data } : visit));
    return opdVisits.find((visit) => visit.id === id);
  },
  getOPDActivityLogs: (visitId: string) => opdActivityLogs.filter((log) => log.visitId === visitId),
  addOPDLog: (log: OPDActivityLog) => {
    opdActivityLogs = [log, ...opdActivityLogs];
    return log;
  },
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
