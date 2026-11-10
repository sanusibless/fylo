import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  CreditCard,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type PaymentItem, type PaginatedData } from "@/types";

interface AdminPaymentsProps {
  payments: PaginatedData<PaymentItem>;
  filters: { search?: string; status?: string };
}

export default function AdminPayments({ payments, filters }: AdminPaymentsProps) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      "/admin/payments",
      { search: search || undefined, status: status || undefined },
      { preserveState: true }
    );
  };

  return (
    <DashboardLayout>
      <Head title="Payment Transactions - Admin Console" />

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
            <h1 className="text-2xl font-bold text-white">Payment Transactions ({payments.total})</h1>
          </div>

          <form onSubmit={handleFilter} className="flex items-center space-x-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#202a3c] border border-slate-800 text-white text-xs rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search reference or user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#202a3c] border-slate-800 text-white text-xs w-56"
              />
            </div>

            <Button type="submit" size="sm" className="bg-teal-400 text-slate-950 font-bold text-xs">
              Filter
            </Button>
          </form>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#202a3c]">
          <table className="w-full text-left text-xs text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#1c2431]">
                <th className="py-3.5 px-4 font-semibold text-white">Reference</th>
                <th className="py-3.5 px-4 font-semibold text-white">Customer</th>
                <th className="py-3.5 px-4 font-semibold text-white">Plan</th>
                <th className="py-3.5 px-4 font-semibold text-white">Amount</th>
                <th className="py-3.5 px-4 font-semibold text-white">Billing Cycle</th>
                <th className="py-3.5 px-4 font-semibold text-white">Gateway</th>
                <th className="py-3.5 px-4 font-semibold text-white">Status</th>
                <th className="py-3.5 px-4 font-semibold text-white">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No transactions match the filter criteria.
                  </td>
                </tr>
              ) : (
                payments.data.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-mono text-teal-300">{p.reference}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{p.user?.name || "Anonymous"}</div>
                      <div className="text-[11px] text-gray-400">{p.user?.email || "N/A"}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{p.plan?.name || "Storage Plan"}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.currency} {Number(p.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 capitalize">{p.billing_cycle}</td>
                    <td className="py-3.5 px-4 capitalize">{p.provider}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          p.status === "successful"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : p.status === "pending"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {p.status === "successful" && <CheckCircle2 className="w-3 h-3 mr-0.5" />}
                        {p.status === "pending" && <Clock className="w-3 h-3 mr-0.5" />}
                        {p.status === "failed" && <XCircle className="w-3 h-3 mr-0.5" />}
                        <span>{p.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 font-mono">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {payments.links && payments.links.length > 3 && (
          <div className="flex justify-center space-x-1 pt-4">
            {payments.links.map((link, idx) => (
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
