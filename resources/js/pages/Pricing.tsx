import { useState } from "react";
import HomeLayout from "@/layouts/home/layout";
import { Link } from "@inertiajs/react";
import { Check, X, ArrowRight, Sparkles, HelpCircle } from "lucide-react";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "free",
      name: "Free",
      tagline: "Essential cloud storage for individuals getting started.",
      storage: "10 GB",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      period: "forever",
      popular: false,
      buttonText: "Start Free",
      href: "/register",
      features: [
        "10 GB secure cloud storage",
        "Up to 50 MB per file upload",
        "Standard file management",
        "Basic file sharing links",
        "Web browser access",
        "Recycle bin recovery (7 days)",
      ],
    },
    {
      id: "basic",
      name: "Basic",
      tagline: "Expanded storage and unlimited folder structures for power users.",
      storage: "50 GB",
      monthlyPrice: "$9",
      yearlyPrice: "$85",
      period: billingCycle === "monthly" ? "/month" : "/year",
      popular: false,
      buttonText: "Get Basic",
      href: "/register?plan=basic",
      features: [
        "50 GB high-speed storage",
        "Unlimited nested folders",
        "Direct link file sharing",
        "In-browser media & PDF previews",
        "Up to 250 MB per file upload",
        "Standard customer support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "Maximum protection, password links, and version history.",
      storage: "250 GB",
      monthlyPrice: "$19",
      yearlyPrice: "$180",
      period: billingCycle === "monthly" ? "/month" : "/year",
      popular: true,
      buttonText: "Choose Pro",
      href: "/register?plan=pro",
      features: [
        "250 GB ultra-fast storage",
        "Password-protected share links",
        "Custom link expiration dates",
        "Extended file upload limit (2 GB)",
        "Detailed storage analytics",
        "Priority 24/7 support",
      ],
    },
    {
      id: "business",
      name: "Business",
      tagline: "Enterprise capacity, multi-user teams, and activity logging.",
      storage: "1 TB",
      monthlyPrice: "$49",
      yearlyPrice: "$470",
      period: billingCycle === "monthly" ? "/month" : "/year",
      popular: false,
      buttonText: "Choose Business",
      href: "/register?plan=business",
      features: [
        "1 TB scalable cloud storage",
        "Multiple team accounts",
        "Full audit logs & activity monitoring",
        "Dedicated account manager",
        "Enterprise SLA guarantee",
        "Compliant data governance",
      ],
    },
  ];

  const comparisonRows = [
    { feature: "Storage Capacity", free: "10 GB", basic: "50 GB", pro: "250 GB", business: "1 TB (1,000 GB)" },
    { feature: "Max Single File Upload", free: "50 MB", basic: "250 MB", pro: "2 GB", business: "10 GB" },
    { feature: "Unlimited Folders", free: true, basic: true, pro: true, business: true },
    { feature: "File Sharing Links", free: true, basic: true, pro: true, business: true },
    { feature: "In-Browser File Previews", free: false, basic: true, pro: true, business: true },
    { feature: "Password Protected Links", free: false, basic: false, pro: true, business: true },
    { feature: "Expiring Share Links", free: false, basic: false, pro: true, business: true },
    { feature: "Trash Retention Period", free: "7 Days", basic: "30 Days", pro: "90 Days", business: "Unlimited" },
    { feature: "Activity & Audit Logs", free: false, basic: false, pro: false, business: true },
    { feature: "Customer Support Level", free: "Community", basic: "Standard Email", pro: "Priority 24/7", business: "Dedicated Account Lead" },
  ];

  return (
    <HomeLayout title="Pricing & Subscription Plans - Fylo Cloud Storage">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clear, Predictable Billing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Find the Perfect Plan for Your Storage Needs
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Start for free and upgrade as your team and storage requirements expand. Every paid plan
            includes a 14-day money-back guarantee.
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
              const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                    plan.popular
                      ? "bg-[#202a3c] border-2 border-teal-400 shadow-xl shadow-teal-500/10 scale-105 z-10"
                      : "bg-[#202a3c]/70 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 text-xs font-extrabold uppercase px-3.5 py-1 rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <span className="text-xs font-semibold text-teal-400 bg-teal-950/60 border border-teal-500/30 px-2.5 py-1 rounded-md">
                        {plan.storage}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-6 min-h-[32px]">{plan.tagline}</p>

                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-extrabold text-white">{price}</span>
                      <span className="text-xs text-gray-400 ml-1.5">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8 text-xs text-gray-300">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <Check className="w-4 h-4 text-teal-400 mr-2 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={plan.href}
                    className={`w-full py-3 px-4 rounded-xl text-center text-sm font-bold transition-all shadow-md ${
                      plan.popular
                        ? "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    {plan.buttonText}
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
            <h3 className="text-3xl font-extrabold text-white">Feature Comparison</h3>
            <p className="text-gray-400 mt-2 text-sm">
              Review side-by-side technical capabilities across each subscription package.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1c2431]/80">
            <table className="w-full text-left text-sm text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0b1523]/80">
                  <th className="py-4 px-6 text-white font-semibold">Feature</th>
                  <th className="py-4 px-4 text-center font-semibold text-white">Free</th>
                  <th className="py-4 px-4 text-center font-semibold text-white">Basic</th>
                  <th className="py-4 px-4 text-center font-semibold text-teal-400 bg-teal-950/20">
                    Pro
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
                        row.free ? (
                          <Check className="w-4 h-4 text-teal-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs">{row.free}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {typeof row.basic === "boolean" ? (
                        row.basic ? (
                          <Check className="w-4 h-4 text-teal-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs">{row.basic}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center bg-teal-950/10">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check className="w-4 h-4 text-teal-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs font-semibold text-teal-300">{row.pro}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {typeof row.business === "boolean" ? (
                        row.business ? (
                          <Check className="w-4 h-4 text-teal-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-gray-600 mx-auto" />
                        )
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
            Have Custom Enterprise Requirements?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Contact our systems engineering team to configure dedicated multi-terabyte nodes or
            on-premise S3 sync bridges.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-full text-sm border border-slate-700 transition"
          >
            <span>Talk with Sales</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </HomeLayout>
  );
}
