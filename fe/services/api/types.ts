export interface PatientPayload {
  patientType: string;
  visitType: string;
  department: string;
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
}

export interface Patient extends PatientPayload {
  id: string;
  uhid: string;
  createdAt: string;
}
