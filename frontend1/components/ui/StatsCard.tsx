import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  colorClassName?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorClassName = "bg-indigo-600",
  isLoading = false,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div className="w-16 h-4 bg-gray-50 rounded" />
        </div>
        <div className="w-24 h-8 bg-gray-100 rounded mb-2" />
        <div className="w-32 h-3 bg-gray-50 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110", colorClassName)}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1",
            trend.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            <span>{trend.isUp ? "+" : "-"}{trend.value}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-2 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
}
