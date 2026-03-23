"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MenuItem, Role } from "@/constants/menuConfig";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  userRole: Role;
  depth?: number;
}

export function SidebarItem({ item, isCollapsed, userRole, depth = 0 }: SidebarItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path ? pathname === item.path : item.children?.some(child => child.path === pathname);
  
  // Auto-expand if child is active
  useEffect(() => {
    if (isActive && hasChildren) {
      setIsOpen(true);
    }
  }, [isActive, hasChildren]);

  // Calculate position for fixed tooltips/popovers
  const handleMouseEnter = () => {
    if (isCollapsed && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setPosition({ top: rect.top });
      setIsTooltipVisible(true);
    }
  };

  if (!item.roles.includes(userRole)) return null;

  const Icon = item.icon;

  const content = (
    <div
      ref={itemRef}
      className={cn(
        "group flex items-center transition-all duration-200 cursor-pointer mx-2 rounded-lg",
        isCollapsed ? "justify-center p-2.5" : "px-3 py-2 text-sm font-medium",
        isActive && !hasChildren
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
          : "text-slate-400 hover:bg-slate-800 hover:text-white",
        depth > 0 && !isCollapsed && "pl-10"
      )}
      onClick={() => hasChildren && !isCollapsed && setIsOpen(!isOpen)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => isCollapsed && setIsTooltipVisible(false)}
    >
      <Icon
        className={cn(
          "flex-shrink-0 h-5 w-5 transition-colors",
          !isCollapsed && "mr-3",
          isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
        )}
      />
      
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <span className="ml-2 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-500/30">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown className={cn("ml-2 w-4 h-4 transition-transform text-slate-500", isOpen && "rotate-180")} />
          )}
        </>
      )}

      {/* Tooltip/Popover for collapsed state */}
      {isCollapsed && isTooltipVisible && (
        <div 
          className="fixed left-[72px] z-[100] animate-in fade-in slide-in-from-left-2 duration-200"
          style={{ top: position.top }}
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        >
          {!hasChildren ? (
            <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-2xl border border-slate-700 whitespace-nowrap flex items-center gap-2">
              {item.title}
              {item.badge && (
                <span className="bg-blue-500 text-white text-[10px] px-1.5 rounded-full">{item.badge}</span>
              )}
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[4px] border-r-slate-800" />
            </div>
          ) : (
            <div className="bg-[#1a1f2e] border border-slate-800 shadow-2xl rounded-xl p-2 min-w-[200px] ml-1 overflow-hidden">
              <div className="pb-2 mb-2 border-b border-slate-800 px-3 pt-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.title}</p>
              </div>
              <div className="space-y-0.5">
                {item.children?.map((child) => (
                  <Link 
                    key={child.title} 
                    href={child.path!}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                      pathname === child.path 
                        ? "bg-blue-600 text-white" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <child.icon className={cn("w-4 h-4", pathname === child.path ? "text-white" : "text-slate-500")} />
                    <span>{child.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col">
      {!hasChildren && item.path ? (
        <Link href={item.path}>{content}</Link>
      ) : (
        content
      )}

      {/* Accordion for expanded state */}
      {!isCollapsed && hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <SidebarItem 
              key={child.title} 
              item={child} 
              isCollapsed={isCollapsed} 
              userRole={userRole} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
