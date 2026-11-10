import { useState, ReactNode } from "react";
import { Head, usePage } from "@inertiajs/react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Toaster } from "sonner";
import { type StorageUsage, type SharedData } from "@/types";

interface DashboardLayoutProps {
  title?: string;
  storage?: StorageUsage;
  onSearch?: (query: string) => void;
  children: ReactNode;
}

export default function DashboardLayout({
  title = "Fylo Cloud Drive",
  storage,
  onSearch,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { storage: sharedStorage } = usePage<SharedData>().props;

  return (
    <div className="bg-[#1c2431] text-white min-h-screen flex w-full font-sans antialiased selection:bg-teal-400 selection:text-slate-900">
      <Head title={title} />

      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        storage={storage || sharedStorage}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onSearch={onSearch}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {children}
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
