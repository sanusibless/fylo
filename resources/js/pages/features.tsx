import HomeLayout from "@/layouts/home/layout";
import { Link } from "@inertiajs/react";
import {
  ShieldCheck,
  FolderSync,
  Share2,
  Smartphone,
  BarChart3,
  Folders,
  Eye,
  Lock,
  ArrowRight,
  CheckCircle2,
  HardDrive,
  Sparkles,
} from "lucide-react";

export default function Features() {
  const detailedFeatures = [
    {
      icon: ShieldCheck,
      title: "1. Secure Cloud Storage",
      subtitle: "Enterprise-grade encryption at rest and in flight",
      description:
        "Every file uploaded to Fylo is encrypted using AES-256 cipher specifications. Your encryption keys are strictly partitioned to ensure that only authenticated account holders and explicitly designated recipients can access or decipher stored content.",
      points: [
        "AES-256 rest encryption and TLS 1.3 transit security",
        "Geographically redundant replication across NVMe clusters",
        "Role-based access verification on every download request",
      ],
    },
    {
      icon: FolderSync,
      title: "2. Easy File Management",
      subtitle: "Intuitive file operations at your fingertips",
      description:
        "Seamlessly organize thousands of files. Rename documents with instant validation, drag and drop files directly from your desktop, move items between nested folder hierarchies, and delete or restore files in single actions.",
      points: [
        "Drag-and-drop multi-file upload with live progress tracking",
        "In-line file renaming with automatic extension safeguarding",
        "Fast sorting by name, date modified, size, and file type",
      ],
    },
    {
      icon: Share2,
      title: "3. File Sharing & Tokenized Links",
      subtitle: "Share with teammates and external clients securely",
      description:
        "Generate cryptographic share links with optional password protection and configurable expiration timestamps. Revoke sharing links immediately when a project wraps up, or share directly to registered users by their email.",
      points: [
        "Password-protected public access links",
        "Custom expiration date timers (e.g. 24h, 7 days, 30 days)",
        "Instant one-click access revocation",
      ],
    },
    {
      icon: Smartphone,
      title: "4. Anywhere Access",
      subtitle: "Responsive on every screen and operating system",
      description:
        "Access your complete drive whether you are working on a 4K desktop monitor, MacBook, iPad, or mobile phone. Built with modern progressive web patterns for fast response times and zero installation friction.",
      points: [
        "Fluid mobile, tablet, and desktop responsive UI",
        "Instant cross-device session synchronization",
        "Fast document retrieval with global low-latency CDN",
      ],
    },
    {
      icon: BarChart3,
      title: "5. Storage Analytics & Insights",
      subtitle: "Real-time visibility into your drive capacity",
      description:
        "Monitor your exact storage allocation with high-precision charts. View your storage breakdown across documents, media, and archives, and track download counts to see how your shared files perform.",
      points: [
        "Visual capacity meters and breakdown by file type",
        "Download counters and activity logs for team visibility",
        "Automated alerts before reaching storage thresholds",
      ],
    },
    {
      icon: Folders,
      title: "6. Automatic & Hierarchical Organization",
      subtitle: "Infinite nested folders and smart filtering",
      description:
        "Create structured directories that match your exact company or project organization. Navigate using breadcrumbs, star frequently used files for one-tap retrieval, and filter by recent uploads.",
      points: [
        "Nested folders with breadcrumb trail navigation",
        "Starred items quick-access sidebar bookmarking",
        "Dedicated Recent Files timeline",
      ],
    },
    {
      icon: Eye,
      title: "7. In-Browser File Preview",
      subtitle: "Inspect documents and stream media instantly",
      description:
        "Don't waste time or local disk space downloading huge files just to inspect them. Fylo features an integrated media player for audio/video, image lightbox, PDF reader, and code/text viewer right in the browser.",
      points: [
        "Built-in PDF reader with page controls",
        "High-definition video streaming & audio playback",
        "Code, markdown, and text file syntax inspection",
      ],
    },
    {
      icon: Lock,
      title: "8. Data Protection & Recycle Bin",
      subtitle: "Safeguards against accidental loss",
      description:
        "Accidentally deleted an important document? Deleted files reside safely in your Trash bin for 30 days. Easily restore any file back to its original location with full metadata intact, or permanently wipe sensitive files.",
      points: [
        "Soft-delete safety net for files and folder trees",
        "One-click restoration of accidentally deleted files",
        "Configurable retention periods and permanent purge controls",
      ],
    },
  ];

  return (
    <HomeLayout title="Features - Fylo Cloud Storage">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Performance &amp; Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Everything You Need For A Modern Cloud Drive
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover the comprehensive suite of storage, organization, sharing, and security features
            that make Fylo the preferred cloud workspace for over 100,000 users.
          </p>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-24 bg-[#1c2431]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {detailedFeatures.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row gap-10 items-center p-8 md:p-12 rounded-3xl bg-[#202a3c] border border-slate-800 ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Visual Side */}
              <div className="w-full lg:w-5/12 flex justify-center">
                <div className="w-full max-w-md aspect-video bg-gradient-to-br from-[#0b1523] to-[#16202e] rounded-2xl border border-slate-700/80 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono text-teal-400 font-semibold">
                      Enterprise Module {idx + 1}
                    </span>
                    <h4 className="text-xl font-bold text-white">{item.title.split(". ")[1]}</h4>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition" />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-7/12 space-y-5">
                <div className="text-sm font-semibold uppercase tracking-wider text-teal-400">
                  {item.subtitle}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed text-base">{item.description}</p>
                <ul className="space-y-3 pt-2">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-center text-sm text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0b1523] border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Experience the Future of Cloud Storage Today
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Create an account in less than 30 seconds and start with 10 GB of free, zero-compromise
            storage.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold px-8 py-3.5 rounded-full text-base shadow-lg shadow-teal-500/20 hover:scale-105 transition"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </HomeLayout>
  );
}
