import { useState, useMemo } from "react";
import { Grid, List, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import { FileCard } from "@/components/FileCard";
import dashboardHero from "@/assets/dashboard-hero.jpg";
import DashboardLayout from "@/layouts/dashboard-layout/DashboardLayout";
import useAuth from "@/hooks/use-auth";
import EmptyState from "@/components/EmptyState";
import FileTable from "@/components/FileTable";
import { type FileItem, type ActivityItem, type StorageUsage } from "@/types";

interface DashboardProps {
  totalFiles?: number;
  totalShared?: number;
  downloads?: number;
  recentFiles?: FileItem[];
  storage?: StorageUsage;
  recentActivities?: ActivityItem[];
}

export default function Dashboard({
  totalFiles = 0,
  totalShared = 0,
  downloads = 0,
  recentFiles = [],
  storage,
  recentActivities = [],
}: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const user = useAuth();

  const filteredFiles = useMemo(() => {
    let files = [...recentFiles];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      files = files.filter(f => f.name.toLowerCase().includes(q));
    }
    files.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return files;
  }, [recentFiles, searchQuery, sortOrder]);

  return (
    <DashboardLayout title="Dashboard - Fylo">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        storage={storage}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onSearch={setSearchQuery}
        />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-primary">
            <div className="absolute inset-0 opacity-20">
              <img
                src={dashboardHero}
                alt="Dashboard Hero"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'Explorer'}!
              </h1>
              <p className="text-white/90 max-w-xl">
                Store, organize, collaborate, and access all your important files seamlessly in one secure cloud workspace.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards
            totalFiles={totalFiles}
            sharedFiles={totalShared}
            storageUsed={storage?.totalUsed ?? 0}
            downloads={downloads}
          />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Files Section */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Recent Files
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Showing latest uploads and updates
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="text-xs text-muted-foreground"
                      >
                        <SortAsc className="h-4 w-4 mr-1" />
                        {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                      </Button>

                      <div className="flex border border-border rounded-lg overflow-hidden">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="rounded-r-none h-8 px-2.5"
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="rounded-l-none h-8 px-2.5"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredFiles.length === 0 ? (
                    <EmptyState message={searchQuery ? `No files match "${searchQuery}"` : "No files uploaded yet"} />
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredFiles.map((file) => (
                        <FileCard key={file.uuid} file={file} view="grid" />
                      ))}
                    </div>
                  ) : (
                    <FileTable files={filteredFiles} />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <QuickActions />
              <RecentActivity activities={recentActivities} />
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
