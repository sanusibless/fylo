import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import HomeLayout from "@/layouts/home/layout";
import { formatCurrency } from "@/lib/utils";
import { type StoragePlanItem, type SharedData } from "@/types";
import {
  ShieldCheck,
  FolderSync,
  Share2,
  Smartphone,
  BarChart3,
  Folders,
  Eye,
  Lock,
  Check,
  ChevronDown,
  ArrowRight,
  HardDrive,
  Sparkles,
  Users,
  Award,
  Globe2,
  MapPin,
} from "lucide-react";

interface WelcomeProps {
  plans?: StoragePlanItem[];
}

export default function Welcome({ plans = [] }: WelcomeProps) {
  const { appConfig } = usePage<SharedData>().props;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const baseUrl = appConfig?.baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const locationShort = appConfig?.location?.short || "Abuja, Nigeria";

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Private Cloud Storage",
      description:
        "Store documents, spreadsheets, media, and archives in isolated server storage with strict ownership and access verification.",
      badge: "Security",
    },
    {
      icon: FolderSync,
      title: "Complete File Management",
      description:
        "Upload single or multiple files with live progress tracking, rename, star favorites, move across folders, or perform bulk actions.",
      badge: "Productivity",
    },
    {
      icon: Share2,
      title: "Direct & Tokenized Sharing",
      description:
        "Share files directly with registered teammates or generate tokenized public links with optional password protection and expiry dates.",
      badge: "Collaboration",
    },
    {
      icon: Smartphone,
      title: "Responsive Web Workspace",
      description:
        "Manage your files seamlessly across desktop monitors, laptops, tablets, and mobile phones directly in your browser.",
      badge: "Cross-Device",
    },
    {
      icon: BarChart3,
      title: "Real-Time Quota Tracking",
      description:
        "Track your exact storage consumption, file type breakdown, download counts, and recent account activity in real time.",
      badge: "Analytics",
    },
    {
      icon: Folders,
      title: "Hierarchical Folders",
      description:
        "Organize projects into nested folders with custom color tags, breadcrumb navigation, and fast server-backed search.",
      badge: "Organization",
    },
    {
      icon: Eye,
      title: "In-Browser File Preview",
      description:
        "Inspect images with zoom controls, read PDFs, stream video and audio, and view text, CSV, JSON, or Markdown files without downloading.",
      badge: "Instant Viewer",
    },
    {
      icon: Lock,
      title: "Recycle Bin Recovery",
      description:
        "Deleted files are safely moved to your Recycle Bin so you can restore accidentally removed items or purge them permanently.",
      badge: "Protection",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up with your name, email, and phone number. Your account immediately receives 5 GB on the Free plan at ₦0.",
    },
    {
      number: "02",
      title: "Select a Storage Tier",
      description:
        "Stay on the Free plan or upgrade to Starter, Growth, or Business in Nigerian Naira (₦) as your storage needs grow.",
    },
    {
      number: "03",
      title: "Upload & Organize",
      description:
        "Drag and drop multiple files into your workspace, group them into color-coded folders, and bookmark important items.",
    },
    {
      number: "04",
      title: "Preview & Share Securely",
      description:
        "Preview files right in your browser and collaborate using direct user shares or password-protected public links.",
    },
  ];

  const architecturePillars = [
    {
      icon: ShieldCheck,
      title: "Strict Ownership & Access Control",
      desc: "Every download and preview request verifies user authentication, file ownership, or valid share token permissions.",
    },
    {
      icon: Lock,
      title: "Password & Expiry Share Controls",
      desc: "Protect external share links with bcrypt-hashed passwords, configurable expiration dates, and instant one-click revocation.",
    },
    {
      icon: Award,
      title: "Transparent Naira (₦) Billing",
      desc: "Clear monthly and annual pricing in Nigerian Naira (NGN) with no hidden charges. Upgrade or turn off auto-renewal anytime.",
    },
    {
      icon: Globe2,
      title: "Built for Abuja & Nigerian Teams",
      desc: "Tailored for professionals, agencies, and enterprises operating in Abuja, FCT, and across Nigeria.",
    },
    {
      icon: Users,
      title: "Direct Teammate Collaboration",
      desc: "Share files directly with other registered Fylo users by email and manage all incoming files in your 'Shared with Me' view.",
    },
    {
      icon: HardDrive,
      title: "Enforced Quota Management",
      desc: "Real-time storage quota calculation ensures accurate tracking across uploads, restorations, and permanent deletions.",
    },
  ];

  const faqs = [
    {
      q: "How does the Fylo file storage platform work?",
      a: "Fylo provides a web-based cloud workspace where you can upload files, organize them into nested folders, preview supported documents and media inline, and share files with teammates or external clients.",
    },
    {
      q: "Is there a free plan available?",
      a: "Yes. Every account begins on the Free plan, which includes 5 GB of storage and up to 50 MB per file upload at ₦0.",
    },
    {
      q: "How are subscription plans priced?",
      a: "All plans are billed in Nigerian Naira (₦ / NGN). You can choose between monthly billing or 20% discounted yearly billing across Starter (₦15,000/mo), Growth (₦20,000/mo), and Business (₦30,000/mo).",
    },
    {
      q: "What happens when my storage quota is full?",
      a: "Your existing files remain safe and accessible for preview and download, but new uploads are paused until you free up space or upgrade your storage plan.",
    },
    {
      q: "Can I share files with people who do not have a Fylo account?",
      a: "Yes. You can generate a public share link for any file, protect it with an optional password, set an expiration period (1, 7, 30, or 90 days), or revoke the link at any time.",
    },
    {
      q: "What file types can I preview in the browser?",
      a: "You can preview images (JPG, PNG, GIF, WebP), PDF documents, videos (MP4, WebM, MOV), audio files (MP3, WAV, OGG, M4A), and plain text files (TXT, CSV, JSON, Markdown) directly in the browser.",
    },
  ];

  return (
    <HomeLayout title="Fylo — Cloud File Storage & Sharing in Abuja, Nigeria">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-[#0b1523] via-[#1c2431] to-[#1c2431]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[250px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>Cloud File Storage &amp; Collaboration • {locationShort}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            Organize, Preview &amp; Share Your Files{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-blue-400">
              From One Workspace.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Fylo helps individuals and teams in {locationShort} store documents, manage nested folders,
            preview media in the browser, and share files via password-protected links—with transparent
            billing in Nigerian Naira (₦).
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold px-8 py-4 rounded-full text-base shadow-xl shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Free with 5 GB</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-full text-base border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <span>View Naira (₦) Plans</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Link>
          </div>

          {/* Application Workspace Preview */}
          <div className="relative mx-auto max-w-5xl rounded-2xl p-2 md:p-3 bg-gradient-to-b from-teal-500/30 to-slate-800/20 border border-slate-700 shadow-2xl backdrop-blur-sm">
            <div className="rounded-xl overflow-hidden bg-[#0b1523] border border-slate-800 shadow-inner">
              {/* Window Bar */}
              <div className="h-10 bg-slate-900/90 px-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-xs text-gray-400 font-mono flex items-center space-x-2">
                  <Lock className="w-3 h-3 text-teal-400 inline" />
                  <span>{baseUrl}/dashboard</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Workspace Preview Cards */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-[#1c2431] p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase text-teal-400 font-semibold tracking-wider">
                      Quota Management
                    </span>
                    <h4 className="text-2xl font-bold text-white mt-1">5 GB — 250 GB</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Real-time capacity tracking &amp; per-plan upload limits
                    </p>
                  </div>
                  <div className="w-full bg-slate-700/60 rounded-full h-2.5 mt-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-2.5 rounded-full w-[45%]" />
                  </div>
                </div>

                <div className="bg-[#1c2431] p-5 rounded-xl border border-slate-800/80">
                  <span className="text-xs uppercase text-blue-400 font-semibold tracking-wider">
                    Workspace Capabilities
                  </span>
                  <div className="mt-3 space-y-2.5 text-sm">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                      <span className="flex items-center space-x-2 text-gray-200">
                        <Folders className="w-4 h-4 text-teal-400" />
                        <span>Nested Folders &amp; Tags</span>
                      </span>
                      <span className="text-xs text-gray-400">Organized</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                      <span className="flex items-center space-x-2 text-gray-200">
                        <Share2 className="w-4 h-4 text-cyan-400" />
                        <span>Tokenized Share Links</span>
                      </span>
                      <span className="text-xs text-emerald-400">Protected</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1c2431] p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase text-emerald-400 font-semibold tracking-wider">
                      Access &amp; Previews
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1 flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-emerald-400" />
                      <span>Inline Media &amp; Docs</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Preview images, PDFs, audio, video, and text files directly in your browser.
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="mt-3 inline-flex items-center text-xs text-teal-400 hover:text-teal-300 font-medium"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-24 bg-[#1c2431] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Core Platform Capabilities
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Everything You Need To Store, Manage &amp; Share Files
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              Built for reliability and clarity—every feature below is directly available inside your
              Fylo workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#202a3c] hover:bg-[#232e42] p-6 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-300/80 bg-teal-950/60 border border-teal-500/20 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-[#0b1523] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Simple Workflow
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              How Fylo Works in 4 Steps
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              Get started in under a minute and manage your personal or team documents with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-[#1c2431] p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between"
              >
                <div className="text-4xl font-extrabold text-teal-400/20 font-mono mb-4">
                  {step.number}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SUBSCRIPTION PLANS & PRICING */}
      <section id="pricing" className="py-24 bg-[#1c2431] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Transparent Naira (₦) Pricing
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Storage Plans That Scale With Your Needs
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              All plans are billed in Nigerian Naira (NGN). Start free with 5 GB and upgrade whenever you need more space.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="mt-8 inline-flex items-center bg-[#0b1523] p-1.5 rounded-full border border-slate-800">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
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
                className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
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

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => {
              const rawPrice =
                billingCycle === "monthly" ? Number(plan.price_monthly) : Number(plan.price_yearly);
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

                    <div className="flex items-baseline mb-6">
                      <span className="text-3xl font-extrabold text-white">{priceDisplay}</span>
                      <span className="text-xs text-gray-400 ml-1.5">{period}</span>
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
                    {rawPrice === 0 ? "Start for Free" : `Choose ${plan.name}`}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECURITY & ARCHITECTURE */}
      <section className="py-24 bg-[#0b1523] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Security &amp; Reliability
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Designed for Data Privacy &amp; Local Teams
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              Practical security controls and predictable storage management built into every account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {architecturePillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-[#1c2431] p-7 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-5">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{pillar.title}</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="py-24 bg-[#1c2431] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Got Questions?
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              Answers to common questions about Fylo storage quotas, Naira billing, and file sharing.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#202a3c] border border-slate-800 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center text-white font-semibold hover:text-teal-300 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-teal-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-gray-300 leading-relaxed border-t border-slate-800/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-r from-teal-900/40 via-blue-900/30 to-[#0b1523] border-t border-teal-500/20 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Organize Your Cloud Workspace?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-base md:text-lg">
            Create your free Fylo account today and get 5 GB of cloud storage to upload, preview,
            and share your files from {locationShort}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold px-8 py-4 rounded-full text-base shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
            >
              <span>Get Started Free — 5 GB Included</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-full text-base border border-slate-700 transition"
            >
              <span>Compare All Plans</span>
            </Link>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
