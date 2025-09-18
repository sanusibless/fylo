// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import AppLayout from '@/layouts/app-layout';
// import { dashboard } from '@/routes';
// import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Dashboard',
//         href: dashboard().url,
//     },
// ];

// export default function Dashboard() {
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Dashboard" />
//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                 </div>
//                 <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
//                     <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }


import { useState } from "react";
import { Grid, List, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } 
import { DashboardHeader } 
import { StatsCards } from "@/components/StatsCards";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import { FileCard } from "@/components/FileCard";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const mockFiles = [
  {
    id: "1",
    name: "Project-Presentation.pptx",
    type: "document" as const,
    size: "2.4 MB",
    modifiedAt: "2 hours ago",
    isStarred: true,
  },
  {
    id: "2",
    name: "Team-Photo.jpg",
    type: "image" as const,
    size: "1.8 MB",
    modifiedAt: "1 day ago",
  },
  {
    id: "3",
    name: "Demo-Video.mp4",
    type: "video" as const,
    size: "24.5 MB",
    modifiedAt: "3 days ago",
  },
  {
    id: "4",
    name: "Background-Music.mp3",
    type: "audio" as const,
    size: "5.2 MB",
    modifiedAt: "1 week ago",
  },
  {
    id: "5",
    name: "Archive-Backup.zip",
    type: "archive" as const,
    size: "156 MB",
    modifiedAt: "2 weeks ago",
    isStarred: true,
  },
  {
    id: "6",
    name: "Budget-Report.xlsx",
    type: "document" as const,
    size: "890 KB",
    modifiedAt: "3 weeks ago",
  },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col lg:ml-0">
        <DashboardHeader onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-6 space-y-8">
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
              <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-white/90 mb-6">
                Manage your files, collaborate with your team, and stay productive.
              </p>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Explore Features
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Files Section */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Recent Files</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="ghost" size="sm">
                        <SortAsc className="h-4 w-4 mr-2" />
                        Sort
                      </Button>
                      <div className="flex border border-border rounded-lg">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="rounded-r-none"
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="rounded-l-none"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {mockFiles.map((file) => (
                        <FileCard key={file.id} file={file} view="grid" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {mockFiles.map((file) => (
                        <FileCard key={file.id} file={file} view="list" />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <QuickActions />
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
