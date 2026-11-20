import { useState, useMemo } from "react";
import { Grid, List, SortAsc, UploadCloud, Files, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/components/StatsCards";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import { FileCard } from "@/components/FileCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import useAuth from "@/hooks/use-auth";
import EmptyState from "@/components/EmptyState";
import FileTable from "@/components/FileTable";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import axios from "axios";
import { formatStorageGB } from "@/lib/utils";
import { type FileItem, type ActivityItem, type StorageUsage } from "@/types";

interface DashboardProps {
  totalFiles?: number;
  totalFolders?: number;
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [isDragging, setIsDragging] = useState(false);
  const user = useAuth();

  const filteredFiles = useMemo(() => {
    let files = [...recentFiles];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      files = files.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.extension && f.extension.toLowerCase().includes(q)) ||
          (f.folder?.name && f.folder.name.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== "all") {
      files = files.filter((f) => f.type === typeFilter);
    }
    files.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    return files;
  }, [recentFiles, searchQuery, typeFilter, sortOrder]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      toast.info(`Uploading ${files.length} file(s)...`);
      let uploaded = 0;
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        try {
          await axios.post("/file/upload", formData, {
            headers: { Accept: "application/json", "Content-Type": "multipart/form-data" },
          });
          uploaded++;
        } catch (err: any) {
          toast.error(err.response?.data?.errors?.file?.[0] || err.response?.data?.message || `Failed to upload ${files[i].name}`);
        }
      }
      if (uploaded > 0) {
        toast.success(uploaded === 1 ? "File uploaded successfully!" : `${uploaded} files uploaded!`);
        router.reload();
      }
    }
  };

  const typeTabs = [
    { id: "all", label: "All Types" },
    { id: "document", label: "Documents" },
    { id: "image", label: "Images" },
    { id: "video", label: "Videos" },
    { id: "audio", label: "Audio" },
    { id: "archive", label: "Archives" },
  ];

  const storageDisplay = formatStorageGB(storage?.totalUsed ?? 0, storage?.totalUsedBytes);

  return (
    <DashboardLayout title="Dashboard - Fylo" storage={storage} onSearch={setSearchQuery}>
      {/* Drag & Drop Overlay */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="space-y-6 relative"
      >
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-teal-950/80 border-2 border-dashed border-teal-400 rounded-3xl flex flex-col items-center justify-center p-8 backdrop-blur-sm pointer-events-none">
            <UploadCloud className="w-16 h-16 text-teal-400 animate-bounce mb-4" />
            <h3 className="text-xl font-bold text-white">Drop your files here to upload</h3>
            <p className="text-xs text-teal-200 mt-1">
              Supported documents, images, audio, video, and archives will be saved to your workspace
            </p>
          </div>
        )}

        {/* Welcome Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900/60 via-slate-900 to-[#0b1523] border border-slate-800 p-8 shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Private Cloud Workspace • Abuja, Nigeria</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              Store, organize, preview, and share your files in one cloud workspace. Drag &amp; drop
              files anywhere on this screen to upload immediately.
            </p>
          </div>
        </div>

        {/* Stats KPI Cards */}
        <StatsCards
          totalFiles={totalFiles}
          sharedFiles={totalShared}
          storageUsed={storageDisplay}
          downloads={downloads}
        />

        {/* Main Content Grid: Files & Sidebar Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Files List / Grid (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-slate-800 bg-[#202a3c] rounded-3xl shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-800/80 pb-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
                      <Files className="w-5 h-5 text-teal-400" />
                      <span>All Files ({filteredFiles.length})</span>
                    </CardTitle>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Filter by category, search by filename, or switch between Grid and List views
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
                      className="text-xs text-gray-300 hover:text-white"
                    >
                      <SortAsc className="h-4 w-4 mr-1 text-teal-400" />
                      <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
                    </Button>

                    <div className="flex border border-slate-700 rounded-lg overflow-hidden bg-[#0b1523]">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`h-8 px-2.5 rounded-none ${
                          viewMode === "grid"
                            ? "bg-teal-400 text-slate-950 font-bold"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`h-8 px-2.5 rounded-none ${
                          viewMode === "list"
                            ? "bg-teal-400 text-slate-950 font-bold"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Type Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {typeTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTypeFilter(tab.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                        typeFilter === tab.id
                          ? "bg-teal-400 text-slate-950 shadow"
                          : "bg-[#0b1523]/70 text-gray-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {filteredFiles.length === 0 ? (
                  <EmptyState
                    message={
                      searchQuery || typeFilter !== "all"
                        ? "No files match your current search or filter."
                        : "No files uploaded yet. Drag & drop files here or click Upload Files to get started!"
                    }
                  />
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

          {/* Quick Actions & Recent Activity (1 col) */}
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
