import { useState } from "react";
import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Edit2,
  Loader2,
  Eye,
  Link as LinkIcon,
  FolderInput,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import FileAction from "./FileAction";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import AutoCompleteSearchInput from "./AutoCompleteSearchInput";
import FilePreviewModal from "./FilePreviewModal";
import PublicShareModal from "./PublicShareModal";
import MoveFileModal from "./MoveFileModal";
import { type FileItem } from "@/types";

export interface FileCardProps {
  file: FileItem;
  view?: 'grid' | 'list';
  isTrash?: boolean;
}

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

export const getFileColor = (type: string) => {
  switch (type) {
    case 'document': return 'text-blue-400';
    case 'image': return 'text-teal-400';
    case 'video': return 'text-purple-400';
    case 'audio': return 'text-pink-400';
    case 'archive': return 'text-amber-400';
    default: return 'text-muted-foreground';
  }
};

export const removeExtension = (fileName: string) => {
  const parts = fileName.split('.');
  if (parts.length > 1) {
    parts.pop();
    return parts.join('.');
  }
  return fileName;
};

const shareFileFormSchema = z.object({
  file_uuid: z.string(),
  receiver_email: z.string().email("Please enter a valid email address"),
});

const deleteFileFormSchema = z.object({
  file_uuid: z.string(),
  name: z.string(),
});

const editFileFormSchema = z.object({
  name: z.string().min(1, "File name is required"),
  file_uuid: z.string(),
});

type ShareFileFormValues = z.infer<typeof shareFileFormSchema>;
type DeleteFileFormValues = z.infer<typeof deleteFileFormSchema>;
type EditFileFormValues = z.infer<typeof editFileFormSchema>;

