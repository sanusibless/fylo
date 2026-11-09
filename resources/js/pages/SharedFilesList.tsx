import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import DashboardLayout from "@/layouts/dashboard-layout/DashboardLayout";
import FileAction from "@/components/FileAction";
import EmptyState from "@/components/EmptyState";
import { Link } from "@inertiajs/react";
import { getFileIcon, getFileColor } from "@/components/FileCard";
import { type SharedFileItem, type StorageUsage, type PaginatedData } from "@/types";
import { cn } from "@/lib/utils";

interface SharedFilesListProps {
  sharedFiles: PaginatedData<SharedFileItem>;
  storage?: StorageUsage;
}

export default function SharedFilesList({ sharedFiles, storage }: SharedFilesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filesShared = sharedFiles?.data || [];

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return filesShared;
    const q = searchQuery.toLowerCase();
    return filesShared.filter((item) =>
      item.file?.name?.toLowerCase()?.includes(q) ||
      item.sharedBy?.name?.toLowerCase()?.includes(q) ||
      item.sharedBy?.email?.toLowerCase()?.includes(q)
    );
  }, [filesShared, searchQuery]);

  return (
    <DashboardLayout title="Shared Files - Fylo">
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

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Shared With Me</h1>
              <p className="text-sm text-muted-foreground">Files and documents that colleagues have shared with you</p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search shared files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Files List */}
          <div className="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs uppercase">
                    <th className="py-4 px-6 font-semibold">Name</th>
                    <th className="py-4 px-6 font-semibold hidden md:table-cell">Shared By</th>
                    <th className="py-4 px-6 font-semibold hidden sm:table-cell">Size</th>
                    <th className="py-4 px-6 font-semibold hidden lg:table-cell">Date Shared</th>
                    <th className="w-24 py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((sharedFile, idx) => {
                      const { file, sharedDate, sharedBy } = sharedFile;
                      if (!file) return null;
                      const FileIcon = getFileIcon(file.type);
                      const iconColor = getFileColor(file.type);

                      return (
                        <tr
                          key={file.uuid || file.id || idx}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3 min-w-0 max-w-xs md:max-w-md">
                              <FileIcon className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
                              <span className="font-medium text-foreground truncate" title={file.name}>
                                {file.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 hidden md:table-cell">
                            <div className="flex flex-col">
                              <span className="text-foreground text-sm font-medium">{sharedBy?.name || 'Unknown'}</span>
                              <span className="text-muted-foreground text-xs">{sharedBy?.email || ''}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-muted-foreground hidden sm:table-cell">
                            {typeof file.size_in_mb === 'number' ? `${file.size_in_mb} MB` : (file.size_in_mb || file.size_in_kb || file.size)}
                          </td>
                          <td className="py-4 px-6 text-sm text-muted-foreground hidden lg:table-cell">
                            {new Date(sharedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <FileAction file={file} action="download" view="list" />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : null}
                </tbody>
              </table>
            </div>

            {filteredFiles.length === 0 && (
              <div className="py-12">
                <EmptyState message={searchQuery ? `No shared files match "${searchQuery}"` : "No files have been shared with you yet"} />
              </div>
            )}

            {/* Pagination links */}
            {sharedFiles?.links && sharedFiles.links.length > 3 && (
              <div className="flex justify-end p-4 border-t border-border space-x-1">
                {sharedFiles.links.map((link, i) => (
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
