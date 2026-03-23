# ModernHMS - Hospital Management Information System (HMIS)

## Overview
ModernHMS is a comprehensive, modern Hospital Management Information System (HMIS) currently customized and styled for **Lakshmi Hospitals**. It is built to optimize and digitalize clinical workflows, reception activities, and administrative processes with an emphasis on a high-density, high-performance user interface.

## Technology Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Premium, dense UI styling)
- **Icons:** Lucide React
- **Data/State:** React local state & hooks (currently wired to a robust simulated backend via `mockData.ts`)

---

## Capabilities & Implemented Features

### 1. Global Navigation & Application Layout
- **Top Navigation Bar (TopNav):**
  - Custom *Lakshmi Hospitals* branding.
  - Two distinct, color-indicated global search inputs for **Patient Search** and **Doctor Search**.
  - Quick utility action ribbon including: Language toggle, Calendar, Calculator, Pending Tasks (with alert badge), and Notifications (with alert badge).
  - Clean user profile display (Avatar, Name, Role).
- **Responsive Sidebar (Side Rows):**
  - Fully collapsible sidebar utilizing a clean, bright, light-themed aesthetic.
  - Flat, accessible list of 21 core modules covering all hospital departments: *Dashboard, Patient Enquiry, Reception and Registration, OPD, IPD, Operation Theatre (OT), Pharmacy, Central Laboratory, Radiology, Blood Bank, Ambulance, Accounts and Finance, Records and Certificates, HR, Activity Log, Inventory, Programmes/Calendar, Messages, Reports, E-MRD, and Settings.*
  - Route-active states and hover transitions for smooth UX.

### 2. Patient Registration Module
- **High-Density, Premium UI Form:** Modeled after top-tier enterprise software (e.g., Zoho Inventory UI) to remove excessive whitespace and allow receptionists to enter data efficiently.
- **Smart Tabs System:**
  - **Patient Identity:** Basic demographic data, complete with a synchronization engine between the "Date of Birth" and "Age" fields.
  - **Occupying Person Details:** Captures information for accompanying/occupying individuals (Name, Contact Number, Relationship to Patient, ID Proof Type, and ID proof Number).
  - **Mode of Arrival:** A massive, detailed tracking tab to source patient acquisition. Contains smart checkboxes and conditionally enabled input fields for Referrals (Doctors/Relatives), Online Ads (Search Engines, Social Media), and Offline Ads (Transport, Public Places, Signages, Mass Media, Gatherings).
- **Intelligent Workflows:**
  - **Duplicate Detection Engine:** Real-time (debounced) checks that warn receptionists if a patient with the same mobile number already exists, preventing duplicate records.
  - **Automatic UHID Generation:** System to mock the generation of Unique Hospital IDs.
  - Strict Input Validation (Indian 10-digit mobile numbers, proper Aadhaar formats, etc.).
- **Controlled Components:** Explicit handling of `checked` and `value` states to prevent React hydration and controlled/uncontrolled warnings.

### 3. Patient Details Page
- Comprehensive profile view of individual patients.
- Embedded breadcrumb navigation for spatial awareness.
- A "Visit History" overview rendering past patient encounters.
- Quick action buttons (e.g., "Edit Patient", "Start Consultation") to instantly pivot to clinical workflows.

### 4. Appointments & Consultation Architecture
- **Strict Status Lifecycle:** Built a state machine for appointments ensuring logical transitions (e.g., `Booked` → `Checked-In` → `In Consultation` → `Completed`). Explicit prevention of invalid jumps (like `Booked` directly to `Completed`).
- **Contextual Action Buttons:** The UI intelligently renders only the actions permissible by the current status (e.g., displaying "Check-In" only for booked appointments).
- **Visual Queue System:** Appointment tables feature color-coded status badges and priority tags (e.g., Highlighting "Emergency" or "Routine Follow-up").

