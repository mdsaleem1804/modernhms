export interface PatientPayload {
  registrationDate: string;
  fullName: string;
  gender: string;
  dateOfBirth?: string;
  age?: string;
  phone: string;
  alternatePhone?: string;
  idProofType?: string;
  idProofNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  occupation?: string;
  guardianName?: string;
  guardianRelation?: string;
  referredBy?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  existingConditions?: string;
  notes?: string;
  occupyingPersonName?: string;
  occupyingPersonPhone?: string;
  occupyingPersonRelation?: string;
  occupyingPersonIdProofType?: string;
  occupyingPersonIdProofNumber?: string;
  modeOfArrival?: ModeOfArrival;
}

export interface ModeOfArrival {
  drName?: string;
  drDepartment?: string;
  drHospital?: string;
  patientReferral?: string;
  patientReferralOther?: string;
  searchEngine?: string[];
  searchEngineOther?: string;
  socialMedia?: string[];
  socialMediaOther?: string;
  transportAds?: string[];
  transportAdsOther?: string;
  publicPlacesAds?: string[];
  publicPlacesAdsOther?: string;
  signages?: string[];
  signagesOther?: string;
  massMedia?: string[];
  massMediaOther?: string;
  gatherings?: string[];
  gatheringsOther?: string;
}

export interface Visit {
  id: string;
  date: string;
  complaint: string;
  doctor: string;
  type: "OPD" | "IPD";
}

export interface Patient extends PatientPayload {
  id: string;
  uhid: string;
  createdAt: string;
  visitHistory?: Visit[];
}

export type AppointmentStatus = "Booked" | "Checked-In" | "In Consultation" | "Completed" | "Cancelled";
export type AppointmentPriority = "Normal" | "Urgent" | "Emergency";
export type VisitType = "New Consultation" | "Follow-up" | "IPD Consultation";
export type ShiftType = "Morning" | "Evening";

export interface ActivityLog {
  id: string;
  appointmentId: string;
  action: "Created" | "Edited" | "Checked-In" | "Consultation Started" | "Completed" | "Cancelled";
  description: string;
  performedBy: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  tokenNo: string;
  time: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  visitType: VisitType;
  appointmentType: "Scheduled" | "Walk-in";
  shift: ShiftType;
  paymentType: "Cash" | "Insurance" | "Corporate";
  sop?: string[];
  date: string;
  remarks?: string;
  previousVisitId?: string;
  activityLogs?: ActivityLog[];
}
