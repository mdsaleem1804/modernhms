"use client";

import { MenuSection, Role } from "@/constants/menuConfig";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";

interface SidebarGroupProps {
  section: MenuSection;
  isCollapsed: boolean;
  userRole: Role;
}

export function SidebarGroup({ section, isCollapsed, userRole }: SidebarGroupProps) {
  // Filter items based on availability for the role
  const visibleItems = section.items.filter(item => 
    item.roles.includes(userRole) || (item.children && item.children.some(child => child.roles.includes(userRole)))
  );

  if (visibleItems.length === 0) return null;

  return (
    <div className="py-2 space-y-1">
      {!isCollapsed && (
        <h3 className="px-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4 flex items-center gap-2">
          {section.title}
          <div className="h-[1px] flex-1 bg-slate-800" />
        </h3>
      )}
      <div className="space-y-1">
        {visibleItems.map((item) => (
          <SidebarItem 
            key={item.title} 
            item={item} 
            isCollapsed={isCollapsed} 
            userRole={userRole} 
          />
        ))}
      </div>
    </div>
  );
}