export function FileCard({ file, view = 'grid', isTrash = false }: FileCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublicShareOpen, setIsPublicShareOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const FileIcon = getFileIcon(file.type);
  const iconColor = getFileColor(file.type);

  const shareForm = useForm<ShareFileFormValues>({
    resolver: zodResolver(shareFileFormSchema),
    defaultValues: {
      file_uuid: file.uuid,
      receiver_email: '',
    },
  });

  const deleteForm = useForm<DeleteFileFormValues>({
    resolver: zodResolver(deleteFileFormSchema),
    defaultValues: {
      file_uuid: file.uuid,
      name: '',
    },
  });

  const editForm = useForm<EditFileFormValues>({
    resolver: zodResolver(editFileFormSchema),
    defaultValues: {
      name: removeExtension(file.name),
      file_uuid: file.uuid,
    },
  });

  const onShareFileSubmit = (data: ShareFileFormValues) => {
    setIsProcessing(true);
    router.post(route('file.share'), data, {
      onSuccess: () => {
        setIsProcessing(false);
        setIsShareOpen(false);
        shareForm.reset();
        toast.success("File shared successfully");
      },
      onError: (errors: any) => {
        setIsProcessing(false);
        toast.error(errors.receiver_email || errors.file || "Failed to share file");
      },
    });
  };

  const onEditFileSubmit = (data: EditFileFormValues) => {
    setIsProcessing(true);
    router.put(route('file.update', { file_uuid: file.uuid }), {
      file_uuid: file.uuid,
      name: data.name,
    }, {
      onSuccess: () => {
        setIsProcessing(false);
        setIsEditOpen(false);
        toast.success("File renamed successfully");
      },
      onError: (errors: any) => {
        setIsProcessing(false);
        toast.error(errors.name || errors.file || "Failed to rename file");
      },
    });
  };

  const onDeleteFileSubmit = () => {
    setIsProcessing(true);
    router.delete(route('file.delete', { file_uuid: file.uuid }), {
      onSuccess: () => {
        setIsProcessing(false);
        setOpenDeleteModal(false);
        toast.success("File moved to trash");
      },
      onError: () => {
        setIsProcessing(false);
        toast.error("Failed to delete file");
      },
    });
  };

  // Modals Bundle
  const modals = (
    <>
      <FilePreviewModal
        file={file}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
      <PublicShareModal
        file={file}
        isOpen={isPublicShareOpen}
        onClose={() => setIsPublicShareOpen(false)}
      />
      <MoveFileModal
        file={file}
        isOpen={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
      />

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="bg-[#1c2431] border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Share "{file.name}" with User</DialogTitle>
          </DialogHeader>
          <Form {...shareForm}>
            <form onSubmit={shareForm.handleSubmit(onShareFileSubmit)} className="space-y-4">
              <FormField
                control={shareForm.control}
                name="receiver_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-300">Recipient Email</FormLabel>
                    <FormControl>
                      <AutoCompleteSearchInput
                        value={field.value}
                        onSelect={(email) => shareForm.setValue('receiver_email', email)}
                        disabled={isProcessing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isProcessing} className="bg-slate-800 border-slate-700 text-white">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isProcessing} className="bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold">
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Share
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#1c2431] border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Rename "{file.name}"</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditFileSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-300">New File Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isProcessing} className="bg-[#0b1523] border-slate-700 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isProcessing} className="bg-slate-800 border-slate-700 text-white">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isProcessing} className="bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold">
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Rename
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Move to Trash Dialog */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="bg-[#1c2431] border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Move to Trash?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-gray-400">
            "{file.name}" will be moved to Trash. You can restore it anytime within your retention window.
          </p>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDeleteModal(false)}
              disabled={isProcessing}
              className="bg-slate-800 border-slate-700 text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteFileSubmit}
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Move to Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // List View
  if (view === 'list') {
    return (
      <div className="flex items-center justify-between p-3.5 hover:bg-slate-800/40 rounded-xl transition-colors border border-transparent hover:border-slate-800">
        <div
          className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
          onClick={() => !isTrash && setIsPreviewOpen(true)}
        >
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
            <FileIcon className={cn("h-5 w-5", iconColor)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate hover:text-teal-300 transition" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-gray-400">{file.formatted_date || file.created_at}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {file.size_in_mb || file.size_in_kb}
          </span>

          <div className="flex items-center space-x-1">
            {!isTrash ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-teal-400"
                  onClick={() => setIsPreviewOpen(true)}
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <FileAction file={file} action="star" view="list" />
                <FileAction file={file} action="download" view="list" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1c2431] border-slate-700 text-white">
                    <DropdownMenuItem onSelect={() => setIsPreviewOpen(true)}>
                      <Eye className="mr-2 h-4 w-4 text-teal-400" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsPublicShareOpen(true)}>
                      <LinkIcon className="mr-2 h-4 w-4 text-cyan-400" /> Public Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsShareOpen(true)}>
                      <Share2 className="mr-2 h-4 w-4 text-blue-400" /> Direct User Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsMoveOpen(true)}>
                      <FolderInput className="mr-2 h-4 w-4 text-amber-400" /> Move to Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                      <Edit2 className="mr-2 h-4 w-4 text-emerald-400" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem className="text-rose-400 focus:text-rose-300" onSelect={() => setOpenDeleteModal(true)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-1">
                <FileAction file={file} action="restore" view="list" />
                <FileAction file={file} action="force_delete" view="list" />
              </div>
            )}
          </div>
        </div>

        {modals}
      </div>
    );
  }

  // Grid View
  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-200 border-slate-800 bg-[#202a3c] overflow-hidden hover:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div
              className="w-12 h-12 rounded-xl bg-[#0b1523] border border-slate-800 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform"
              onClick={() => !isTrash && setIsPreviewOpen(true)}
            >
              <FileIcon className={cn("h-6 w-6", iconColor)} />
            </div>

            <div className="flex items-center space-x-1">
              {!isTrash ? (
                <>
                  <FileAction file={file} action="star" view="grid" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1c2431] border-slate-700 text-white">
                      <DropdownMenuItem onSelect={() => setIsPreviewOpen(true)}>
                        <Eye className="mr-2 h-4 w-4 text-teal-400" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => window.location.href = route('file.download', { file_uuid: file.uuid })}>
                        <Download className="mr-2 h-4 w-4 text-blue-400" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsPublicShareOpen(true)}>
                        <LinkIcon className="mr-2 h-4 w-4 text-cyan-400" /> Public Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsShareOpen(true)}>
                        <Share2 className="mr-2 h-4 w-4 text-indigo-400" /> Direct User Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsMoveOpen(true)}>
                        <FolderInput className="mr-2 h-4 w-4 text-amber-400" /> Move to Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                        <Edit2 className="mr-2 h-4 w-4 text-emerald-400" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem className="text-rose-400 focus:text-rose-300" onSelect={() => setOpenDeleteModal(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Move to Trash
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-1">
                  <FileAction file={file} action="restore" view="grid" />
                  <FileAction file={file} action="force_delete" view="grid" />
                </div>
              )}
            </div>
          </div>

          <div
            className="mt-4 cursor-pointer"
            onClick={() => !isTrash && setIsPreviewOpen(true)}
          >
            <h3 className="font-semibold text-sm text-white truncate group-hover:text-teal-300 transition" title={file.name}>
              {file.name}
            </h3>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{file.size_in_mb || file.size_in_kb}</span>
              <span>{file.formatted_date || file.created_at}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {modals}
    </>
  );
}

export default FileCard;
