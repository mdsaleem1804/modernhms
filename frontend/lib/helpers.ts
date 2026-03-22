/**
 * Generates a unique hospital ID in the format: HMS-YYYY-XXXXXX
 * @param lastId The sequential number to append (e.g., from total count)
 * @returns Formatted UHID string
 */
export function generateUHID(lastId: number): string {
  const year = new Date().getFullYear();
  const sequential = String(lastId + 1).padStart(6, "0");
  return `HMS-${year}-${sequential}`;
}

/**
 * Calculates age based on date of birth
 * @param dob Date string (YYYY-MM-DD)
 * @returns Age as a string
 */
export function calculateAge(dob: string): string {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 0 ? "0" : String(age);
}

/**
 * Validates Indian Mobile Number
 * - 10 digits
 * - Starts with 6, 7, 8, or 9
 */
export function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Validates Aadhaar Number
 * - 12 digits
 */
export function isValidAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar);
}
