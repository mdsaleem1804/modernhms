"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModules } from "@/context/ModuleContext";
import {
  Users,
  Stethoscope,
  Calendar,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Activity,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    module: "core",
    label: "Core",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Patients", href: "/patients", icon: Users },
      { name: "Doctors", href: "/doctors", icon: Stethoscope },
      { name: "Appointments", href: "/appointments", icon: Calendar },
    ],
  },
  {
    module: "pharmacy",
    label: "Pharmacy",
    items: [
      { name: "Sales", href: "/pharmacy/sales", icon: ShoppingCart },
      { name: "Inventory", href: "/pharmacy/inventory", icon: Package },
    ],
  },
  {
    module: "billing",
    label: "Billing",
    items: [
      { name: "Invoices", href: "/billing/invoices", icon: CreditCard },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { isModuleEnabled } = useModules();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className={cn(
          "h-16 flex items-center border-b border-gray-200 px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
            <Activity className="w-8 h-8 flex-shrink-0" />
            {!isCollapsed && <span>ModernHMS</span>}
          </Link>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={onToggle} 
              className="hidden lg:flex p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="lg:hidden p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {NAV_ITEMS.filter((group) => isModuleEnabled(group.module as any)).map((group) => (
            <div key={group.module}>
              {!isCollapsed && (
                <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.name : undefined}
                      className={cn(
                        "group flex items-center rounded-md transition-all duration-200",
                        isCollapsed ? "justify-center p-2" : "px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "flex-shrink-0 h-5 w-5 transition-colors",
                          !isCollapsed && "mr-3",
                          isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                        )}
                        aria-hidden="true"
                      />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={cn(
          "p-3 border-t border-gray-200 bg-gray-50/50",
          isCollapsed ? "flex justify-center" : ""
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              AD
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                <p className="text-[10px] text-gray-500 truncate uppercase tracking-tighter">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
