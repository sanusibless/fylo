import { useState, useMemo } from "react";
import { Grid, List, Star } from "lucide-react";
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

interface StarredPageProps {
  files: PaginatedData<FileItem>;
  storage?: StorageUsage;
}

export default function Starred({ files, storage }: StarredPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const starredList = files?.data || [];

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return starredList;
    const q = searchQuery.toLowerCase();
    return starredList.filter(f => f.name.toLowerCase().includes(q));
  }, [starredList, searchQuery]);

  return (
    <DashboardLayout title="Starred Files - Fylo">
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
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Starred Files</h1>
              <p className="text-sm text-muted-foreground">Files you have marked as favorites for quick access</p>
            </div>
          </div>

          {/* Files Section */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">All Starred Files</CardTitle>
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
                <EmptyState message={searchQuery ? `No starred files match "${searchQuery}"` : "You haven't starred any files yet"} />
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
