import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Link as LinkIcon,
  Copy,
  Check,
  Lock,
  Calendar,
  AlertCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { type FileItem } from "@/types";
import axios from "axios";

interface PublicShareModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function PublicShareModal({
  file,
  isOpen,
  onClose,
  onUpdated,
}: PublicShareModalProps) {
  const [password, setPassword] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("7");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(
    file?.share_token ? `${window.location.origin}/s/${file.share_token}` : null
  );
  const [hasPassword, setHasPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!file) return null;

  const currentShareUrl =
    shareUrl || (file.share_token ? `${window.location.origin}/s/${file.share_token}` : null);

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await axios.post(`/file/${file.uuid}/public-share`, {
        password: password || null,
        expires_in_days: expiresInDays ? parseInt(expiresInDays, 10) : null,
      });

      if (response.data?.status) {
        setShareUrl(response.data.share_url);
        setHasPassword(response.data.has_password);
        setStatusMessage("Public share link created successfully!");
        onUpdated?.();
      }
    } catch (err: any) {
      setStatusMessage(err.response?.data?.message || "Failed to generate link.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeLink = async () => {
    if (!confirm("Are you sure you want to revoke this public link? External visitors will immediately lose access.")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/file/${file.uuid}/revoke-public-share`);
      setShareUrl(null);
      setPassword("");
      setStatusMessage("Public link has been revoked.");
      onUpdated?.();
    } catch (err: any) {
      setStatusMessage("Failed to revoke link.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentShareUrl) return;
    navigator.clipboard.writeText(currentShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#1c2431] border border-slate-700 text-white p-6 rounded-3xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white">Share via Link</DialogTitle>
              <p className="text-xs text-gray-400 truncate max-w-[280px]">{file.name}</p>
            </div>
          </div>
        </DialogHeader>

        {statusMessage && (
          <div className="my-2 p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs">
            {statusMessage}
          </div>
        )}

        {currentShareUrl ? (
          <div className="space-y-5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Shareable Public URL</Label>
              <div className="flex items-center space-x-2">
                <Input
                  readOnly
                  value={currentShareUrl}
                  className="bg-[#0b1523] border-slate-700 text-white font-mono text-xs selection:bg-teal-400"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopy}
                  className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 p-3 rounded-xl bg-[#0b1523]/60 border border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Link is active &amp; ready for sharing</span>
              </div>
              <a
                href={currentShareUrl}
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:underline inline-flex items-center space-x-1"
              >
                <span>Preview</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={handleRevokeLink}
              disabled={loading}
              className="w-full text-xs font-semibold py-2"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Revoke Public Link</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleGenerateLink} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="expire-days" className="text-xs font-semibold text-gray-300 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                Link Expiration
              </Label>
              <select
                id="expire-days"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                className="w-full bg-[#0b1523] border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="1">Expires in 24 Hours</option>
                <option value="7">Expires in 7 Days</option>
                <option value="30">Expires in 30 Days</option>
                <option value="90">Expires in 90 Days</option>
                <option value="">Never Expires</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="link-pass" className="text-xs font-semibold text-gray-300 flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                Password Protection (Optional)
              </Label>
              <Input
                id="link-pass"
                type="password"
                placeholder="Leave blank for public access"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500 text-xs"
              />
              <p className="text-[11px] text-gray-400">
                Visitors will be required to enter this password before viewing or downloading.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition"
            >
              {loading ? "Generating..." : "Generate Public Share Link"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
