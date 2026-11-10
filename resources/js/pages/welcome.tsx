import { useState } from "react";
import { Link } from "@inertiajs/react";
import HomeLayout from "@/layouts/home/layout";
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
  Zap,
  Users,
  Award,
  Globe2,
} from "lucide-react";

export default function Welcome() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Cloud Storage",
      description: "Store all your sensitive documents and media securely with end-to-end encryption and robust access control.",
      badge: "Security",
    },
    {
      icon: FolderSync,
      title: "Easy File Management",
      description: "Effortlessly upload, download, rename, categorize, move, and organize your files within an intuitive UI.",
      badge: "Productivity",
    },
    {
      icon: Share2,
      title: "File Sharing & Links",
      description: "Share files and folders with teammates or clients via secure shareable links, optional passwords, and expiration dates.",
      badge: "Collaboration",
    },
    {
      icon: Smartphone,
      title: "Anywhere Access",
      description: "Seamlessly access your files from any device—laptop, tablet, or smartphone—with 99.99% high availability.",
      badge: "Multi-platform",
    },
    {
      icon: BarChart3,
      title: "Storage Analytics",
      description: "Monitor your used capacity, storage quotas, file distribution, and download analytics in real time.",
      badge: "Insights",
    },
    {
      icon: Folders,
      title: "Automatic Organization",
      description: "Group related documents into nested folders, tag starred items, and find what you need in seconds.",
      badge: "Smart Sorting",
    },
    {
      icon: Eye,
      title: "In-Browser File Preview",
      description: "Preview photos, stream videos and music, view PDFs, and inspect text files directly without downloading them.",
      badge: "Instant Viewer",
    },
    {
      icon: Lock,
      title: "Data Protection & Retention",
      description: "Safeguard against accidental deletions with our recycle bin, version history, and configurable retention periods.",
      badge: "Protection",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create an Account",
      description: "Sign up in seconds with your email and phone. No credit card required for our generous Free plan.",
    },
    {
      number: "02",
      title: "Choose Your Storage Plan",
      description: "Select from flexible Free, Basic, Pro, or Business packages tailored to personal or enterprise storage needs.",
    },
    {
      number: "03",
      title: "Upload & Organize Files",
      description: "Drag and drop documents, high-res photos, videos, and archives directly into organized custom folders.",
    },
    {
      number: "04",
      title: "Access & Share Securely",
      description: "Access your cloud drive from any browser or device, and collaborate via password-protected links anytime.",
    },
  ];

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
      buttonText: "Start for Free",
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
      buttonText: "Upgrade to Basic",
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
      buttonText: "Get Started with Pro",
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
      buttonText: "Get Business Plan",
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

  const trustPillars = [
    {
      icon: ShieldCheck,
      title: "Zero-Knowledge Encryption",
      desc: "All stored assets are encrypted at rest with AES-256 and protected with TLS in transit.",
    },
    {
      icon: Zap,
      title: "99.99% Uptime Guarantee",
      desc: "Distributed cloud infrastructure ensures high availability and lightning-fast file streaming.",
    },
    {
      icon: Award,
      title: "Transparent & Flexible Pricing",
      desc: "No hidden egress fees, bandwidth caps, or sudden surprises. Switch or cancel plans anytime.",
    },
    {
      icon: Globe2,
      title: "Universal Cross-Device Sync",
      desc: "Accessible from Windows, macOS, Linux, iOS, and Android web clients without installing plugins.",
    },
    {
      icon: Users,
      title: "Frictionless Collaboration",
      desc: "Share files with non-users safely with tokenized, time-limited, password-secured URLs.",
    },
    {
      icon: HardDrive,
      title: "Elastic Scalability",
      desc: "Seamlessly expand from 10 GB personal projects up to enterprise terabyte volumes without downtime.",
    },
  ];

  const testimonials = [
    {
      name: "Satish Patel",
      role: "Founder & CEO, Huddle",
      avatar: "/images/profile-1.jpg",
      quote:
        "Fylo has improved our team productivity by an order of magnitude. Managing our design assets, PDFs, and client pitch decks in one secure cloud workspace has made our workflow frictionless.",
    },
    {
      name: "Bruce McKenzie",
      role: "Lead Systems Architect, Cloudscale",
      avatar: "/images/profile-2.jpg",
      quote:
        "The security model and password-protected sharing features are outstanding. We migrated our entire document workflow to Fylo and cut external storage costs by more than 40%.",
    },
    {
      name: "Iva Boyd",
      role: "Product Director, NextGen Media",
      avatar: "/images/profile-3.jpg",
      quote:
        "Being able to preview high-res videos and spreadsheets directly in the browser without having to download tens of gigabytes daily has saved our remote marketing team hours every single week.",
    },
  ];

  const faqs = [
    {
      q: "How does the Fylo cloud storage service work?",
      a: "Fylo stores your files on high-availability, encrypted cloud servers. You can access, upload, organize into folders, preview, and share your files through our web dashboard from any internet-connected device.",
    },
    {
      q: "Is there a free plan available?",
      a: "Yes! Our Free plan provides 10 GB of secure storage with standard file management and basic sharing capabilities at zero cost forever. No credit card is needed to register.",
    },
    {
      q: "Can I upgrade or downgrade my subscription?",
      a: "Absolutely. You can upgrade to Basic, Pro, or Business at any time. When upgrading, your new storage quota is activated immediately. You can also downgrade or cancel renewals with one click.",
    },
    {
      q: "What happens when my storage is full?",
      a: "When your storage reaches its plan limit, you will receive notifications. Your existing files remain safe and accessible, but you won't be able to upload new files until you free up space or upgrade to a higher tier.",
    },
    {
      q: "Can I share files with people who don't have a Fylo account?",
      a: "Yes! You can generate secure, tokenized share links. Pro and Business users can even protect links with a custom password and set automatic expiry dates.",
    },
    {
      q: "Are my files secure and private?",
      a: "Security is our highest priority. All uploads are encrypted with AES-256 at rest and transmitted using modern TLS. Only you and the people you explicitly authorize can access your files.",
    },
    {
      q: "Can I access my files on mobile devices?",
      a: "Yes. Fylo is engineered with a modern, fully responsive web application that runs smoothly on smartphones, tablets, and desktop browsers without requiring heavy app store downloads.",
    },
    {
      q: "How does the recycle bin / trash work?",
      a: "Deleted files are safely moved to your Trash bin, where you can restore them or permanently wipe them. Retention periods ensure accidental deletions can be recovered quickly.",
    },
  ];

  return (
    <HomeLayout title="Fylo - Secure Cloud Storage & Collaboration">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-[#0b1523] via-[#1c2431] to-[#1c2431]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[250px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Cloud Storage &amp; Sharing</span>
          </div>

          {/* Strong Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            Your Files. Your Space.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-blue-400">
              Accessible Anywhere.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Fylo provides high-performance, military-grade encrypted storage. Organize,
            collaborate, stream media, and share documents with complete privacy and seamless
            multi-device access.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold px-8 py-4 rounded-full text-base shadow-xl shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-full text-base border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <span>Explore Plans</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Link>
          </div>

          {/* Hero Visual Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl p-2 md:p-3 bg-gradient-to-b from-teal-500/30 to-slate-800/20 border border-slate-700 shadow-2xl backdrop-blur-sm">
            <div className="rounded-xl overflow-hidden bg-[#0b1523] border border-slate-800 shadow-inner">
              {/* Fake Window Bar */}
              <div className="h-10 bg-slate-900/90 px-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-xs text-gray-400 font-mono flex items-center space-x-2">
                  <Lock className="w-3 h-3 text-teal-400 inline" />
                  <span>https://app.fylo.storage/dashboard</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Graphic Preview */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-[#1c2431] p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase text-teal-400 font-semibold tracking-wider">
                      Storage Quota
                    </span>
                    <h4 className="text-2xl font-bold text-white mt-1">24.5 GB / 50 GB</h4>
                    <p className="text-xs text-gray-400 mt-1">49% Used • Basic Plan</p>
                  </div>
                  <div className="w-full bg-slate-700/60 rounded-full h-2.5 mt-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-2.5 rounded-full w-[49%]" />
                  </div>
                </div>

                <div className="bg-[#1c2431] p-5 rounded-xl border border-slate-800/80">
                  <span className="text-xs uppercase text-blue-400 font-semibold tracking-wider">
                    Quick Access
                  </span>
                  <div className="mt-3 space-y-2.5 text-sm">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                      <span className="flex items-center space-x-2 text-gray-200">
                        <Folders className="w-4 h-4 text-teal-400" />
                        <span>Project-Atlas-Assets</span>
                      </span>
                      <span className="text-xs text-gray-400">12 files</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                      <span className="flex items-center space-x-2 text-gray-200">
                        <Share2 className="w-4 h-4 text-cyan-400" />
                        <span>Financial-Report-Q3.pdf</span>
                      </span>
                      <span className="text-xs text-emerald-400">Shared</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1c2431] p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase text-emerald-400 font-semibold tracking-wider">
                      Protection Status
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1 flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Encrypted &amp; Synced</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      All files replicated across redundant NVMe storage clusters.
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="mt-3 inline-flex items-center text-xs text-teal-400 hover:text-teal-300 font-medium"
                  >
                    <span>Launch Live Workspace</span>
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
              Engineered For Modern Workflows
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Every Feature You Need To Manage, Protect &amp; Share
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              Say goodbye to messy attachments and fragmented drives. Fylo brings enterprise cloud
              architecture directly to your browser.
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
              Simplicity By Design
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Up and Running in 4 Easy Steps
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              Get full command over your personal or organizational cloud space in less than 2 minutes.
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
              Transparent Pricing
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Scale Your Cloud Storage As You Grow
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              Select the perfect capacity for personal archives, creative portfolios, or full team workspaces.
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

      {/* 5. WHY CHOOSE US */}
      <section className="py-24 bg-[#0b1523] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Unrivaled Reliability
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Why Over 100,000+ Teams Rely on Fylo
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              We engineered our storage layer with zero compromises on security, speed, and data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustPillars.map((pillar, idx) => (
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

      {/* 6. TESTIMONIALS */}
      <section className="py-24 bg-[#1c2431] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Social Proof
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Loved by Creators, Founders &amp; Developers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#202a3c] p-8 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between"
              >
                <p className="text-sm text-gray-300 italic mb-6 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center space-x-4 pt-4 border-t border-slate-800/80">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-teal-400/40"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-white">{t.name}</h5>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="py-24 bg-[#0b1523] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase font-bold text-teal-400 tracking-widest mb-3">
              Got Questions?
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-300 mt-4 text-base">
              Everything you need to know about our cloud storage architecture, pricing, and sharing.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#1c2431] border border-slate-800 overflow-hidden transition"
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

      {/* 8. CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-r from-teal-900/40 via-blue-900/30 to-[#0b1523] border-t border-teal-500/20 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Take Control of Your Cloud Storage?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-base md:text-lg">
            Join thousands of individuals and growing organizations who securely upload, organize,
            and share their mission-critical files with Fylo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold px-8 py-4 rounded-full text-base shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
            >
              <span>Get Started Free — 10 GB Included</span>
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
