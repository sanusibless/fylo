import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  Download,
  Lock,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  ShieldCheck,
  Eye,
  AlertTriangle,
  ArrowRight,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";

interface PublicShareProps {
  file?: {
    name: string;
    extension: string;
    mime_type: string;
    size_in_mb: string;
    size_in_kb: string;
    total_downloads: string | number;
    created_at: string;
    expires_at?: string;
    uploader_name: string;
  };
  token?: string;
  requiresPassword?: boolean;
  error?: string;
}

export default function PublicShare({
  file,
  token,
  requiresPassword,
  error,
}: PublicShareProps) {
  const [showPreview, setShowPreview] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    password: "",
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    post(`/s/${token}/verify`);
  };

  const ext = file?.extension?.toLowerCase() || file?.name?.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);
  const isAudio = ["mp3", "wav", "ogg", "m4a"].includes(ext);
  const isPdf = ext === "pdf";

  const downloadUrl = token ? `/s/${token}/download` : "#";
  const previewUrl = token ? `/s/${token}/preview` : "#";

  return (
    <div className="min-h-screen bg-[#0b1523] text-white flex flex-col justify-between selection:bg-teal-400 selection:text-slate-900 font-sans">
      <Head title={file ? `${file.name} - Shared via Fylo` : "Shared File - Fylo"} />

      {/* Top Header */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-[#0b1523]/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/logo.svg" alt="Fylo Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-2 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold">Encrypted Cloud Transfer</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
          {/* Error State */}
          {error && (
            <div className="bg-[#1c2431] border border-rose-500/30 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Link Unavailable</h2>
              <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">{error}</p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold border border-slate-700 transition"
                >
                  <span>Go to Fylo Homepage</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Password Prompt State */}
          {!error && requiresPassword && (
            <div className="bg-[#1c2431] border border-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Password Protected File</h2>
                <p className="text-xs text-gray-400 mt-1">
                  The owner has protected this document. Enter the access password to continue.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4 text-left">
                <div>
                  <Input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter access password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500"
                  />
                  <InputError message={errors.password} className="mt-1.5" />
                </div>
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition"
                >
                  {processing ? "Verifying..." : "Unlock File"}
                </Button>
              </form>
            </div>
          )}

          {/* Unlocked / Ready to Download State */}
          {!error && !requiresPassword && file && (
            <div className="bg-[#1c2431] border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
              {/* File Header */}
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  {isImage && <ImageIcon className="w-7 h-7" />}
                  {isVideo && <Video className="w-7 h-7" />}
                  {isAudio && <Music className="w-7 h-7" />}
                  {isPdf && <FileText className="w-7 h-7 text-rose-400" />}
                  {!isImage && !isVideo && !isAudio && !isPdf && <FileText className="w-7 h-7" />}
                </div>

                <div className="truncate flex-1">
                  <h2 className="text-xl font-bold text-white truncate" title={file.name}>
                    {file.name}
                  </h2>
                  <div className="text-xs text-gray-400 flex items-center space-x-3 mt-1.5">
                    <span>{file.size_in_mb || file.size_in_kb}</span>
                    <span>•</span>
                    <span>Shared by {file.uploader_name}</span>
                  </div>
                </div>
              </div>

              {/* In-Browser Preview Section (if toggled or supported) */}
              {showPreview ? (
                <div className="rounded-2xl overflow-hidden border border-slate-700 bg-[#0b1523] p-4 flex items-center justify-center min-h-[250px]">
                  {isImage && (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="max-h-[40vh] max-w-full rounded-lg object-contain shadow"
                    />
                  )}
                  {isVideo && (
                    <video controls autoPlay src={previewUrl} className="max-h-[40vh] max-w-full rounded-lg" />
                  )}
                  {isAudio && (
                    <div className="w-full p-4 space-y-2">
                      <audio controls src={previewUrl} className="w-full" />
                    </div>
                  )}
                  {isPdf && (
                    <iframe
                      src={previewUrl}
                      title={file.name}
                      className="w-full h-[45vh] rounded-lg border border-slate-700"
                    />
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#0b1523]/70 border border-slate-800 text-xs text-gray-400 flex items-center justify-between">
                  <span>Uploaded on {file.created_at}</span>
                  {(isImage || isVideo || isAudio || isPdf) && (
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      className="text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview in Browser</span>
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={downloadUrl}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.01]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File ({file.size_in_mb || file.size_in_kb})</span>
                </a>

                {showPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPreview(false)}
                    className="w-full text-xs text-gray-400 hover:text-white"
                  >
                    Hide Preview
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="py-6 border-t border-slate-800/80 text-center text-xs text-gray-500">
        <p className="flex items-center justify-center space-x-1.5">
          <span>Powered by</span>
          <Link href="/" className="text-teal-400 font-bold hover:underline">
            Fylo Cloud Storage
          </Link>
          <span>• Fast, Secure, Accessible Anywhere</span>
        </p>
      </footer>
    </div>
  );
}
