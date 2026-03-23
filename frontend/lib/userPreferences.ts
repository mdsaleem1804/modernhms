const KEYS = {
  lastOpdDoctorId: "opd:lastDoctorId",
  lastPrescriptionFrequency: "opd:lastFrequency",
  lastPrescriptionFoodTiming: "opd:lastFoodTiming",
} as const;

function getValue(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function setValue(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export const userPreferences = {
  getLastOpdDoctorId: () => getValue(KEYS.lastOpdDoctorId),
  setLastOpdDoctorId: (doctorId: string) => setValue(KEYS.lastOpdDoctorId, doctorId),
  getLastPrescriptionFrequency: () => getValue(KEYS.lastPrescriptionFrequency),
  setLastPrescriptionFrequency: (value: string) => setValue(KEYS.lastPrescriptionFrequency, value),
  getLastPrescriptionFoodTiming: () => getValue(KEYS.lastPrescriptionFoodTiming),
  setLastPrescriptionFoodTiming: (value: "Before Food" | "After Food") => setValue(KEYS.lastPrescriptionFoodTiming, value),
};
