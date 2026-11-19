import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, FileText, Image as ImageIcon, Video, Music, Archive, Loader2 } from "lucide-react";
import { type FileItem } from "@/types";

interface FilePreviewModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  previewUrl?: string;
  downloadUrl?: string;
}

export default function FilePreviewModal({
  file,
  isOpen,
  onClose,
  previewUrl,
  downloadUrl,
}: FilePreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(false);

  const ext = file?.extension?.toLowerCase() || file?.name.split(".").pop()?.toLowerCase() || "";
  const isText = ["txt", "csv", "json", "md", "xml", "log", "rtf"].includes(ext);
  const resolvedPreviewUrl = file ? previewUrl || `/file/${file.uuid}/preview` : "";
  const resolvedDownloadUrl = file ? downloadUrl || `/file/${file.uuid}/download` : "";

  useEffect(() => {
    if (isOpen && file && isText && resolvedPreviewUrl) {
      setLoadingText(true);
      fetch(resolvedPreviewUrl)
        .then((res) => (res.ok ? res.text() : Promise.reject()))
        .then((txt) => setTextContent(txt.slice(0, 100000)))
        .catch(() => setTextContent("Unable to load text preview."))
        .finally(() => setLoadingText(false));
    } else {
      setTextContent(null);
    }
  }, [isOpen, file, isText, resolvedPreviewUrl]);

  if (!file) return null;

  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext) || file.type === "image";
  const isVideo = ["mp4", "webm", "ogg", "mov", "mkv"].includes(ext) || file.type === "video";
  const isAudio = ["mp3", "wav", "ogg", "m4a", "flac"].includes(ext) || file.type === "audio";
  const isPdf = ext === "pdf";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#1c2431] border border-slate-700 text-white p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-4 bg-[#0b1523] border-b border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden pr-6">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
              {isImage && <ImageIcon className="w-5 h-5" />}
              {isVideo && <Video className="w-5 h-5" />}
              {isAudio && <Music className="w-5 h-5" />}
              {isPdf && <FileText className="w-5 h-5 text-rose-400" />}
              {!isImage && !isVideo && !isAudio && !isPdf && <FileText className="w-5 h-5" />}
            </div>
            <div className="truncate">
              <DialogTitle className="text-base font-semibold truncate text-white">
                {file.name}
              </DialogTitle>
              <div className="text-xs text-gray-400 flex items-center space-x-3 mt-0.5">
                <span>{file.size_in_mb || file.size_in_kb}</span>
                <span>•</span>
                <span>{file.formatted_date || file.created_at || "Recently uploaded"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 pr-8">
            <a
              href={resolvedDownloadUrl}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </DialogHeader>

        {/* Content Viewer Body */}
        <div className="p-6 flex items-center justify-center min-h-[350px] max-h-[70vh] overflow-auto bg-[#141b25]/60">
          {isImage && (
            <div className="flex flex-col items-center space-y-3">
              <img
                src={resolvedPreviewUrl}
                alt={file.name}
                style={{ transform: `scale(${zoom})`, transition: "transform 0.2s" }}
                className="max-h-[55vh] max-w-full rounded-lg object-contain shadow-lg"
              />
              <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="px-2 py-0.5 text-gray-300 hover:text-white"
                >
                  -
                </button>
                <span className="font-mono text-teal-400">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                  className="px-2 py-0.5 text-gray-300 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {isVideo && (
            <video
              controls
              autoPlay
              src={resolvedPreviewUrl}
              className="max-h-[55vh] max-w-full rounded-lg shadow-xl"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {isAudio && (
            <div className="w-full max-w-md p-6 bg-[#202a3c] rounded-2xl border border-slate-700 flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 animate-pulse">
                <Music className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-white">{file.name}</p>
              <audio controls src={resolvedPreviewUrl} className="w-full">
                Your browser does not support audio playback.
              </audio>
            </div>
          )}

          {isPdf && (
            <iframe
              src={resolvedPreviewUrl}
              title={file.name}
              className="w-full h-[55vh] rounded-lg border border-slate-700 bg-white"
            />
          )}

          {isText && !isImage && !isVideo && !isAudio && !isPdf && (
            <div className="w-full h-[55vh] rounded-xl border border-slate-700 bg-[#0b1523] p-4 overflow-auto">
              {loadingText ? (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin mr-2 text-teal-400" />
                  Loading document contents...
                </div>
              ) : (
                <pre className="text-xs font-mono text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
                  {textContent}
                </pre>
              )}
            </div>
          )}

          {!isImage && !isVideo && !isAudio && !isPdf && !isText && (
            <div className="text-center py-12 px-6 max-w-md space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-teal-400">
                <Archive className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">{file.name}</h4>
              <p className="text-xs text-gray-400">
                Direct in-browser preview is not available for this file format ({ext.toUpperCase() || "Binary"}). You can download and open it on your device.
              </p>
              <a
                href={resolvedDownloadUrl}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download File ({file.size_in_mb || file.size_in_kb})</span>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
