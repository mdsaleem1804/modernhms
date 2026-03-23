import { PrescriptionItem } from "@/services/api/types";

export type ConsultationValidationInput = {
  diagnosis: string;
  prescriptions: PrescriptionItem[];
};

export type ConsultationValidationResult = {
  valid: boolean;
  errors: {
    diagnosis?: string;
  };
  warnings: {
    prescriptions?: string;
  };
  topMessage?: string;
};

export function validateConsultationForCompletion(
  payload: ConsultationValidationInput
): ConsultationValidationResult {
  const diagnosis = payload.diagnosis.trim();
  const hasPrescription = payload.prescriptions.some((item) => item.medicineName.trim());

  const errors: ConsultationValidationResult["errors"] = {};
  const warnings: ConsultationValidationResult["warnings"] = {};

  if (!diagnosis) {
    errors.diagnosis = "Diagnosis is required to complete consultation.";
  }

  if (!hasPrescription) {
    warnings.prescriptions = "No prescription added. You can still complete this consultation.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
    topMessage:
      Object.keys(errors).length > 0
        ? "Please complete required fields before finishing consultation"
        : undefined,
  };
}
