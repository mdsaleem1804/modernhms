"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Users, UserPlus, Calendar, Clock, ArrowRight, Activity, Plus } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { RecentPatientsTable } from "@/components/dashboard/RecentPatientsTable";
import { patientService, type Patient } from "@/services/api/patientService";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalPatients: number;
  todayRegistrations: number;
  pendingFollowups: number;
  activeAppointments: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, recentData] = await Promise.all([
          patientService.getDashboardStats(),
          patientService.getRecentPatients(6)
        ]);
        setStats(statsData);
        setRecentPatients(recentData);
      } catch (err) {
        console.error("Dashboard data load failed", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* ── Welcome Area ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-[10px] uppercase font-black tracking-widest border border-indigo-400/30">
              System Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome, Admin</h1>
          <p className="text-indigo-200 mt-2 text-sm font-medium max-w-md">
            Your hospital management overview is ready. You have <span className="text-white font-bold">{stats?.todayRegistrations || 0}</span> new registrations today.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link 
              href="/patients/add"
              className="bg-white text-indigo-900 px-6 py-2 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-indigo-50 transition-all active:scale-95 shadow-lg shadow-indigo-950/20"
            >
              <Plus className="w-4 h-4" />
              Register Patient
            </Link>
            <Link 
              href="/patients"
              className="bg-indigo-800/50 backdrop-blur-md text-white px-6 py-2 rounded-xl text-sm font-bold border border-indigo-700/50 hover:bg-indigo-700/50 transition-all"
            >
              Manage Patients
            </Link>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl" />
      </div>

      {/* ── Stats Section ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={Users}
          colorClassName="bg-blue-600"
          trend={{ value: 12, isUp: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="New Today"
          value={stats?.todayRegistrations || 0}
          icon={UserPlus}
          colorClassName="bg-indigo-600"
          trend={{ value: 5, isUp: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Follow-ups"
          value={stats?.pendingFollowups || 0}
          icon={Calendar}
          colorClassName="bg-amber-500"
          trend={{ value: 2, isUp: false }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Appointments"
          value={stats?.activeAppointments || 0}
          icon={Clock}
          colorClassName="bg-emerald-600"
          trend={{ value: 18, isUp: true }}
          isLoading={isLoading}
        />
      </div>

      {/* ── Main Dashboard Content ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Patients Activity */}
        <div className="lg:col-span-2 space-y-6">
          <RecentPatientsTable 
            patients={recentPatients} 
            isLoading={isLoading} 
          />
        </div>

        {/* Quick Actions / Shortcuts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Module Quick Access</h3>
            <div className="space-y-3 relative z-10">
              <QuickActionLink 
                 title="Pharmacy POS" 
                 icon={Activity} 
                 href="/pharmacy/sales" 
                 subtitle="Manage drugs and sales"
                 color="text-blue-600 bg-blue-50"
              />
              <QuickActionLink 
                 title="Consultation" 
                 icon={Activity} 
                 href="/consultation" 
                 subtitle="Doctor desk & notes"
                 color="text-indigo-600 bg-indigo-50"
              />
              <QuickActionLink 
                 title="Reports" 
                 icon={Activity} 
                 href="/reports" 
                 subtitle="Analytics & summaries"
                 color="text-emerald-600 bg-emerald-50"
              />
            </div>
            {/* Decal */}
            <div className="absolute bottom-0 right-0 opacity-5 rotate-45 transform translate-x-12 translate-y-12">
               <Activity className="w-48 h-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionLink({ 
  title, 
  icon: Icon, 
  href, 
  subtitle,
  color
}: { 
  title: string; 
  icon: any; 
  href: string; 
  subtitle: string;
  color: string;
}) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-black text-gray-900 leading-tight">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 ml-auto transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
