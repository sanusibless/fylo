import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  Users,
  HardDrive,
  CreditCard,
  Files,
  TrendingUp,
  Shield,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  metrics: {
    totalUsers: number;
    activeSubscribers: number;
    totalFiles: number;
    totalStorageGB: number;
    monthlyRevenue: number;
  };
  recentUsers: any[];
  recentPayments: any[];
  recentInquiries: any[];
}

export default function AdminDashboard({
  metrics,
  recentUsers,
  recentPayments,
  recentInquiries,
}: AdminDashboardProps) {
  const kpiCards = [
    {
      title: "Total Registered Users",
      value: metrics.totalUsers,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Paid Subscribers",
      value: metrics.activeSubscribers,
      icon: TrendingUp,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
    },
    {
      title: "Storage Consumed",
      value: `${metrics.totalStorageGB} GB`,
      icon: HardDrive,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Total Files Stored",
      value: metrics.totalFiles,
      icon: Files,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Monthly Revenue (MRR)",
      value: `$${metrics.monthlyRevenue.toFixed(2)}`,
      icon: CreditCard,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <DashboardLayout>
      <Head title="Admin Operations Console - Fylo" />

      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold mb-1">
              <Shield className="w-4 h-4" />
              <span>System Administrator Control Panel</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Platform Health &amp; Analytics</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/users"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/plans"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              Storage Plans
            </Link>
            <Link
              href="/admin/payments"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              Transactions
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiCards.map((kpi, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#202a3c] border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium">{kpi.title}</span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-white">{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Signups */}
          <div className="bg-[#202a3c] p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Recent User Signups</h3>
              <Link href="/admin/users" className="text-xs text-teal-400 hover:underline">
                View All Users
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-slate-800 text-gray-400">
                    <th className="pb-2">User</th>
                    <th className="pb-2">Plan</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5">
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-[11px] text-gray-400">{u.email}</div>
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded bg-teal-950/60 text-teal-300 text-[10px] font-semibold border border-teal-500/20">
                          {u.user_storage_plan?.storage_plan_detail?.name || "Free"}
                        </span>
                      </td>
                      <td className="py-2.5">
                        {u.is_admin ? (
                          <span className="text-amber-400 font-semibold text-[10px]">Admin</span>
                        ) : (
                          <span className="text-gray-400 text-[10px]">User</span>
                        )}
                      </td>
                      <td className="py-2.5 text-gray-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#202a3c] p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Recent Transactions</h3>
              <Link href="/admin/payments" className="text-xs text-teal-400 hover:underline">
                View All Payments
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-slate-800 text-gray-400">
                    <th className="pb-2">Reference</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 font-mono text-teal-300 text-[11px]">{p.reference}</td>
                        <td className="py-2.5 text-white">{p.user?.name || "User"}</td>
                        <td className="py-2.5 font-semibold text-white">
                          {p.currency} {Number(p.amount).toFixed(2)}
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contact Inquiries */}
        {recentInquiries.length > 0 && (
          <div className="bg-[#202a3c] p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-bold text-white">Latest Customer Inquiries</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-2xl bg-[#0b1523] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="font-semibold text-white text-xs">{inq.name}</h5>
                    <span className="text-[10px] text-gray-500">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-teal-300 font-medium truncate">{inq.subject}</div>
                  <p className="text-xs text-gray-400 line-clamp-2">{inq.message}</p>
                  <div className="pt-1 text-[11px] text-gray-500">{inq.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
