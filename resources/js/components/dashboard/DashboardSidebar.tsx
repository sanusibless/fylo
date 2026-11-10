import {
  Files,
  Users,
  Trash2,
  Star,
  Clock,
  HardDrive,
  Folder,
  CreditCard,
  Shield,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import UploadFile from "./UploadFile";
import { type StorageUsage, type SharedData } from "@/types";

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  storage?: StorageUsage;
}

export function DashboardSidebar({ isOpen, onToggle, storage }: DashboardSidebarProps) {
  const { auth, storage: sharedStorage } = usePage<SharedData>().props;
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';

  const effectiveStorage = storage || sharedStorage;
  const totalUsed = Number(effectiveStorage?.totalUsed ?? 0);
  const totalAvailable = Number(effectiveStorage?.totalAvailable ?? 10);
  const planName = effectiveStorage?.planName ?? 'Free';
  const progressPercent = totalAvailable > 0 ? Math.min(100, Math.round((totalUsed / totalAvailable) * 100)) : 0;

  const navigation = [
    { name: "All Files", href: "/dashboard", icon: Files },
    { name: "My Folders", href: "/folders", icon: Folder },
    { name: "Recent", href: "/recent", icon: Clock },
    { name: "Starred", href: "/starred", icon: Star },
    { name: "Shared with Me", href: "/shared-files", icon: Users },
    { name: "Trash", href: "/trash", icon: Trash2 },
    { name: "Subscription", href: "/subscription", icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={cn(
          "h-screen w-64 bg-[#0b1523] border-r border-slate-800 transition-transform duration-300 ease-in-out flex flex-col flex-shrink-0",
          "fixed top-0 left-0 z-50 transform lg:transform-none lg:relative lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img src="/images/logo.svg" alt="Fylo" className="h-7 w-auto" />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Upload Button */}
        <div className="p-4">
          <UploadFile />
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all text-gray-300 hover:text-white hover:bg-slate-800/60",
                  isActive && "bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                )}
              >
                <item.icon className={cn("mr-3 h-4 w-4 shrink-0", isActive ? "text-slate-950" : "text-teal-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Admin Link if Admin */}
          {auth?.user?.is_admin && (
            <div className="pt-3 border-t border-slate-800/80 mt-3">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-teal-400/80">
                Administration
              </span>
              <Link
                href="/admin"
                className={cn(
                  "flex items-center px-3.5 py-2.5 mt-1 text-sm font-medium rounded-xl transition-all text-amber-300 hover:bg-slate-800/60",
                  currentPath.startsWith('/admin') && "bg-amber-500 text-slate-950 font-bold shadow"
                )}
              >
                <Shield className="mr-3 h-4 w-4 shrink-0" />
                <span>Admin Portal</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Storage Capacity Progress Widget */}
        <div className="p-4 border-t border-slate-800 mt-auto bg-[#080f1a]">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center font-medium">
                <HardDrive className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
                Storage
              </span>
              <span className="font-semibold text-teal-300 bg-teal-950/80 border border-teal-500/30 px-2 py-0.5 rounded text-[11px]">
                {planName} Plan
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-gray-400 font-mono">
              <span>{totalUsed.toFixed(2)} GB used</span>
              <span>{totalAvailable >= 9999 ? 'Unlimited' : `${totalAvailable} GB`}</span>
            </div>

            <Link
              href="/subscription"
              className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              <span>Manage Plan</span>
              <ExternalLink className="w-3 h-3 text-teal-400" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;
