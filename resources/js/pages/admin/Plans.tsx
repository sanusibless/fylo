import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  CreditCard,
  Edit2,
  Check,
  ArrowLeft,
  Sparkles,
  HardDrive,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { type StoragePlanItem } from "@/types";

interface AdminPlansProps {
  plans: (StoragePlanItem & { user_storage_plans_count?: number })[];
}

export default function AdminPlans({ plans }: AdminPlansProps) {
  const [editingPlan, setEditingPlan] = useState<StoragePlanItem | null>(null);

  const { data, setData, put, processing } = useForm({
    name: "",
    capacity: "",
    price_monthly: 0,
    price_yearly: 0,
    max_file_size_mb: 50,
    is_active: true,
    is_popular: false,
  });

  const openEditModal = (plan: StoragePlanItem) => {
    setEditingPlan(plan);
    setData({
      name: plan.name,
      capacity: String(plan.capacity),
      price_monthly: Number(plan.price_monthly),
      price_yearly: Number(plan.price_yearly),
      max_file_size_mb: plan.max_file_size_mb || 50,
      is_active: plan.is_active ?? true,
      is_popular: plan.is_popular ?? false,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    put(`/admin/plans/${editingPlan.id}`, {
      onSuccess: () => setEditingPlan(null),
    });
  };

  return (
    <DashboardLayout>
      <Head title="Subscription Plans - Admin Console" />

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
            <h1 className="text-2xl font-bold text-white">Configured Storage Packages</h1>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-[#202a3c] rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg relative overflow-hidden"
            >
              {plan.is_popular && (
                <div className="absolute top-0 right-0 bg-teal-400 text-slate-950 text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl">
                  Popular
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {!plan.is_active && (
                    <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      Disabled
                    </span>
                  )}
                </div>

                <div className="text-2xl font-extrabold text-white mt-2">
                  ${Number(plan.price_monthly).toFixed(2)}
                  <span className="text-xs text-gray-400 font-normal"> /mo</span>
                </div>
                <div className="text-xs text-gray-400">
                  ${Number(plan.price_yearly).toFixed(2)} /year
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacity:</span>
                    <span className="font-semibold text-white">{plan.capacity} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Upload:</span>
                    <span className="font-semibold text-white">{plan.max_file_size_mb || 50} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subscribers:</span>
                    <span className="font-semibold text-teal-300">{plan.user_storage_plans_count ?? 0}</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => openEditModal(plan)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                <span>Configure Pricing &amp; Quota</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Plan Modal */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="bg-[#1c2431] border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Configure {editingPlan?.name} Plan</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4 pt-2 text-xs">
            <div>
              <Label className="text-gray-300">Plan Name</Label>
              <Input
                required
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="mt-1 bg-[#0b1523] border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300">Capacity (GB)</Label>
                <Input
                  required
                  value={data.capacity}
                  onChange={(e) => setData("capacity", e.target.value)}
                  className="mt-1 bg-[#0b1523] border-slate-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Max Upload (MB)</Label>
                <Input
                  type="number"
                  required
                  value={data.max_file_size_mb}
                  onChange={(e) => setData("max_file_size_mb", parseInt(e.target.value, 10))}
                  className="mt-1 bg-[#0b1523] border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300">Monthly Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={data.price_monthly}
                  onChange={(e) => setData("price_monthly", parseFloat(e.target.value))}
                  className="mt-1 bg-[#0b1523] border-slate-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Yearly Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={data.price_yearly}
                  onChange={(e) => setData("price_yearly", parseFloat(e.target.value))}
                  className="mt-1 bg-[#0b1523] border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={data.is_active}
                  onCheckedChange={(c) => setData("is_active", c === true)}
                  className="border-slate-600 data-[state=checked]:bg-teal-400 data-[state=checked]:text-slate-900"
                />
                <label htmlFor="active" className="text-xs text-gray-300">
                  Plan is Active
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="popular"
                  checked={data.is_popular}
                  onCheckedChange={(c) => setData("is_popular", c === true)}
                  className="border-slate-600 data-[state=checked]:bg-teal-400 data-[state=checked]:text-slate-900"
                />
                <label htmlFor="popular" className="text-xs text-gray-300">
                  Highlight as Popular
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPlan(null)}
                className="bg-slate-800 border-slate-700 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold"
              >
                {processing ? "Saving..." : "Save Settings"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