### 5. OPD Consultation Module
- **Appointment to OPD Conversion:** On Check-In, appointment records are converted into OPD visits with dedicated visit IDs and activity logs.
- **Direct Walk-In OPD Registration:** Reception can create OPD visits without appointment linkage (`appointmentId = null`).
- **OPD Queue (`/opd`):** Doctor/status/date filters, queue actions (`Start Consultation`, `Complete`), and periodic polling for real-time queue feel.
- **OPD Queue UI (Zoho-style Refinement):**
  - Reduced visual noise with compact row height and tighter spacing.
  - Status remains the only colored badge; payment and priority are plain compact text indicators.
  - Single primary action per row (`Pay Now` / `Start` / `View`) plus compact overflow menu for secondary actions.
  - Token display simplified (e.g., `T-102` to `#102`) for faster scanning.
  - Inline compact filters (Doctor, Status, Date) and aligned utility header (title/date left, actions right).
  - Row actions emphasize on hover while preserving keyboard/mouse accessibility.
- **Consultation Workspace (`/opd/[visitId]`):**
  - Sticky patient summary header (name, age, gender, UHID, token).
  - Dense consultation form (vitals, symptoms, diagnosis, prescriptions, notes, follow-up).
  - Prescription rows with medicine autocomplete, dosage autofill, frequency, and food timing controls.
  - Strict status transitions: `Waiting` → `In Consultation` → `Completed`.
  - Billing hook on completion: `consultationFeeApplicable = true`.
- **Keyboard-First Workflow:**
  - `Enter`: Next field
  - `Shift + Enter`: Previous field
  - `Ctrl + S`: Save consultation (browser save prevented)
  - `Ctrl + Enter`: Complete consultation
  - `Alt + N`: Add prescription row and focus medicine field
- **Completion Validation:**
  - Mandatory diagnosis before completion.
  - Inline field error + top alert if required fields are missing.
  - Prescription recommendation warning (non-blocking).
- **Enhanced Activity Logs:**
  - Tracks check-in, payment completion, consultation start, and completion with timestamps.
  - UI renders timeline entries in `HH:mm AM/PM` style for quick audit.
- **Billing Gate Before Consultation:**
  - Lifecycle is enforced as `Booked` → `Checked-In` → `Billing Pending` → `Waiting` → `In Consultation` → `Completed`.
  - Queue shows payment status (`Unpaid` / `Paid`) and blocks consultation start until billing is done.
  - Added `OPDBillingModal` for payment confirmation (fee, discount, final amount, payment mode).
  - On payment confirmation, visit updates to `billingStatus=Paid`, `status=Waiting`, and logs `Payment completed`.
  - Supports edge cases: free consultation (`fee=0`), emergency bypass, and credit override flags.
- **Smart Defaults & Persistence:**
  - Direct OPD registration auto-selects last used doctor and defaults priority to `Normal`.
  - Consultation pre-fills follow-up date to `today + 7 days` and uses guided vitals placeholders.
  - Last-used OPD preferences (doctor/frequency/food timing) are persisted in local storage.

---

## Directory Structure Highlights
*   `app/` - Next.js App Router pages and hierarchical layouts.
*   `components/layout/` - Global shell components (`Sidebar.tsx`, `SidebarItem.tsx`, `TopNav.tsx`).
*   `components/opd/` - OPD-specific UI (`OPDQueueTable.tsx`, `OPDBillingModal.tsx`, `StickyPatientHeader.tsx`, `OPDActivityLog.tsx`).
*   `components/ui/` - Shared UI controls including reusable autocomplete input.
*   `modules/core/components/` - Core domain UI components (like the massive `PatientForm.tsx` module).
*   `hooks/` - Shared workflow hooks (`useEnterToNext.ts`, `useKeyboardShortcuts.ts`).
*   `lib/` - Utilities/helpers including consultation validation, timestamp formatting, and user preference persistence.
*   `services/api/` - API-ready service layer (`appointmentService.ts`, `opdService.ts`, patient services), type definitions (`types.ts`), and mocked backend store (`mockData.ts`, including medicine catalog and doctor consultation fee mocks).
*   `constants/` - Configuration settings, like the `menuConfig.ts` that powers the localized navigation arrays.

## Next Steps / Pending Implementation
1.  **API Integration:** Replacing the `mockData` fetches with real Axios/Fetch calls to the backend infrastructure.
2.  **Form Validation Polish:** Finalizing strict validation bindings (using Zod or similar) over the newly added 'Mode of Arrival' and 'Occupying Person' schemas before API dispatch.
3.  **Authentication Context:** Hooking up the static "Admin User" TopNav indicator to real JWT/Session session data.

---
*Generated: March 2026*
