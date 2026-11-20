import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  Users as UsersIcon,
  Search,
  Shield,
  ShieldAlert,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type User,
  type StoragePlanItem,
  type PaginatedData,
} from "@/types";

interface AdminUsersProps {
  users: PaginatedData<User>;
  plans: StoragePlanItem[];
  filters: { search?: string };
}

export default function AdminUsers({ users, plans, filters }: AdminUsersProps) {
  const [search, setSearch] = useState(filters.search || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get("/admin/users", { search }, { preserveState: true });
  };

  const handleToggleAdmin = (user: User) => {
    if (confirm(`Toggle administrator access for ${user.name}?`)) {
      router.post(`/admin/users/${user.id}/toggle-admin`);
    }
  };

  const handleChangePlan = (user: User, planId: string) => {
    router.post(`/admin/users/${user.id}/plan`, { plan_id: planId });
  };

  return (
    <DashboardLayout>
      <Head title="User Management - Admin Console" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-teal-400 font-semibold mb-1">
              <Link href="/admin" className="hover:underline flex items-center">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Admin Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white">Registered Users ({users.total})</h1>
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#202a3c] border-slate-800 text-white text-xs w-64"
              />
            </div>
            <Button type="submit" size="sm" className="bg-teal-400 text-slate-950 font-bold text-xs">
              Search
            </Button>
          </form>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#202a3c]">
          <table className="w-full text-left text-xs text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#1c2431]">
                <th className="py-3.5 px-4 font-semibold text-white">Name &amp; Contact</th>
                <th className="py-3.5 px-4 font-semibold text-white">Subscription Plan</th>
                <th className="py-3.5 px-4 font-semibold text-white">Admin Status</th>
                <th className="py-3.5 px-4 font-semibold text-white">Joined Date</th>
                <th className="py-3.5 px-4 font-semibold text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.data.map((user) => {
                const currentPlanId = user.user_storage_plan?.storage_plan_id || plans[0]?.id;
                return (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">{user.name}</div>
                      <div className="text-gray-400 text-xs">{user.email}</div>
                      {user.phone && <div className="text-gray-500 text-[11px]">{user.phone}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={currentPlanId}
                        onChange={(e) => handleChangePlan(user, e.target.value)}
                        className="bg-[#0b1523] border border-slate-700 text-teal-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-400"
                      >
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.capacity} GB)
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      {user.is_admin ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Shield className="w-3 h-3" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Regular User</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 font-mono">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAdmin(user)}
                        className="text-xs text-gray-300 hover:text-white"
                      >
                        {user.is_admin ? "Demote from Admin" : "Make Admin"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.links && users.links.length > 3 && (
          <div className="flex justify-center space-x-1 pt-4">
            {users.links.map((link, idx) => (
              <Link
                key={idx}
                href={link.url || "#"}
                dangerouslySetInnerHTML={{ __html: link.label }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  link.active
                    ? "bg-teal-400 text-slate-950"
                    : link.url
                    ? "bg-[#202a3c] text-gray-300 hover:bg-slate-800"
                    : "text-gray-600 cursor-not-allowed"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
