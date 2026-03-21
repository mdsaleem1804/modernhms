# 🏥 Hospital Management System (HMS) – Base Development Workflow

This document defines the standard approach used to build modules (Patient, Doctor, Appointment, etc.) in a scalable and API-ready way.

---

# 1. 🧱 Project Architecture

## Frontend

* Next.js (App Router)
* Tailwind CSS
* Modular folder structure

## Backend (Planned)

* PHP API
* MySQL Database

---

# 2. 🧩 Core Design Principles

* Build **UI first**, validate with users (doctors/staff)
* Keep **modules independent**
* Use **service layer abstraction**
* Support both **mock data + real API**
* Focus on **speed and usability**

---

# 3. 📁 Folder Structure (Frontend)

```
/app
  /patients
    /add
    /edit/[id]
    /view/[id]
    page.tsx

/components
  /layout
  /ui
  /forms

/modules
  /patient

/services
  /api
    patientService.ts

/data
  mockPatients.ts
```

---

# 4. 🧠 Development Workflow (Step-by-Step)

## STEP 1: Layout Setup

* Sidebar (collapsible)
* Top Navbar
* Responsive layout

---

## STEP 2: Form Design (UI First)

### Key Concepts:

* Quick Registration (Required)
* Additional Details (Optional)

### Required Fields:

* Name
* Gender
* Mobile
* Patient Type

### UX Rules:

* Minimal scrolling
* Compact layout
* Keyboard-friendly

---

## STEP 3: UX Optimization

* Auto focus on first field
* Enter key navigation
* Auto age calculation (DOB → Age)
* Default values (OPD, New Visit)
* Validation (only required fields)

---

## STEP 4: Feedback System

* Success Toast:

  * "Patient registered successfully"
* Error Toast:

  * "Failed to register patient"
* Do NOT clear form on error

---

## STEP 5: List Page

Features:

* Table view
* Search (name/mobile)
* Add button
* Actions (View / Edit)
* Loading + Empty state

---

## STEP 6: Service Layer (IMPORTANT)

Create abstraction:

```
UI → patientService → (mock OR API)
```

### Functions:

* getPatients()
* getPatientById(id)
* createPatient(data)
* updatePatient(id, data)

### Toggle:

```
const USE_MOCK = true;
```

---

## STEP 7: View Page

* Read-only patient details
* Clean layout
* Edit button

---

## STEP 8: Edit Page

* Reuse Patient Form
* Pre-fill data
* Update via service

---

## STEP 9: Mock Data Strategy

* Store in /data/mockPatients.ts
* Simulate real API behavior
* Ensure updates reflect immediately

---

## STEP 10: UI/UX Standards

* Full-width layout (no empty sides)
* Compact spacing
* Section-based grouping
* Collapsible optional sections
* Professional hospital look

---

# 5. ⚠️ Important Rules

* Do NOT connect UI directly to mock data
* Always use service layer
* Do NOT block user with unnecessary validation
* Do NOT lose data on error
* Keep forms fast (10–15 sec entry)

---

# 6. 🔄 Reusability (VERY IMPORTANT)

This workflow applies to:

* Patient Module ✅
* Doctor Module 🔜
* Appointment Module 🔜
* Pharmacy Module 🔜

---

# 7. 🚀 Next Phase

* Connect to PHP API
* Implement UHID generation
* Add authentication
* Add role-based access

---

# ✅ Summary

We have built:

✔ Layout (Sidebar + Navbar)
✔ Patient Registration Form (UI + UX optimized)
✔ Toast + Error Handling
✔ Patient List Page
✔ View Patient
✔ Edit Patient
✔ API-ready Service Layer

This forms the **foundation of the HMS system**.
