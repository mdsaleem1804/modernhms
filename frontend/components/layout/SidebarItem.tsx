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
        "group flex items-center transition-all duration-200 cursor-pointer",
        isCollapsed ? "justify-center p-2.5 mx-auto" : "px-3 py-2.5 text-sm font-medium mx-2",
        isActive && !hasChildren
          ? "bg-indigo-50 text-indigo-700 shadow-sm rounded-xl"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl",
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
          isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
        )}
      />
      
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown className={cn("ml-2 w-4 h-4 transition-transform", isOpen && "rotate-180")} />
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
            <div className="bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2">
              {item.title}
              {item.badge && (
                <span className="bg-indigo-500 text-white text-[10px] px-1.5 rounded-full">{item.badge}</span>
              )}
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[4px] border-r-gray-900" />
            </div>
          ) : (
            <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 min-w-[220px] ml-1 overflow-hidden">
              <div className="pb-2 mb-2 border-b border-gray-50 px-3 pt-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.title}</p>
              </div>
              <div className="space-y-0.5">
                {item.children?.map((child) => (
                  <Link 
                    key={child.title} 
                    href={child.path!}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all",
                      pathname === child.path 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <child.icon className={cn("w-4 h-4", pathname === child.path ? "text-indigo-600" : "text-gray-400")} />
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
