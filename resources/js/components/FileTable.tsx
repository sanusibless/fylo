import FileAction from "./FileAction";
import { getFileIcon, getFileColor } from "./FileCard";
import { type FileItem } from "@/types";
import { cn } from "@/lib/utils";

interface FileTableProps {
  files: FileItem[];
  isTrash?: boolean;
}

export default function FileTable({ files, isTrash = false }: FileTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs uppercase">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Size</th>
            <th className="py-3 px-4">Downloads</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            const iconColor = getFileColor(file.type);

            return (
              <tr
                key={file.uuid || file.id}
                className="hover:bg-muted/50 transition-colors"
              >
                {/* NAME */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3 min-w-0 max-w-md">
                    <FileIcon className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
                    <span className="font-medium text-foreground truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                </td>

                {/* SIZE */}
                <td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-xs">
                  {typeof file.size_in_mb === 'number' ? `${file.size_in_mb} MB` : (file.size_in_mb || file.size_in_kb || '')}
                </td>

                {/* DOWNLOADS */}
                <td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-xs">
                  {file.total_downloads ?? file.downloads ?? 0}
                </td>

                {/* ACTIONS */}
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-1">
                    {!isTrash ? (
                      <>
                        <FileAction action="star" file={file} view="list" />
                        <FileAction action="download" file={file} view="list" />
                        <FileAction action="share" file={file} view="list" />
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
  );
}
