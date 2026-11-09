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
    case 'image': return 'text-green-400';
    case 'video': return 'text-purple-400';
    case 'audio': return 'text-pink-400';
    case 'archive': return 'text-orange-400';
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

export const shortFileName = (fileName: string) => {
  const name = removeExtension(fileName);
  return name.length > 24 ? `${name.substring(0, 24)}...` : name;
};

const shareFileFormSchema = z.object({
  file_uuid: z.string(),
  receiver_email: z.string().email("Please enter a valid email address"),
});

const deleteFileFormSchema = z.object({
  file_uuid: z.string(),
  confirmation_text: z.string().refine((val) => val.toLowerCase() === "delete", {
    message: "Type 'delete' to confirm",
  }),
});

const editFileFormSchema = z.object({
  file_uuid: z.string(),
  name: z.string().min(1, "Name cannot be empty").max(255),
});

export function FileCard({ file, view = 'grid', isTrash = false }: FileCardProps) {
  const FileIcon = getFileIcon(file.type);
  const iconColor = getFileColor(file.type);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const shareForm = useForm<z.infer<typeof shareFileFormSchema>>({
    resolver: zodResolver(shareFileFormSchema),
    defaultValues: {
      file_uuid: file.uuid,
      receiver_email: '',
    },
  });

  const deleteForm = useForm<z.infer<typeof deleteFileFormSchema>>({
    resolver: zodResolver(deleteFileFormSchema),
    defaultValues: {
      file_uuid: file.uuid,
      confirmation_text: '',
    },
  });

  const editForm = useForm<z.infer<typeof editFileFormSchema>>({
    resolver: zodResolver(editFileFormSchema),
    defaultValues: {
      file_uuid: file.uuid,
      name: removeExtension(file.name),
    },
  });

  const onEditFileSubmit = (values: z.infer<typeof editFileFormSchema>) => {
    setIsProcessing(true);
    router.put(route('file.update', { file_uuid: values.file_uuid }), values, {
      onSuccess: () => {
        setIsProcessing(false);
        setIsEditOpen(false);
        toast.success('File renamed successfully');
      },
      onError: (errors: any) => {
        setIsProcessing(false);
        toast.error(errors.name || errors.file || 'Unable to update file');
      },
    });
  };

  const onShareFileSubmit = (values: z.infer<typeof shareFileFormSchema>) => {
    setIsProcessing(true);
    router.post(route('file.share'), values, {
      onSuccess: () => {
        setIsProcessing(false);
        setIsShareOpen(false);
        shareForm.reset();
        toast.success('File shared successfully');
      },
      onError: (errors: any) => {
        setIsProcessing(false);
        toast.error(errors.receiver_email || errors.file || 'Unable to share file');
      },
    });
  };

  const onDeleteFile = (values: z.infer<typeof deleteFileFormSchema>) => {
    setIsProcessing(true);
    router.delete(route('file.delete', { file_uuid: values.file_uuid }), {
      onSuccess: () => {
        setIsProcessing(false);
        setOpenDeleteModal(false);
        deleteForm.reset();
        toast.success('File moved to Trash');
      },
      onError: (errors: any) => {
        setIsProcessing(false);
        toast.error(errors.file || 'Unable to delete file');
      },
    });
  };

  if (view === 'list') {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group border border-border/50 bg-card/60">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <FileIcon className={cn("h-6 w-6 flex-shrink-0", iconColor)} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">{file.formatted_date || file.created_at}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {typeof file.size_in_mb === 'number' ? `${file.size_in_mb} MB` : (file.size_in_mb || file.size_in_kb || '')}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
            {file.total_downloads || 0} downloads
          </span>

          <div className="flex items-center space-x-1">
            {!isTrash ? (
              <>
                <FileAction file={file} action="star" view="list" />
                <FileAction file={file} action="download" view="list" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setIsShareOpen(true)}>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setOpenDeleteModal(true)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <FileAction file={file} action="restore" view="list" />
                <FileAction file={file} action="force_delete" view="list" />
              </>
            )}
          </div>
        </div>

        {/* Share Dialog */}
        <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share "{file.name}"</DialogTitle>
            </DialogHeader>
            <Form {...shareForm}>
              <form onSubmit={shareForm.handleSubmit(onShareFileSubmit)} className="space-y-4">
                <FormField
                  control={shareForm.control}
                  name="receiver_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Email</FormLabel>
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
                    <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isProcessing} className="bg-gradient-primary text-white">
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Share
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
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
                      <FormLabel>File name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isProcessing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isProcessing} className="bg-gradient-primary text-white">
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete "{file.name}"</DialogTitle>
            </DialogHeader>
            <Form {...deleteForm}>
              <form onSubmit={deleteForm.handleSubmit(onDeleteFile)} className="space-y-4">
                <FormField
                  control={deleteForm.control}
                  name="confirmation_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type <code>delete</code> to confirm moving this file to Trash</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="delete" disabled={isProcessing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" variant="destructive" disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Move to Trash
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Grid view
  return (
    <>
      <Card className="group hover:shadow-card transition-all duration-200 border-border bg-card overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center">
              <FileIcon className={cn("h-6 w-6", iconColor)} />
            </div>

            <div className="flex items-center space-x-1">
              {!isTrash ? (
                <>
                  <FileAction file={file} action="star" view="grid" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-80 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = route('file.download', { file_uuid: file.uuid })}>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsShareOpen(true)}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                        <Edit2 className="mr-2 h-4 w-4" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setOpenDeleteModal(true)}>
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

          <div className="mt-4">
            <h3 className="font-medium text-sm text-foreground truncate" title={file.name}>
              {file.name}
            </h3>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{typeof file.size_in_mb === 'number' ? `${file.size_in_mb} MB` : (file.size_in_mb || file.size_in_kb || '')}</span>
              <span>{file.formatted_date || file.created_at}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share "{file.name}"</DialogTitle>
          </DialogHeader>
          <Form {...shareForm}>
            <form onSubmit={shareForm.handleSubmit(onShareFileSubmit)} className="space-y-4">
              <FormField
                control={shareForm.control}
                name="receiver_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
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
                  <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isProcessing} className="bg-gradient-primary text-white">
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Share
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
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
                    <FormLabel>File name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isProcessing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isProcessing} className="bg-gradient-primary text-white">
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{file.name}"</DialogTitle>
          </DialogHeader>
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(onDeleteFile)} className="space-y-4">
              <FormField
                control={deleteForm.control}
                name="confirmation_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type <code>delete</code> to confirm moving this file to Trash</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="delete" disabled={isProcessing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                </DialogClose>
                <Button type="submit" variant="destructive" disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Move to Trash
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FileCard;
