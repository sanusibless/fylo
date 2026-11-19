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
  Sparkles,
} from "lucide-react";

export default function Features() {
  const detailedFeatures = [
    {
      icon: ShieldCheck,
      title: "1. Private & Authenticated File Storage",
      subtitle: "Strict ownership checks and server-side validation",
      description:
        "Every file uploaded to Fylo is stored in isolated server storage and protected by strict user ownership and access verification. Files cannot be accessed by unauthorized users, and all uploads are validated by extension and size.",
      points: [
        "Server-side ownership verification on every download and preview",
        "Strict file extension and plan-based upload size validation",
        "Zero exposure of internal server filesystem paths",
      ],
    },
    {
      icon: FolderSync,
      title: "2. Comprehensive File Management",
      subtitle: "Single and multi-file operations built for speed",
      description:
        "Upload single or multiple files with live progress tracking, rename files while preserving extensions automatically, move items between folders, bookmark starred files, and execute bulk operations in a single click.",
      points: [
        "Drag-and-drop multi-file upload with progress feedback",
        "In-line file renaming with automatic extension preservation",
        "Multi-select bulk move, restore, and delete controls",
      ],
    },
    {
      icon: Share2,
      title: "3. Direct User & Tokenized Link Sharing",
      subtitle: "Collaborate with teammates or external clients",
      description:
        "Share files directly with other registered Fylo users by email, or generate cryptographic public share links with optional password protection and configurable expiration dates.",
      points: [
        "Optional password protection on public share links",
        "Custom link expiration timers (1, 7, 30, or 90 days)",
        "Instant one-click link revocation from your file manager",
      ],
    },
    {
      icon: Smartphone,
      title: "4. Responsive Cross-Device Interface",
      subtitle: "Works across desktop, tablet, and mobile browsers",
      description:
        "Access your complete cloud drive from any modern browser on Windows, macOS, Linux, iOS, or Android. Switch effortlessly between grid and table layouts on any screen size.",
      points: [
        "Responsive layout optimized for mobile, tablet, and desktop",
        "Toggle between visual Grid View and compact List View",
        "Fast navigation with keyboard-friendly dialogs and menus",
      ],
    },
    {
      icon: BarChart3,
      title: "5. Real-Time Storage Quota & Activity Tracking",
      subtitle: "Clear visibility into your drive usage",
      description:
        "Monitor your exact storage consumption against your plan limit, view file counts across categories, track total downloads on your files, and inspect your recent account activity log.",
      points: [
        "Live storage quota meter in the sidebar and subscription page",
        "Download counters updated on every authorized file download",
        "Chronological activity feed of uploads, renames, shares, and deletions",
      ],
    },
    {
      icon: Folders,
      title: "6. Hierarchical Folder Organization",
      subtitle: "Nested directories with custom color tags",
      description:
        "Create structured folder hierarchies that match your projects or departments. Assign custom color tags to folders, navigate deep hierarchies via breadcrumbs, and filter by file type.",
      points: [
        "Nested folders with full breadcrumb trail navigation",
        "Color-coded folder icons for visual organization",
        "Safe folder deletion that preserves inner files by moving them up",
      ],
    },
    {
      icon: Eye,
      title: "7. In-Browser File Preview",
      subtitle: "Inspect documents, code, and media without downloading",
      description:
        "Preview supported files directly inside your browser before downloading. Fylo includes an interactive viewer for images, PDF documents, video and audio streams, and plain text files.",
      points: [
        "Image lightbox with zoom-in and zoom-out controls",
        "Embedded PDF document reader and HTML5 video/audio player",
        "Inline text viewer for TXT, CSV, JSON, and Markdown files",
      ],
    },
    {
      icon: Lock,
      title: "8. Recycle Bin & Safe Recovery",
      subtitle: "Protect against accidental deletions",
      description:
        "Deleting a file moves it to your Recycle Bin rather than erasing it immediately. Restore deleted files back to your active workspace with one click, or permanently purge them when no longer needed.",
      points: [
        "Soft-delete workflow for all user files",
        "One-click file restoration with quota verification",
        "Individual permanent delete or full 'Empty Trash' action",
      ],
    },
  ];

  return (
    <HomeLayout title="Features — Fylo Cloud Storage (Abuja, Nigeria)">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-[#0b1523] to-[#1c2431] text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Practical Productivity &amp; Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Every Feature Inside Your Fylo Workspace
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore the core file management, folder organization, inline preview, and secure sharing capabilities built into Fylo for individuals and teams in Abuja, Nigeria.
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
                      Core Capability 0{idx + 1}
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
            Start Using Fylo Today
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Create your account in seconds and start with 5 GB of free cloud storage.
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
