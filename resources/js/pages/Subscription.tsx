import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { formatCurrency, formatStorageGB } from "@/lib/utils";
import {
  Check,
  ShieldCheck,
  HardDrive,
  Calendar,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  payments,
  storageUsage,
}: SubscriptionProps) {
  const { flash } = usePage<SharedData>().props;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    (storageUsage.billingCycle as "monthly" | "yearly") || "monthly"
  );
  const [navigatingPlanId, setNavigatingPlanId] = useState<number | null>(null);
  const [verifyingRef, setVerifyingRef] = useState<string | null>(null);

  const totalUsed = Number(storageUsage.totalUsed || 0);
  const totalAvailable = Number(storageUsage.totalAvailable || 5);
  const progressPercent =
    totalAvailable > 0 ? Math.min(100, Math.round((totalUsed / totalAvailable) * 100)) : 0;

  const handleSelectPlan = (plan: StoragePlanItem) => {
    setNavigatingPlanId(plan.id);
    const planSlug = plan.slug || plan.name.toLowerCase();

    router.get(
      "/subscription/checkout",
      {
        plan: planSlug,
        cycle: billingCycle,
      },
      {
        onFinish: () => setNavigatingPlanId(null),
      }
    );
  };

  const handleVerifyPayment = (reference: string) => {
    setVerifyingRef(reference);
    router.post(
      `/subscription/verify/${reference}`,
      {},
      {
        preserveScroll: true,
        onFinish: () => setVerifyingRef(null),
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
      <Head title="Subscription & Storage Packages (₦) - Fylo" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Subscription &amp; Storage Packages</h1>
            <p className="text-xs text-gray-400 mt-1">
              Select a storage package and billing cycle to upgrade your cloud storage allocation.
            </p>
          </div>
        </div>

        {/* Flash Notifications */}
        {(flash?.success || flash?.status) && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{flash.success || flash.status}</span>
          </div>
        )}

        {flash?.error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{flash.error}</span>
          </div>
        )}

        {/* Current Plan & Storage Summary Card */}
        <div className="bg-[#202a3c] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                      Current Subscription
                    </span>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-2xl font-bold text-white">
                        {currentPlan?.name || "Free"} Plan
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                {currentPlan?.description ||
                  "Essential cloud storage with folder organization and sharing capabilities."}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    Renewal / Expiry:{" "}
                    <strong className="text-white">
                      {storageUsage.expiresAt || "Permanent (Free Tier)"}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span>
                    Billing Cycle:{" "}
                    <strong className="text-white capitalize">
                      {storageUsage.billingCycle || "Monthly"}
                    </strong>
                  </span>
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

            {/* Storage Allocation Meter */}
            <div className="lg:col-span-5 bg-[#0b1523]/70 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-300">
                <span className="flex items-center font-semibold">
                  <HardDrive className="w-4 h-4 mr-1.5 text-teal-400" />
                  Storage Allocation
                </span>
                <span className="font-mono text-white font-bold">
                  {formatStorageGB(totalUsed, storageUsage.totalUsedBytes)} /{" "}
                  {totalAvailable >= 9999 ? "Unlimited" : `${totalAvailable} GB`} ({progressPercent}%)
                </span>
              </div>

              <div className="w-full bg-[#1c2431] rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Max upload size: {storageUsage.maxFileSizeMB || 50} MB / file</span>
                <span>Currency: NGN (₦)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Available Subscription Plans Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Available Storage Packages</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Choose monthly billing or save 20% with an annual subscription.
              </p>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="inline-flex items-center bg-[#202a3c] p-1.5 rounded-full border border-slate-800">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>Yearly Billing</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {plans.map((plan) => {
              const monthlyPrice = Number(plan.price_monthly);
              const yearlyPrice = Number(plan.price_yearly);
              const yearlySavings =
                plan.yearly_savings !== undefined
                  ? Number(plan.yearly_savings)
                  : Math.round(monthlyPrice * 12 * 0.2);

              const activePrice = billingCycle === "monthly" ? monthlyPrice : yearlyPrice;
              const priceFormatted = formatCurrency(activePrice);
              const period =
                activePrice === 0 ? "forever" : billingCycle === "monthly" ? "/month" : "/year";

              const isCurrentPlan = currentPlan?.id === plan.id;
              const isSameCycle =
                (storageUsage.billingCycle || "monthly") === billingCycle || monthlyPrice === 0;
              const isCurrentPlanAndCycle = isCurrentPlan && isSameCycle;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 flex flex-col justify-between transition relative ${
                    plan.is_popular
                      ? "bg-[#202a3c] border-2 border-teal-400 shadow-xl"
                      : "bg-[#202a3c]/80 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 text-[10px] font-extrabold uppercase px-3.5 py-0.5 rounded-full shadow">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                        {isCurrentPlan && (
                          <span className="inline-block text-[10px] font-semibold text-emerald-400">
                            Current Package
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-teal-400 bg-teal-950/60 border border-teal-500/30 px-2.5 py-1 rounded-lg">
                        {plan.capacity} GB
                      </span>
                    </div>

                    {/* Primary Selected Cycle Price */}
                    <div className="mt-3 mb-2">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-extrabold text-white">{priceFormatted}</span>
                        <span className="text-xs text-gray-400 ml-1">{period}</span>
                      </div>

                      {/* Secondary Price Reference & Yearly Savings Badge */}
                      {monthlyPrice > 0 ? (
                        <div className="mt-1.5 space-y-1">
                          {billingCycle === "monthly" ? (
                            <p className="text-[11px] text-gray-400">
                              Or{" "}
                              <strong className="text-teal-300">
                                {formatCurrency(yearlyPrice)}/year
                              </strong>{" "}
                              (Save {formatCurrency(yearlySavings)})
                            </p>
                          ) : (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] text-gray-400 line-through">
                                {formatCurrency(monthlyPrice * 12)}/yr
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Save {formatCurrency(yearlySavings)} (20% Off)
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-400 mt-1.5">
                          Free starter storage allocation
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 my-4 min-h-[34px] leading-relaxed">
                      {plan.description}
                    </p>

                    <ul className="space-y-2.5 mb-6 text-xs text-gray-300 border-t border-slate-800/80 pt-4">
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
                    disabled={(isCurrentPlanAndCycle && monthlyPrice === 0) || navigatingPlanId === plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                      isCurrentPlanAndCycle && monthlyPrice === 0
                        ? "bg-slate-800 text-gray-400 border border-slate-700 cursor-not-allowed"
                        : plan.is_popular
                        ? "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 shadow-md"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    <span>
                      {navigatingPlanId === plan.id
                        ? "Loading Checkout..."
                        : isCurrentPlanAndCycle && monthlyPrice === 0
                        ? "Current Free Plan"
                        : isCurrentPlanAndCycle
                        ? `Renew ${plan.name}`
                        : isCurrentPlan
                        ? `Switch to ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`
                        : monthlyPrice === 0
                        ? "Downgrade to Free"
                        : `Upgrade to ${plan.name}`}
                    </span>
                    {!(isCurrentPlanAndCycle && monthlyPrice === 0) && (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment History Invoices Table */}
        <div className="pt-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white">Payment &amp; Billing History</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Review all subscription payment transactions recorded on your account in Nigerian Naira (₦).
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#202a3c]">
            <table className="w-full text-left text-xs text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#1c2431]">
                  <th className="py-3.5 px-4 font-semibold text-white">Reference</th>
                  <th className="py-3.5 px-4 font-semibold text-white">Package</th>
                  <th className="py-3.5 px-4 font-semibold text-white">Billing Cycle</th>
                  <th className="py-3.5 px-4 font-semibold text-white">Amount (₦)</th>
                  <th className="py-3.5 px-4 font-semibold text-white">Gateway</th>
                  <th className="py-3.5 px-4 font-semibold text-white">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-white">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-white text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No billing transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono text-teal-300">{p.reference}</td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        {p.plan?.name || "Subscription"}
                      </td>
                      <td className="py-3.5 px-4 capitalize">{p.billing_cycle}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-3.5 px-4 capitalize">{p.provider}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            p.status === "successful"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : p.status === "pending"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {p.status === "successful" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {p.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {p.status !== "successful" && p.status !== "pending" && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          <span>{p.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 font-mono">
                        {new Date(p.paid_at || p.created_at).toLocaleDateString("en-NG")}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === "pending" && p.provider === "paystack" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={verifyingRef === p.reference}
                            onClick={() => handleVerifyPayment(p.reference)}
                            className="h-7 px-2.5 text-[11px] bg-slate-800 border-slate-700 text-teal-300 hover:text-white"
                          >
                            <RefreshCw
                              className={`w-3 h-3 mr-1 ${
                                verifyingRef === p.reference ? "animate-spin" : ""
                              }`}
                            />
                            {verifyingRef === p.reference ? "Checking..." : "Verify Status"}
                          </Button>
                        )}
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
