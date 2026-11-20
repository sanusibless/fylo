import { useState, useMemo } from "react";
import { Search, Users, Download, Eye, FileText, Image, Video, Music, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FileAction from "@/components/FileAction";
import FilePreviewModal from "@/components/FilePreviewModal";
import EmptyState from "@/components/EmptyState";
import { Link } from "@inertiajs/react";
import { getFileIcon, getFileColor } from "@/components/FileCard";
import { type SharedFileItem, type StorageUsage, type PaginatedData, type FileItem } from "@/types";
import { cn } from "@/lib/utils";

interface SharedFilesListProps {
  sharedFiles: PaginatedData<SharedFileItem>;
  storage?: StorageUsage;
}

export default function SharedFilesList({ sharedFiles, storage }: SharedFilesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

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
    <DashboardLayout title="Shared with Me - Fylo" storage={storage} onSearch={setSearchQuery}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Shared with Me</h1>
              <p className="text-xs text-gray-400">
                Documents and assets shared with you by other team members
              </p>
            </div>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search shared files or teammates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#202a3c] border-slate-800 text-white placeholder:text-gray-500 text-xs"
            />
          </div>
        </div>

        {/* Shared Files Table */}
        <div className="bg-[#202a3c] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          {filteredFiles.length === 0 ? (
            <div className="p-8">
              <EmptyState
                message={
                  searchQuery
                    ? `No files match "${searchQuery}"`
                    : "No files have been shared with you yet."
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#1c2431]">
                    <th className="py-3.5 px-4 font-semibold text-white">File Name</th>
                    <th className="py-3.5 px-4 font-semibold text-white">Shared By</th>
                    <th className="py-3.5 px-4 font-semibold text-white">File Size</th>
                    <th className="py-3.5 px-4 font-semibold text-white">Date Shared</th>
                    <th className="py-3.5 px-4 font-semibold text-white text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredFiles.map((item, idx) => {
                    const FileIcon = getFileIcon(item.file?.type || "document");
                    const iconColor = getFileColor(item.file?.type || "document");
                    return (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4">
                          <div
                            className="flex items-center space-x-3 cursor-pointer"
                            onClick={() => setPreviewFile(item.file)}
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#0b1523] border border-slate-800 flex items-center justify-center shrink-0">
                              <FileIcon className={cn("h-4 w-4", iconColor)} />
                            </div>
                            <span className="font-semibold text-white text-sm hover:text-teal-300 transition truncate max-w-xs">
                              {item.file?.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white">{item.sharedBy?.name || "User"}</div>
                          <div className="text-[11px] text-gray-400">{item.sharedBy?.email}</div>
                        </td>

                        <td className="py-3.5 px-4 text-gray-400">
                          {item.file?.size_in_mb || item.file?.size_in_kb}
                        </td>

                        <td className="py-3.5 px-4 text-gray-400 font-mono">
                          {item.sharedDate}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setPreviewFile(item.file)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 hover:bg-slate-800 transition"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <FileAction file={item.file} action="download" view="list" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        <FilePreviewModal
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />

        {/* Pagination */}
        {sharedFiles?.links && sharedFiles.links.length > 3 && (
          <div className="flex justify-center space-x-1 pt-4">
            {sharedFiles.links.map((link, idx) => (
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
