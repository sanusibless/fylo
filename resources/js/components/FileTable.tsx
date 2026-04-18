import FileAction from "./FileAction";
import { FileCardProps} from "./FileCard";
import {
    FileText,
    Image,
    Video,
    Music,
    Archive
  } from "lucide-react";

export const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'archive': return Archive;
      default: return FileText;
    }
  };


export default function FileTable({ files } : { files: FileCardProps[] }) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Downloads</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file, index) =>
            {
                const FileIcon = getFileIcon(file.type);
                return (
                    <tr
                key={index}
                className="border-b"
              >
                {/* NAME */}
                <td className="py-3 px-4 flex items-center gap-3">
                  <span><FileIcon /></span>
                  <span className="truncate">{file.name}</span>
                </td>

                {/* SIZE */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {file.size_in_mb}
                </td>

                {/* DOWNLOADS */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {file.total_downloads} download(s)
                </td>

                {/* ACTIONS */}
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center">
                    <FileAction action="star" file={file} />
                    <FileAction action="download" file={file} view="list" />
                    <FileAction action="delete" file={file} view="list" />
                    <FileAction action="edit" file={file}  view="list" />
                  </div>
                </td>
              </tr>
                )
            }
        )}
          </tbody>
        </table>
      </div>
    );
  }
