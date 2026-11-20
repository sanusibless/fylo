import { useState, useMemo } from "react";
import { Grid, List, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileCard } from "@/components/FileCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EmptyState from "@/components/EmptyState";
import FileTable from "@/components/FileTable";
import { Link } from "@inertiajs/react";
import { type FileItem, type StorageUsage, type PaginatedData } from "@/types";

interface StarredPageProps {
  files: PaginatedData<FileItem>;
  storage?: StorageUsage;
}

export default function Starred({ files, storage }: StarredPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const starredList = files?.data || [];

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return starredList;
    const q = searchQuery.toLowerCase();
    return starredList.filter((f) => f.name.toLowerCase().includes(q));
  }, [starredList, searchQuery]);

  return (
    <DashboardLayout title="Starred Files - Fylo" storage={storage} onSearch={setSearchQuery}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400">
              <Star className="h-6 w-6 fill-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Starred Files</h1>
              <p className="text-xs text-gray-400">
                Quick access to your most important and frequently referenced documents
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

        {/* Content */}
        <Card className="border-slate-800 bg-[#202a3c] rounded-3xl shadow-xl overflow-hidden">
          <CardContent className="p-6">
            {filteredFiles.length === 0 ? (
              <EmptyState
                message={
                  searchQuery
                    ? `No files match "${searchQuery}"`
                    : "No starred files yet. Click the star icon on any file to bookmark it here."
                }
              />
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
