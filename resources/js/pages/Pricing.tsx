import { useState } from "react";
import HomeLayout from "@/layouts/home/layout";
import { Link } from "@inertiajs/react";
import { formatCurrency } from "@/lib/utils";
import { type StoragePlanItem } from "@/types";
import { Check, ArrowRight, Sparkles } from "lucide-react";

interface PricingProps {
  plans?: StoragePlanItem[];
}

export default function Pricing({ plans = [] }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const comparisonRows = [
    { feature: "Storage Capacity", free: "5 GB", starter: "50 GB", growth: "100 GB", business: "250 GB" },
    { feature: "Monthly Price", free: "₦0", starter: "₦15,000", growth: "₦20,000", business: "₦30,000" },
    { feature: "Yearly Price (20% Discount)", free: "₦0", starter: "₦144,000", growth: "₦192,000", business: "₦288,000" },
    { feature: "Max Single File Upload", free: "50 MB", starter: "250 MB", growth: "1,024 MB (1 GB)", business: "2,048 MB (2 GB)" },
    { feature: "Unlimited Nested Folders", free: true, starter: true, growth: true, business: true },
    { feature: "Direct User-to-User Sharing", free: true, starter: true, growth: true, business: true },
    { feature: "Tokenized Public Share Links", free: true, starter: true, growth: true, business: true },
    { feature: "Password & Expiring Share Links", free: true, starter: true, growth: true, business: true },
    { feature: "In-Browser File Previews", free: true, starter: true, growth: true, business: true },
    { feature: "Recycle Bin File Recovery", free: true, starter: true, growth: true, business: true },
    { feature: "Activity & Download History", free: true, starter: true, growth: true, business: true },
    { feature: "Support Response Priority", free: "Standard Email", starter: "Business Hours", growth: "Priority Abuja Support", business: "Dedicated Account Support" },
  ];

  return (
    <HomeLayout title="Pricing & Storage Plans (₦) — Fylo Abuja">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Billing in Nigerian Naira (₦)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Choose the Right Storage Plan for Your Needs
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Start free with 5 GB and upgrade anytime as your document and media storage requirements grow. Save 20% with yearly billing.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center bg-[#0b1523] p-1.5 rounded-full border border-slate-800">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 shadow-md"
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
      </section>

      {/* Plan Cards */}
      <section className="py-20 bg-[#1c2431]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => {
              const monthlyPrice = Number(plan.price_monthly);
              const yearlyPrice = Number(plan.price_yearly);
              const rawPrice = billingCycle === "monthly" ? monthlyPrice : yearlyPrice;
              const priceDisplay = formatCurrency(rawPrice);
              const period =
                rawPrice === 0
                  ? "forever"
                  : billingCycle === "monthly"
                  ? "/month"
                  : "/year";
              const capacityNum = Number(plan.capacity);
              const capacityLabel = capacityNum >= 1000 ? `${capacityNum / 1000} TB` : `${plan.capacity} GB`;

              return (
                <div
                  key={plan.id || plan.slug}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                    plan.is_popular
                      ? "bg-[#202a3c] border-2 border-teal-400 shadow-xl shadow-teal-500/10 lg:scale-105 z-10"
                      : "bg-[#202a3c]/70 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 text-xs font-extrabold uppercase px-3.5 py-1 rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <span className="text-xs font-semibold text-teal-400 bg-teal-950/60 border border-teal-500/30 px-2.5 py-1 rounded-md">
                        {capacityLabel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-6 min-h-[32px]">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-extrabold text-white">{priceDisplay}</span>
                        <span className="text-xs text-gray-400 ml-1.5">{period}</span>
                      </div>
                      {monthlyPrice > 0 && (
                        <p className="text-[11px] text-teal-300 mt-1">
                          {billingCycle === "monthly"
                            ? `${formatCurrency(yearlyPrice)}/yr with 20% annual discount`
                            : `Saves ${formatCurrency(monthlyPrice * 12 - yearlyPrice)} per year (20% off)`}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 text-xs text-gray-300">
                      {(plan.features || []).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <Check className="w-4 h-4 text-teal-400 mr-2 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={rawPrice === 0 ? "/register" : `/register?plan=${plan.slug}`}
                    className={`w-full py-3 px-4 rounded-xl text-center text-sm font-bold transition-all shadow-md ${
                      plan.is_popular
                        ? "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    {rawPrice === 0 ? "Start Free" : `Choose ${plan.name}`}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="py-20 bg-[#0b1523] border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Detailed Breakdown
            </h2>
            <h3 className="text-3xl font-extrabold text-white">Plan Comparison</h3>
            <p className="text-gray-400 mt-2 text-sm">
              Compare storage capacities, pricing, single-file upload limits, and support across all tiers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1c2431]/80">
            <table className="w-full text-left text-sm text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0b1523]/80">
                  <th className="py-4 px-6 text-white font-semibold">Feature</th>
                  <th className="py-4 px-4 text-center font-semibold text-white">Free</th>
                  <th className="py-4 px-4 text-center font-semibold text-white">Starter</th>
                  <th className="py-4 px-4 text-center font-semibold text-teal-400 bg-teal-950/20">
                    Growth
                  </th>
                  <th className="py-4 px-4 text-center font-semibold text-white">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-6 font-medium text-white">{row.feature}</td>

                    <td className="py-3.5 px-4 text-center">
                      {typeof row.free === "boolean" ? (
                        <Check className="w-4 h-4 text-teal-400 mx-auto" />
                      ) : (
                        <span className="text-xs">{row.free}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {typeof row.starter === "boolean" ? (
                        <Check className="w-4 h-4 text-teal-400 mx-auto" />
                      ) : (
                        <span className="text-xs">{row.starter}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center bg-teal-950/10">
                      {typeof row.growth === "boolean" ? (
                        <Check className="w-4 h-4 text-teal-400 mx-auto" />
                      ) : (
                        <span className="text-xs font-semibold text-teal-300">{row.growth}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {typeof row.business === "boolean" ? (
                        <Check className="w-4 h-4 text-teal-400 mx-auto" />
                      ) : (
                        <span className="text-xs">{row.business}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1c2431] border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Need Help Choosing a Storage Tier?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Reach out to our Abuja support team for assistance with team onboarding or billing inquiries.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-full text-sm border border-slate-700 transition"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </HomeLayout>
  );
}
