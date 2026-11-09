import {
  Files,
  Users,
  Trash2,
  Star,
  Clock,
  HardDrive,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import UploadFile from "./UploadFile";
import { type StorageUsage } from "@/types";

const navigation = [
  { name: "All Files", href: "/dashboard", icon: Files },
  { name: "Recent", href: "/recent", icon: Clock },
  { name: "Starred", href: "/starred", icon: Star },
  { name: "Shared", href: "/shared-files", icon: Users },
  { name: "Trash", href: "/trash", icon: Trash2 },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  storage?: StorageUsage;
}

export function DashboardSidebar({ isOpen, onToggle, storage }: DashboardSidebarProps) {
  const totalUsed = Number(storage?.totalUsed ?? 0);
  const totalAvailable = Number(storage?.totalAvailable ?? 10);
  const planName = storage?.planName ?? 'Free';
  const progressPercent = totalAvailable > 0 ? Math.min(100, Math.round((totalUsed / totalAvailable) * 100)) : 0;

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-screen w-64 bg-fylo-header border-r border-border transition-transform duration-300 ease-in-out flex flex-col flex-shrink-0",
          "fixed top-0 left-0 z-50 transform lg:transform-none lg:relative lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Files className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Fylo</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Upload Button */}
        <div className="p-3">
          <UploadFile />
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-white/10",
                  isActive && "bg-gradient-to-r from-teal-500/80 to-blue-600/80 text-white font-semibold shadow-sm"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Storage Usage */}
        <div className="p-4 border-t border-border mt-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center">
                <HardDrive className="mr-2 h-4 w-4 text-teal-400" />
                Storage Usage
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white">
                {planName}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-slate-700" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{totalUsed.toFixed(2)} GB used</span>
              <span>{totalAvailable >= 9999 ? 'Unlimited' : `${totalAvailable} GB`}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                alert(`You are currently on the ${planName} plan with ${totalAvailable >= 9999 ? 'Unlimited' : totalAvailable + ' GB'} storage.`);
              }}
            >
              Plan Details
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;
