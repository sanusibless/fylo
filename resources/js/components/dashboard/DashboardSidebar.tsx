import { useState } from "react";
import {
  Files,
  FolderOpen,
  Users,
  Settings,
  Upload,
  Trash2,
  Star,
  Clock,
  HardDrive,
  Menu,
  X,
  Route
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { route } from 'ziggy-js';

const navigation = [
  { name: "All Files", href: "/dashboard", icon: Files },
  { name: "Recent", href: "/recent", icon: Clock },
  { name: "Starred", href: "/starred", icon: Star },
  { name: "Shared", href: "/shared", icon: Users },
  { name: "Folders", href: "/folders", icon: FolderOpen },
  { name: "Trash", href: "/trash", icon: Trash2 },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
    const currentRoute = route().current();
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
            "h-screen w-64 bg-fylo-header border-r border-border transition-transform duration-300 ease-in-out",
            "fixed top-0 left-0 z-50 transform lg:transform-none lg:relative lg:z-0",
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Files className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Fylo</span>
          </div>
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
        <div className="p-4">
          <Button className="w-full bg-gradient bg-[hsl(192,77%,54%)]/80 text-white hover:bg-[] hover:bg-[hsl(200,77%,54%)]/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {

            console.log(currentRoute);
            const isActive = currentRoute === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[hsl(185,77%,54%)]/80",
                  isActive
                    ? "text-white p-4 rounded-lg hover:bg-[hsl(185,77%,54%)]/80"
                    : ""
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Storage Usage */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <HardDrive className="mr-2 h-4 w-4" />
              Storage Usage
            </div>
            <Progress value={65} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>6.5 GB used</span>
              <span>10 GB total</span>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
