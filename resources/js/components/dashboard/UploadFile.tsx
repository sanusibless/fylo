"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { LoaderCircle, Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { route } from "ziggy-js";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";
import { type SharedData } from "@/types";
import axios from "axios";

interface UploadFileProps {
  folderId?: number | null;
  triggerLabel?: string;
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export default function UploadFile({
  folderId = null,
  triggerLabel = "Upload Files",
  externalOpen,
  onExternalOpenChange,
  hideTrigger = false,
}: UploadFileProps) {
  const { storage, appConfig } = usePage<SharedData>().props;
  const maxFileSizeMB = Number(storage?.maxFileSizeMB || appConfig?.maxDefaultUploadMB || 50);
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onExternalOpenChange || setInternalOpen;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const list = e.target.files;
    if (!list || list.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (f.size > maxFileSizeBytes) {
        setErrorMsg(`"${f.name}" exceeds your plan's ${maxFileSizeMB} MB single-file upload limit.`);
        return;
      }
      validFiles.push(f);
    }
    setSelectedFiles(validFiles);
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMsg("Please select at least one file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setUploadProgress(0);

    let uploadedCount = 0;
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);
        if (folderId) {
          formData.append("folder_id", String(folderId));
        }

        await axios.post(route("file.upload"), formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const singlePercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              const overall = Math.round(((i + singlePercent / 100) / selectedFiles.length) * 100);
              setUploadProgress(overall);
            }
          },
        });
        uploadedCount++;
      }

      toast.success(
        uploadedCount === 1
          ? "File uploaded successfully"
          : `${uploadedCount} files uploaded successfully`
      );
      setSelectedFiles([]);
      setUploadProgress(0);
      setIsOpen(false);
      router.reload();
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.file?.[0] ||
        err.response?.data?.message ||
        "Failed to upload file.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isUploading) {
          setIsOpen(open);
          if (!open) {
            setSelectedFiles([]);
            setErrorMsg(null);
            setUploadProgress(0);
          }
        }
      }}
    >
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-md">
            <Upload className="mr-2 h-4 w-4" />
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md bg-[#1c2431] border border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Upload Files to Fylo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-teal-400/60 bg-[#0b1523]/70 rounded-2xl p-6 text-center cursor-pointer transition"
          >
            <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">
              Click to select one or multiple files
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Max {maxFileSizeMB} MB per file ({storage?.planName || "Free"} Plan)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              disabled={isUploading}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.rtf,.odt,.md,.json,.mp4,.mov,.avi,.webm,.mp3,.wav,.ogg,.m4a,.zip,.rar,.7z,.tar,.gz"
              className="hidden"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {selectedFiles.map((f, idx) => (
                <div
                  key={`${f.name}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b1523] border border-slate-800 text-xs"
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="text-white truncate">{f.name}</span>
                    <span className="text-gray-400 shrink-0">({formatBytes(f.size)})</span>
                  </div>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="text-gray-400 hover:text-rose-400 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Uploading {selectedFiles.length} file(s)...</span>
                <span className="font-mono text-teal-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#0b1523] rounded-full h-2 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-teal-400 to-blue-500 h-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <DialogFooter>
            {!isUploading ? (
              <div className="flex items-center justify-end space-x-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="bg-slate-800 border-slate-700 text-white text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={selectedFiles.length === 0}
                  className="bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-end w-full py-1">
                <LoaderCircle className="h-4 w-4 animate-spin text-teal-400 mr-2" />
                <span className="text-xs text-gray-300">Uploading to cloud storage...</span>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
