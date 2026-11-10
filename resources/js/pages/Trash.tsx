import { useState, useMemo } from "react";
import { Grid, List, Trash2, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileCard } from "@/components/FileCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EmptyState from "@/components/EmptyState";
import FileTable from "@/components/FileTable";
import { Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { type FileItem, type StorageUsage, type PaginatedData } from "@/types";

interface TrashPageProps {
  files: PaginatedData<FileItem>;
  storage?: StorageUsage;
}

export default function Trash({ files, storage }: TrashPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const trashList = files?.data || [];

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return trashList;
    const q = searchQuery.toLowerCase();
    return trashList.filter((f) => f.name.toLowerCase().includes(q));
  }, [trashList, searchQuery]);

  const handleEmptyTrash = () => {
    if (!confirm("Are you sure you want to permanently delete all items in the Trash? This cannot be undone.")) {
      return;
    }

    setIsProcessing(true);
    router.delete("/file/trash/empty", {
      onSuccess: () => {
        setIsProcessing(false);
        toast.success("Trash emptied permanently");
      },
      onError: () => {
        setIsProcessing(false);
        toast.error("Failed to empty trash");
      },
    });
  };

  return (
    <DashboardLayout title="Recycle Bin / Trash - Fylo" storage={storage} onSearch={setSearchQuery}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Recycle Bin</h1>
              <p className="text-xs text-gray-400">
                Deleted files are retained according to your plan's window. Restore or permanently erase them.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {trashList.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                disabled={isProcessing}
                onClick={handleEmptyTrash}
                className="text-xs font-semibold px-4 py-2 rounded-xl"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                <span>Empty Trash</span>
              </Button>
            )}

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

        {/* Notice Alert */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center space-x-3 text-xs text-gray-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            Items in your recycle bin will be permanently erased after your retention period expires. Click the restore icon on any item to recover it to your active workspace.
          </span>
        </div>

        {/* Content */}
        <Card className="border-slate-800 bg-[#202a3c] rounded-3xl shadow-xl overflow-hidden">
          <CardContent className="p-6">
            {filteredFiles.length === 0 ? (
              <EmptyState
                message={
                  searchQuery
                    ? `No deleted files match "${searchQuery}"`
                    : "Your Recycle Bin is empty."
                }
              />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <FileCard key={file.uuid} file={file} view="grid" isTrash />
                ))}
              </div>
            ) : (
              <FileTable files={filteredFiles} isTrash />
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
