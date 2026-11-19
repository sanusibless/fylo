import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  CreditCard,
  HardDrive,
  Lock,
  ShieldCheck,
  AlertCircle,
  LoaderCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type StoragePlanItem,
  type PaymentGatewayOption,
  type CheckoutPricingBreakdown,
  type SharedData,
} from "@/types";

interface SubscriptionCheckoutProps {
  plan: StoragePlanItem;
  currentPlan: StoragePlanItem | null;
  billingCycle: "monthly" | "yearly";
  pricing: CheckoutPricingBreakdown;
  gateways: PaymentGatewayOption[];
  defaultGateway: string;
}

export default function SubscriptionCheckout({
  plan,
  currentPlan,
  billingCycle: initialCycle,
  pricing,
  gateways,
  defaultGateway,
}: SubscriptionCheckoutProps) {
  const { flash, auth } = usePage<SharedData>().props;
  const [cycle, setCycle] = useState<"monthly" | "yearly">(initialCycle);
  const [selectedGateway, setSelectedGateway] = useState<string>(defaultGateway || "moneta");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const monthlyPrice = Number(pricing.monthly_price);
  const yearlyPrice = Number(pricing.yearly_price);
  const subtotal = cycle === "yearly" ? monthlyPrice * 12 : monthlyPrice;
  const discountAmount = cycle === "yearly" ? subtotal - yearlyPrice : 0;
  const totalPayable = cycle === "yearly" ? yearlyPrice : monthlyPrice;

  const activeGatewayObj = gateways.find((g) => g.id === selectedGateway);

  const handleCycleChange = (newCycle: "monthly" | "yearly") => {
    setCycle(newCycle);
    router.get(
      "/subscription/checkout",
      { plan: plan.slug, cycle: newCycle },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setLocalError(null);
    setIsSubmitting(true);

    router.post(
      "/subscription/checkout",
      {
        plan_slug: plan.slug,
        billing_cycle: cycle,
        provider: selectedGateway,
      },
      {
        preserveScroll: true,
        onFinish: () => setIsSubmitting(false),
        onError: (errors) => {
          setIsSubmitting(false);
          const firstErr = Object.values(errors)[0];
          if (firstErr) setLocalError(String(firstErr));
        },
      }
    );
  };

  return (
    <DashboardLayout>
      <Head title={`Checkout: ${plan.name} Plan - Fylo`} />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Back Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <Link
              href="/subscription"
              className="inline-flex items-center text-xs font-semibold text-teal-400 hover:underline mb-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Subscription Packages
            </Link>
            <h1 className="text-2xl font-bold text-white">Complete Your Subscription</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Review your selected storage package, choose your billing cycle, and select a payment gateway.
            </p>
          </div>
        </div>

        {/* Error / Status Notifications */}
        {(flash?.error || localError) && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">Unable to complete checkout</p>
              <p>{flash?.error || localError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Package Details, Cycle Selection & Payment Gateways */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Selected Plan Summary Card */}
            <div className="bg-[#202a3c] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                      Selected Package
                    </span>
                    <h2 className="text-xl font-bold text-white">{plan.name} Storage Plan</h2>
                  </div>
                </div>
                <span className="text-xs font-bold text-teal-300 bg-teal-950/80 border border-teal-500/30 px-3 py-1 rounded-xl">
                  {plan.capacity} GB Allocation
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">{plan.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
                {(plan.features || []).slice(0, 6).map((feat, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-teal-400 mr-2 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Billing Cycle Selection */}
            <div className="bg-[#202a3c] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">1. Choose Billing Cycle</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Save 20% automatically when you choose annual billing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleCycleChange("monthly")}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    cycle === "monthly"
                      ? "bg-teal-500/15 border-2 border-teal-400 shadow-lg"
                      : "bg-[#0b1523]/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Monthly Billing</span>
                    {cycle === "monthly" && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    {formatCurrency(monthlyPrice)}
                    <span className="text-xs font-normal text-gray-400"> /month</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Billed monthly in NGN</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleCycleChange("yearly")}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                    cycle === "yearly"
                      ? "bg-teal-500/15 border-2 border-teal-400 shadow-lg"
                      : "bg-[#0b1523]/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Yearly Billing</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Save 20%
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    {formatCurrency(yearlyPrice)}
                    <span className="text-xs font-normal text-gray-400"> /year</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    You save {formatCurrency(monthlyPrice * 12 * 0.2)} per year
                  </p>
                </button>
              </div>
            </div>

            {/* 3. Payment Gateway Selection */}
            <div className="bg-[#202a3c] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">2. Select Payment Gateway</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Choose your preferred payment provider to complete your transaction in Nigerian Naira (₦).
                </p>
              </div>

              <div className="space-y-3">
                {gateways.map((gateway) => {
                  const isSelected = selectedGateway === gateway.id;
                  return (
                    <button
                      key={gateway.id}
                      type="button"
                      onClick={() => {
                        setSelectedGateway(gateway.id);
                        setLocalError(null);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left transition flex items-start justify-between gap-4 ${
                        isSelected
                          ? "bg-teal-500/15 border-2 border-teal-400 shadow-lg"
                          : "bg-[#0b1523]/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "bg-teal-400 text-slate-950" : "bg-slate-800 text-teal-400"
                          }`}
                        >
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-white">{gateway.name}</span>
                            {gateway.is_default && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                Default Gateway
                              </span>
                            )}
                            {!gateway.available && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                Integration Pending Configuration
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {gateway.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-teal-400 bg-teal-400 text-slate-950" : "border-slate-600"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedGateway === "moneta" && !activeGatewayObj?.available && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Moneta Collections Notice</p>
                    <p className="mt-0.5 text-gray-300">
                      Moneta collection credentials are not yet configured in this environment. You may select{" "}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway("paystack")}
                        className="text-teal-400 font-bold underline hover:text-teal-300"
                      >
                        Paystack
                      </button>{" "}
                      above to complete your payment immediately.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Payment Confirmation */}
          <div className="lg:col-span-5">
            <div className="bg-[#202a3c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  Order Summary
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Subscription Breakdown</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Merchant Account</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">
                    {auth?.user?.email}
                  </span>
                </div>

                {currentPlan && (
                  <div className="flex justify-between text-gray-300">
                    <span>Current Package</span>
                    <span className="text-gray-400">
                      {currentPlan.name} ({currentPlan.capacity} GB)
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-300">
                  <span>Selected Package</span>
                  <span className="font-bold text-white">{plan.name} Plan</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Storage Allocation</span>
                  <span className="font-bold text-teal-400">{plan.capacity} GB</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Billing Cycle</span>
                  <span className="font-semibold text-white capitalize">{cycle}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Payment Gateway</span>
                  <span className="font-semibold text-white capitalize">
                    {activeGatewayObj?.name || selectedGateway}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex justify-between text-gray-300">
                    <span>
                      Subtotal ({cycle === "yearly" ? "12 Months" : "1 Month"})
                    </span>
                    <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
                  </div>

                  {cycle === "yearly" && discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Yearly Discount (20% Off)</span>
                      <span className="font-mono font-semibold">
                        -{formatCurrency(discountAmount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Total Amount Payable</span>
                    <span className="text-[11px] text-gray-400">Billed in Nigerian Naira (NGN)</span>
                  </div>
                  <span className="text-2xl font-extrabold text-teal-400 font-mono">
                    {formatCurrency(totalPayable)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      <span>Initializing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay {formatCurrency(totalPayable)} with{" "}
                        {activeGatewayObj?.name || selectedGateway}
                      </span>
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Encrypted checkout • Instant storage quota activation upon verification</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
