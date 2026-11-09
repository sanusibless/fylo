import { useState, useMemo } from "react";
import { Grid, List, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCard } from "@/components/FileCard";
import DashboardLayout from "@/layouts/dashboard-layout/DashboardLayout";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmptyState from "@/components/EmptyState";
import FileTable from "@/components/FileTable";
import { Link } from "@inertiajs/react";
import { type FileItem, type StorageUsage, type PaginatedData } from "@/types";
import { cn } from "@/lib/utils";

interface RecentPageProps {
  files: PaginatedData<FileItem>;
  storage?: StorageUsage;
}

export default function Recent({ files, storage }: RecentPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const recentList = files?.data || [];

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return recentList;
    const q = searchQuery.toLowerCase();
    return recentList.filter(f => f.name.toLowerCase().includes(q));
  }, [recentList, searchQuery]);

  return (
    <DashboardLayout title="Recent Files - Fylo">
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

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Recent Files</h1>
              <p className="text-sm text-muted-foreground">Files you have uploaded or modified recently</p>
            </div>
          </div>

          {/* Files Section */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">All Recent Files</CardTitle>
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
            </CardHeader>

            <CardContent>
              {filteredFiles.length === 0 ? (
                <EmptyState message={searchQuery ? `No files match "${searchQuery}"` : "No recent files found"} />
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredFiles.map((file) => (
                    <FileCard key={file.uuid} file={file} view="grid" />
                  ))}
                </div>
              ) : (
                <FileTable files={filteredFiles} />
              )}

              {/* Pagination */}
              {files?.links && files.links.length > 3 && (
                <div className="flex justify-end mt-6 space-x-1">
                  {files.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.url || '#'}
                      preserveScroll
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded border border-border transition-colors",
                        link.active
                          ? "bg-teal-500 text-white border-teal-500"
                          : "text-muted-foreground hover:bg-muted",
                        !link.url && "opacity-40 cursor-not-allowed pointer-events-none"
                      )}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </DashboardLayout>
  );
}
