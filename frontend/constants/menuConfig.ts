import { 
  LayoutDashboard, 
  Database,
  Users,
  Stethoscope,
  Building2,
  Bed,
  MapPin,
  IndianRupee,
  Percent,
  Store,
  FlaskConical,
  CalendarClock,
  UserPlus,
  Calendar,
  ListOrdered,
  ClipboardSignature,
  MonitorSmartphone,
  MessageSquare,
  FileText,
  UserCheck,
  BedDouble,
  HeartPulse,
  Wallet,
  Receipt,
  FileStack,
  CreditCard,
  ShieldCheck,
  Landmark,
  Tablets,
  ShoppingCart,
  PackagePlus,
  ClipboardList,
  Microscope,
  TestTube2,
  Radio,
  UserCog,
  Contact,
  HandCoins,
  CalendarRange,
  BarChart3,
  FileBarChart,
  TrendingUp,
  Settings2,
  History,
  ShieldAlert,
  Users2,
  Key,
  Sliders,
  Scissors
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
    title: "CORE",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
        roles: ["admin", "doctor", "reception", "billing"]
      }
    ]
  },
  {
    title: "HMS MASTER DATA",
    items: [
      {
        title: "Master Data",
        icon: Database,
        roles: ["admin"],
        children: [
          { title: "Patients", path: "/patients", icon: Users, roles: ["admin"] },
          { title: "Doctors & Staff", path: "/doctors", icon: Stethoscope, roles: ["admin"] },
          { title: "Departments & Services", path: "/master/departments", icon: Building2, roles: ["admin"] },
          { title: "Bed & Room", path: "/master/beds", icon: Bed, roles: ["admin"] },
          { title: "Locations", path: "/master/locations", icon: MapPin, roles: ["admin"] },
          { title: "Fees & Charges", path: "/master/fees", icon: IndianRupee, roles: ["admin"] },
          { title: "Tax & Discount", path: "/master/tax", icon: Percent, roles: ["admin"] },
          { title: "Pharmacy & Store", path: "/master/pharmacy", icon: Store, roles: ["admin"] },
          { title: "Lab & Radiology", path: "/master/lab", icon: FlaskConical, roles: ["admin"] },
        ]
      }
    ]
  },
  {
    title: "PATIENTS & APPOINTMENTS",
    items: [
      {
        title: "Registration",
        icon: UserPlus,
        path: "/patients/add",
        roles: ["admin", "reception"]
      },
      {
        title: "Appointments",
        icon: Calendar,
        path: "/appointments",
        roles: ["admin", "reception", "doctor"],
        badge: 12
      },
      {
        title: "Reception / Queue",
        icon: ListOrdered,
        path: "/reception",
        roles: ["admin", "reception"]
      }
    ]
  },
  {
    title: "CLINICAL",
    items: [
      {
        title: "Doctor Workbench",
        icon: MonitorSmartphone,
        path: "/clinical/workbench",
        roles: ["admin", "doctor"]
      },
      {
        title: "Consultation",
        icon: MessageSquare,
        path: "/clinical/consultation",
        roles: ["admin", "doctor"]
      },
      {
        title: "Clinical Records",
        icon: FileText,
        path: "/clinical/records",
        roles: ["admin", "doctor"]
      },
      {
        title: "Surgery & Procedures",
        icon: Scissors,
        path: "/clinical/surgery",
        roles: ["admin", "doctor"]
      }
    ]
  },
  {
    title: "ADMISSIONS & BEDS",
    items: [
      {
        title: "Admissions",
        icon: UserCheck,
        path: "/admissions",
        roles: ["admin", "reception", "doctor"]
      },
      {
        title: "Bed Management",
        icon: BedDouble,
        path: "/admissions/beds",
        roles: ["admin", "reception"]
      },
      {
        title: "Nursing Station",
        icon: HeartPulse,
        path: "/nursing",
        roles: ["admin", "doctor"]
      }
    ]
  },
  {
    title: "BILLING & FINANCE",
    items: [
      {
        title: "Billing",
        icon: Wallet,
        roles: ["admin", "billing"],
        children: [
          { title: "OPD Billing", path: "/billing/opd", icon: Receipt, roles: ["admin", "billing"] },
          { title: "IPD Billing", path: "/billing/ipd", icon: FileStack, roles: ["admin", "billing"] },
          { title: "Payments", path: "/billing/payments", icon: CreditCard, roles: ["admin", "billing"] },
          { title: "Insurance / TPA", path: "/billing/insurance", icon: ShieldCheck, roles: ["admin", "billing"] },
          { title: "Finance Masters", path: "/finance/masters", icon: Landmark, roles: ["admin", "billing"] },
        ]
      }
    ]
  },
  {
    title: "PHARMACY & INVENTORY",
    items: [
      {
        title: "Pharmacy",
        icon: Tablets,
        roles: ["admin", "pharmacy"],
        children: [
          { title: "Pharmacy POS", path: "/pharmacy/pos", icon: ShoppingCart, roles: ["admin"] },
          { title: "Purchase & Stock", path: "/pharmacy/stock", icon: PackagePlus, roles: ["admin"] },
          { title: "Inventory", path: "/pharmacy/inventory", icon: ClipboardList, roles: ["admin"] },
        ]
      }
    ]
  },
  {
    title: "LAB & RADIOLOGY",
    items: [
      {
        title: "Investigation",
        icon: Microscope,
        roles: ["admin", "lab"],
        children: [
          { title: "Lab Management", path: "/lab", icon: TestTube2, roles: ["admin"] },
          { title: "Radiology", path: "/radiology", icon: Radio, roles: ["admin"] },
        ]
      }
    ]
  },
  {
    title: "STAFF & HR",
    items: [
      {
        title: "HRM",
        icon: UserCog,
        roles: ["admin"],
        children: [
          { title: "Staff Master", path: "/hr/staff", icon: Contact, roles: ["admin"] },
          { title: "Attendance & Payroll", path: "/hr/payroll", icon: HandCoins, roles: ["admin"] },
          { title: "Duty Roster", path: "/hr/roster", icon: CalendarRange, roles: ["admin"] },
        ]
      }
    ]
  },
  {
    title: "ANALYTICS & REPORTS",
    items: [
      {
        title: "Reports",
        icon: BarChart3,
        roles: ["admin"],
        children: [
          { title: "Patient Reports", path: "/reports/patients", icon: FileBarChart, roles: ["admin"] },
          { title: "Financial Reports", path: "/reports/finance", icon: TrendingUp, roles: ["admin"] },
          { title: "Operational", path: "/reports/ops", icon: Settings2, roles: ["admin"] },
          { title: "Audit Logs", path: "/reports/audit", icon: History, roles: ["admin"] },
        ]
      }
    ]
  },
  {
    title: "SETTINGS",
    items: [
      {
        title: "Config",
        icon: ShieldAlert,
        roles: ["admin"],
        children: [
          { title: "User Management", path: "/settings/users", icon: Users2, roles: ["admin"] },
          { title: "Roles & Permissions", path: "/settings/roles", icon: Key, roles: ["admin"] },
          { title: "System Settings", path: "/settings/system", icon: Sliders, roles: ["admin"] },
        ]
      }
    ]
  }
];
