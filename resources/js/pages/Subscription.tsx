import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
  CreditCard,
  Check,
  ShieldCheck,
  HardDrive,
  Calendar,
  Zap,
  ArrowRight,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  type StoragePlanItem,
  type PaymentItem,
  type StorageUsage,
  type SharedData,
} from "@/types";

interface SubscriptionProps {
  plans: StoragePlanItem[];
  currentPlan: StoragePlanItem | null;
  currentSubscription?: any;
  payments: PaymentItem[];
  storageUsage: StorageUsage & {
    expiresAt?: string;
    billingCycle?: string;
    autoRenew?: boolean;
  };
}

export default function Subscription({
  plans,
  currentPlan,
  currentSubscription,
  payments,
  storageUsage,
}: SubscriptionProps) {
  const { flash } = usePage<SharedData>().props;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    (storageUsage.billingCycle as "monthly" | "yearly") || "monthly"
  );
  const [selectedGateway, setSelectedGateway] = useState<"sandbox" | "paystack" | "flutterwave">("sandbox");
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  const totalUsed = Number(storageUsage.totalUsed || 0);
  const totalAvailable = Number(storageUsage.totalAvailable || 10);
  const progressPercent = totalAvailable > 0 ? Math.min(100, Math.round((totalUsed / totalAvailable) * 100)) : 0;

  const handleUpgrade = (plan: StoragePlanItem) => {
    setLoadingPlanId(plan.id);
    router.post(
      "/subscription/checkout",
      {
        plan_slug: plan.slug || plan.name.toLowerCase(),
        billing_cycle: billingCycle,
        provider: selectedGateway,
      },
      {
        onFinish: () => setLoadingPlanId(null),
      }
    );
  };

  const handleCancelAutoRenew = () => {
    if (confirm("Are you sure you want to disable automatic renewal for your subscription?")) {
      router.post("/subscription/cancel");
    }
  };

  return (
    <DashboardLayout>
      <Head title="Subscription & Billing - Fylo" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Subscription &amp; Storage Quota</h1>
            <p className="text-xs text-gray-400 mt-1">
              Manage your cloud storage allocation, subscription tier, and invoices.
            </p>
          </div>
        </div>

        {/* Flash Notifications */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{flash.success}</span>
          </div>
        )}

        {/* Current Plan & Storage Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Plan Info */}
          <div className="lg:col-span-2 bg-[#202a3c] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                      Active Tier
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      {currentPlan?.name || "Free"} Plan
                    </h2>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Active
                </span>
              </div>

              <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                {currentPlan?.description || "Essential storage with standard file sharing capabilities."}
              </p>

              {/* Progress Usage Meter */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="flex items-center">
                    <HardDrive className="w-3.5 h-3.5 mr-1 text-teal-400" />
                    Storage Consumed
                  </span>
                  <span className="font-mono text-white">
                    {totalUsed.toFixed(2)} GB / {totalAvailable >= 9999 ? "Unlimited" : `${totalAvailable} GB`} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#0b1523] rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Renewal / Expiry: {storageUsage.expiresAt || "Permanent (No Expiration)"}</span>
              </div>

              {storageUsage.autoRenew && (
                <button
                  type="button"
                  onClick={handleCancelAutoRenew}
                  className="text-gray-400 hover:text-rose-400 underline text-xs transition"
                >
                  Turn off Auto-Renew
                </button>
              )}
            </div>
          </div>

          {/* Payment Gateway Selector */}
          <div className="bg-[#202a3c] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                Billing Channel
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">Preferred Gateway</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Select your payment processor. Nigerian users can pay seamlessly in NGN via Paystack or Flutterwave.
              </p>

              <div className="space-y-2.5">
                {[
                  { id: "sandbox", name: "Instant Sandbox Simulation", note: "Immediate test checkout" },
                  { id: "paystack", name: "Paystack (Cards / Bank Transfer / USSD)", note: "NGN & USD accepted" },
                  { id: "flutterwave", name: "Flutterwave (Cards & Mobile Money)", note: "Pan-African & Global" },
                ].map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setSelectedGateway(gw.id as any)}
                    className={`w-full p-3 rounded-xl border text-left transition text-xs flex flex-col ${
                      selectedGateway === gw.id
                        ? "bg-teal-500/15 border-teal-400 text-teal-300 font-semibold"
                        : "bg-[#0b1523]/60 border-slate-800 text-gray-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-white font-medium">{gw.name}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{gw.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade / Change Plan Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Upgrade or Switch Plan</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Choose the capacity that best matches your organization.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-[#202a3c] p-1 rounded-full border border-slate-800">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => {
              const isCurrent = currentPlan?.id === plan.id;
              const price = billingCycle === "monthly" ? `$${plan.price_monthly}` : `$${plan.price_yearly}`;
              const period = billingCycle === "monthly" ? "/mo" : "/yr";

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition relative ${
                    plan.is_popular
                      ? "bg-[#202a3c] border-2 border-teal-400 shadow-xl"
                      : "bg-[#202a3c]/70 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                      <span className="text-[11px] font-semibold text-teal-400 bg-teal-950/60 border border-teal-500/30 px-2 py-0.5 rounded">
                        {plan.capacity} GB
                      </span>
                    </div>

                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-extrabold text-white">{price}</span>
                      <span className="text-xs text-gray-400 ml-1">{period}</span>
                    </div>

                    <p className="text-xs text-gray-400 mb-5 min-h-[30px] leading-relaxed">
                      {plan.description}
                    </p>

                    <ul className="space-y-2.5 mb-6 text-xs text-gray-300">
                      {(plan.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <Check className="w-3.5 h-3.5 text-teal-400 mr-2 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    type="button"
                    disabled={isCurrent || loadingPlanId === plan.id}
                    onClick={() => handleUpgrade(plan)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                      isCurrent
                        ? "bg-slate-800 text-gray-400 border border-slate-700 cursor-not-allowed"
                        : plan.is_popular
                        ? "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    {isCurrent ? "Current Plan" : loadingPlanId === plan.id ? "Processing..." : `Select ${plan.name}`}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment History Invoices Table */}
        <div className="pt-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white">Payment &amp; Invoice History</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Review all completed and processed transactions for your account.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#202a3c]">
            <table className="w-full text-left text-xs text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#1c2431]">
                  <th className="py-3 px-4 font-semibold text-white">Reference</th>
                  <th className="py-3 px-4 font-semibold text-white">Plan</th>
                  <th className="py-3 px-4 font-semibold text-white">Amount</th>
                  <th className="py-3 px-4 font-semibold text-white">Billing Cycle</th>
                  <th className="py-3 px-4 font-semibold text-white">Gateway</th>
                  <th className="py-3 px-4 font-semibold text-white">Status</th>
                  <th className="py-3 px-4 font-semibold text-white">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No billing transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono text-teal-300">{p.reference}</td>
                      <td className="py-3 px-4 font-medium text-white">{p.plan?.name || "Subscription"}</td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {p.currency} {Number(p.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 capitalize">{p.billing_cycle}</td>
                      <td className="py-3 px-4 capitalize">{p.provider}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            p.status === "successful"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : p.status === "pending"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 font-mono">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
