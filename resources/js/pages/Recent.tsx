import { useState, useMemo } from "react";
import { Grid, List, Clock, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCard } from "@/components/FileCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EmptyState from "@/components/EmptyState";
import FileTable from "@/components/FileTable";
import { Link } from "@inertiajs/react";
import { type FileItem, type StorageUsage, type PaginatedData } from "@/types";

interface RecentPageProps {
  files: PaginatedData<FileItem>;
  storage?: StorageUsage;
}

export default function Recent({ files, storage }: RecentPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const recentList = files?.data || [];

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return recentList;
    const q = searchQuery.toLowerCase();
    return recentList.filter((f) => f.name.toLowerCase().includes(q));
  }, [recentList, searchQuery]);

  return (
    <DashboardLayout title="Recent Files - Fylo" storage={storage} onSearch={setSearchQuery}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Recent Files</h1>
              <p className="text-xs text-gray-400">
                Files you have recently uploaded, accessed, or modified
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex border border-slate-700 rounded-lg overflow-hidden bg-[#0b1523]">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-8 px-2.5 rounded-none ${viewMode === "grid" ? "bg-teal-400 text-slate-950 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-8 px-2.5 rounded-none ${viewMode === "list" ? "bg-teal-400 text-slate-950 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Files Content */}
        <Card className="border-slate-800 bg-[#202a3c] rounded-3xl shadow-xl overflow-hidden">
          <CardContent className="p-6">
            {filteredFiles.length === 0 ? (
              <EmptyState message={searchQuery ? `No files match "${searchQuery}"` : "No recent activity recorded yet"} />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <FileCard key={file.uuid} file={file} view="grid" />
                ))}
              </div>
            ) : (
              <FileTable files={filteredFiles} />
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {files?.links && files.links.length > 3 && (
          <div className="flex justify-center space-x-1 pt-4">
            {files.links.map((link, idx) => (
              <Link
                key={idx}
                href={link.url || "#"}
                dangerouslySetInnerHTML={{ __html: link.label }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  link.active
                    ? "bg-teal-400 text-slate-950"
                    : link.url
                    ? "bg-[#202a3c] text-gray-300 hover:bg-slate-800"
                    : "text-gray-600 cursor-not-allowed"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
