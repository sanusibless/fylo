import { useState } from "react";
import FileAction from "./FileAction";
import { getFileIcon, getFileColor } from "./FileCard";
import FilePreviewModal from "./FilePreviewModal";
import PublicShareModal from "./PublicShareModal";
import MoveFileModal from "./MoveFileModal";
import { type FileItem } from "@/types";
import { cn } from "@/lib/utils";
import { Eye, Link as LinkIcon, FolderInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

interface FileTableProps {
  files: FileItem[];
  isTrash?: boolean;
}

export default function FileTable({ files, isTrash = false }: FileTableProps) {
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [publicShareFile, setPublicShareFile] = useState<FileItem | null>(null);
  const [moveFile, setMoveFile] = useState<FileItem | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-[#1c2431]">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0b1523]/70 text-gray-400 text-xs uppercase">
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4">Downloads</th>
              <th className="py-3.5 px-4">Uploaded</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const iconColor = getFileColor(file.type);

              return (
                <tr
                  key={file.uuid || file.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* NAME */}
                  <td className="py-3 px-4">
                    <div
                      onClick={() => !isTrash && setPreviewFile(file)}
                      className={cn(
                        "flex items-center gap-3 min-w-0 max-w-md",
                        !isTrash && "cursor-pointer group"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0b1523] border border-slate-800 flex items-center justify-center shrink-0">
                        <FileIcon className={cn("h-4 w-4 flex-shrink-0", iconColor)} />
                      </div>
                      <div className="truncate">
                        <span
                          className="font-medium text-white group-hover:text-teal-300 transition truncate block text-xs"
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        {file.folder && (
                          <span className="text-[10px] text-teal-400">
                            Folder: {file.folder.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* SIZE */}
                  <td className="py-3 px-4 whitespace-nowrap text-gray-400 text-xs">
                    {typeof file.size_in_mb === "number"
                      ? `${file.size_in_mb} MB`
                      : file.size_in_mb || file.size_in_kb || ""}
                  </td>

                  {/* DOWNLOADS */}
                  <td className="py-3 px-4 whitespace-nowrap text-gray-400 text-xs font-mono">
                    {file.total_downloads ?? file.downloads ?? 0}
                  </td>

                  {/* DATE */}
                  <td className="py-3 px-4 whitespace-nowrap text-gray-400 text-xs">
                    {file.formatted_date || file.created_at}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end space-x-1">
                      {!isTrash ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewFile(file)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-teal-400"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <FileAction action="star" file={file} view="list" />
                          <FileAction action="download" file={file} view="list" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPublicShareFile(file)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-cyan-400"
                            title="Public Share Link"
                          >
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <FileAction action="share" file={file} view="list" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMoveFile(file)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-amber-400"
                            title="Move to Folder"
                          >
                            <FolderInput className="h-4 w-4" />
                          </Button>
                          <FileAction action="edit" file={file} view="list" />
                          <FileAction action="delete" file={file} view="list" />
                        </>
                      ) : (
                        <>
                          <FileAction action="restore" file={file} view="list" />
                          <FileAction action="force_delete" file={file} view="list" />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
      <PublicShareModal
        file={publicShareFile}
        isOpen={!!publicShareFile}
        onClose={() => setPublicShareFile(null)}
        onUpdated={() => router.reload()}
      />
      <MoveFileModal
        file={moveFile}
        isOpen={!!moveFile}
        onClose={() => setMoveFile(null)}
        onMoved={() => router.reload()}
      />
    </>
  );
}
