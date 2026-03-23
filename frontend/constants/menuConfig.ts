import {
  LayoutDashboard, Search, UserPlus, Stethoscope, BedDouble, Scissors, 
  Pill, Microscope, Radio, Droplets, Ambulance, Wallet, FileBadge, 
  Users, Activity, Boxes, CalendarDays, BellRing, BarChart3, 
  FileStack, Settings
} from "lucide-react";

export type Role = "admin" | "doctor" | "reception" | "billing" | "pharmacy" | "lab";

export interface MenuItem {
  title: string;
  icon: any;
  path?: string;
  roles: Role[];
  badge?: number | string;
  children?: MenuItem[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const MENU_CONFIG: MenuSection[] = [
  {
    title: "MAIN MENU",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/", roles: ["admin", "doctor", "reception", "billing"] },
      { title: "Patient Enquiry", icon: Search, path: "/enquiry", roles: ["admin", "reception"] },
      { title: "Reception and Registration", icon: UserPlus, path: "/patients/add", roles: ["admin", "reception"] },
      { title: "Out Patient Department (OPD)", icon: Stethoscope, path: "/opd", roles: ["admin", "doctor", "reception"] },
      { title: "In Patient Department (IPD)", icon: BedDouble, path: "/ipd", roles: ["admin", "doctor", "reception"] },
      { title: "Operation Theatre (OT)", icon: Scissors, path: "/ot", roles: ["admin", "doctor"] },
      { title: "Pharmacy", icon: Pill, path: "/pharmacy", roles: ["admin", "pharmacy"] },
      { title: "Central Laboratory", icon: Microscope, path: "/lab", roles: ["admin", "lab"] },
      { title: "Radiology", icon: Radio, path: "/radiology", roles: ["admin", "lab"] },
      { title: "Blood Bank", icon: Droplets, path: "/blood-bank", roles: ["admin", "lab"] },
      { title: "Ambulance", icon: Ambulance, path: "/ambulance", roles: ["admin", "reception"] },
      { title: "Accounts and Finance", icon: Wallet, path: "/finance", roles: ["admin", "billing"] },
      { title: "Records and Certificates", icon: FileBadge, path: "/records", roles: ["admin", "reception"] },
      { title: "Human Resource Management (HR)", icon: Users, path: "/hr", roles: ["admin"] },
      { title: "Activity Log", icon: Activity, path: "/activity-log", roles: ["admin"] },
      { title: "Hospital Inventory Management", icon: Boxes, path: "/inventory", roles: ["admin"] },
      { title: "Programmes and Calendar", icon: CalendarDays, path: "/calendar", roles: ["admin", "reception"] },
      { title: "Messages and Notifications", icon: BellRing, path: "/messages", roles: ["admin", "doctor", "reception"] },
      { title: "Reports", icon: BarChart3, path: "/reports", roles: ["admin", "doctor"] },
      { title: "E-MRD", icon: FileStack, path: "/emrd", roles: ["admin", "doctor"] },
      { title: "Settings", icon: Settings, path: "/settings", roles: ["admin"] }
    ]
  }
];
