import { useState, useMemo } from "react";
import { Grid, List, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCard } from "@/components/FileCard";
import DashboardLayout from "@/layouts/dashboard-layout/DashboardLayout";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmptyState from "@/components/EmptyState";
import FileTable from "@/components/FileTable";
import { Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { type FileItem, type StorageUsage, type PaginatedData } from "@/types";
import { cn } from "@/lib/utils";

interface TrashPageProps {
  files: PaginatedData<FileItem>;
  storage?: StorageUsage;
}

export default function Trash({ files, storage }: TrashPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmptying, setIsEmptying] = useState(false);

  const trashedList = files?.data || [];

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return trashedList;
    const q = searchQuery.toLowerCase();
    return trashedList.filter(f => f.name.toLowerCase().includes(q));
  }, [trashedList, searchQuery]);

  const handleEmptyTrash = () => {
    if (!confirm('Are you sure you want to permanently delete all files in the Trash? This cannot be undone.')) {
      return;
    }
    setIsEmptying(true);
    router.delete(route('file.empty_trash'), {
      onSuccess: () => {
        setIsEmptying(false);
        toast.success('Trash emptied successfully');
      },
      onError: () => {
        setIsEmptying(false);
        toast.error('Unable to empty trash');
      }
    });
  };

  return (
    <DashboardLayout title="Trash - Fylo">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Trash</h1>
                <p className="text-sm text-muted-foreground">Deleted files can be restored or permanently removed</p>
              </div>
            </div>

            {trashedList.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleEmptyTrash}
                disabled={isEmptying}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Empty Trash
              </Button>
            )}
          </div>

          {/* Files Section */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">Trashed Files</CardTitle>
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
                <EmptyState message={searchQuery ? `No trashed files match "${searchQuery}"` : "Trash is empty"} />
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredFiles.map((file) => (
                    <FileCard key={file.uuid} file={file} view="grid" isTrash={true} />
                  ))}
                </div>
              ) : (
                <FileTable files={filteredFiles} isTrash={true} />
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
