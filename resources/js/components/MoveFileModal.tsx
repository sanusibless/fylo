import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Folder, FolderInput, Check, HardDrive } from "lucide-react";
import { type FileItem, type FolderItem } from "@/types";
import axios from "axios";

interface MoveFileModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onMoved?: () => void;
}

export default function MoveFileModal({
  file,
  isOpen,
  onClose,
  onMoved,
}: MoveFileModalProps) {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(file?.folder_id ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      axios.get('/folders', { headers: { Accept: 'application/json' } })
        .then((res) => {
          if (res.data?.allFolders) {
            setFolders(res.data.allFolders);
          }
        })
        .catch(() => {});
      setSelectedFolderId(file?.folder_id ?? null);
      setError(null);
    }
  }, [isOpen, file]);

  if (!file) return null;

  const handleMove = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.post(`/file/${file.uuid}/move`, {
        folder_id: selectedFolderId,
      });

      onMoved?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to move file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#1c2431] border border-slate-700 text-white p-6 rounded-3xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <FolderInput className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white">Move File</DialogTitle>
              <p className="text-xs text-gray-400 truncate max-w-[280px]">{file.name}</p>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
          {/* Root directory option */}
          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm transition ${
              selectedFolderId === null
                ? "bg-teal-500/20 border border-teal-500/40 text-teal-300 font-semibold"
                : "bg-[#0b1523]/60 hover:bg-[#0b1523] border border-slate-800 text-gray-300"
            }`}
          >
            <span className="flex items-center space-x-2.5">
              <HardDrive className="w-4 h-4 text-teal-400" />
              <span>Root Drive (All Files)</span>
            </span>
            {selectedFolderId === null && <Check className="w-4 h-4 text-teal-400" />}
          </button>

          {/* User folders */}
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => setSelectedFolderId(folder.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm transition ${
                selectedFolderId === folder.id
                  ? "bg-teal-500/20 border border-teal-500/40 text-teal-300 font-semibold"
                  : "bg-[#0b1523]/60 hover:bg-[#0b1523] border border-slate-800 text-gray-300"
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <Folder className="w-4 h-4 text-teal-400" />
                <span>{folder.name}</span>
              </span>
              {selectedFolderId === folder.id && <Check className="w-4 h-4 text-teal-400" />}
            </button>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={handleMove}
            className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl shadow"
          >
            {loading ? "Moving..." : "Move Here"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
