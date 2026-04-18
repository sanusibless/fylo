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
  Star,
  Trash2,
  Edit3,
  Loader2,
  Edit2
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
    DialogTrigger,
  } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import FileAction from "./FileAction";
import { download } from './../routes/file/index';
import { DialogClose } from "@radix-ui/react-dialog";
import { is } from 'date-fns/locale';
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
import { Input } from "@headlessui/react";
import AutoCompleteSearchInput from "./AutoCompleteSearchInput";
import { type } from './../../../vendor/tightenco/ziggy/src/js/index.d';
import { confirm } from './../routes/password/index';


export interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'folder';
    uuid: string;
    size: string;
    size_in_mb: number;
    formatted_date: string;
    total_downloads: string;
    is_favorite?: boolean;
    thumbnail?: string;

  };
  view: 'grid' | 'list';
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
const shareFileFormSchema = z.object({
    file_uuid: z.string(),
    receiver_email: z.email() || '',
});

const deleteFileFormSchema = z.object({
    file_uuid: z.string(),
    confirmation_text: z.literal("delete")
});

const EditForm = z.object({
    file_uuid: z.string(),
    name: z.string().min(3, {
      message: 'Name must be at least 3 characters long',
    })
});

export const removeExtension = (fileName: string) => {
    return fileName.split('.')[0];
}

export const shortFileName = (fileName: string) => {
    const name = removeExtension(fileName);
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
}


export function FileCard({ file, view }: FileCardProps) {
  // const [isStarred, setIsStarred] = useState(file.is_favorite || false);

    const FileIcon = getFileIcon(file.type);
    const iconColor = getFileColor(file.type);
    const [isShareOpen,setIsShareOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const form = useForm<z.infer<typeof shareFileFormSchema>>({
        resolver: zodResolver(shareFileFormSchema),
        defaultValues: {
            file_uuid: file.uuid,
            receiver_email: '',
        }
        });
    const deleteForm = useForm<z.infer<typeof deleteFileFormSchema>>({
        resolver: zodResolver(deleteFileFormSchema),
        defaultValues: {
        file_uuid: file.uuid,
        confirmation_text: ""
        }
    });

    const handleSelectedUser = (value: string) => {
        form.setValue('receiver_email', value || '');
    };

    const editForm = useForm({
        resolver: zodResolver(EditForm),
        defaultValues: {
            file_uuid: file.uuid,
            name: removeExtension(file.name),
        },
    });

    const onEditFileSubmit = async (values : z.infer<typeof EditForm>) => {

        try {
            setIsProcessing(true);
            router.put(route('file.update', { file_uuid: values.file_uuid }), values, {
                onSuccess: () => {
                    setIsProcessing(false);
                    setIsEditOpen(false);
                    toast.success('File updated successfully');
                },
                onError: () => {
                    setIsProcessing(false);
                    setIsEditOpen(false);
                    toast.error('Unable to update file');
                }
            })
        } catch(error) {
            console.log(error);
            setIsProcessing(false);
            toast.error('Something went wrong');
        }
    }

    const onShareFileSubmit = (values: z.infer<typeof shareFileFormSchema>) => {
    try {
        console.log(values);
        setIsProcessing(true);
        router.post(route('file.share'), values, {
            onSuccess: () => {
                setIsProcessing(false);
                setIsEditOpen(false);
                toast.success('File shared successfully');
            },
            onError: () => {
                setIsProcessing(false);
                setIsEditOpen(false);
                toast.success('Unable to share file');
            }
        })
    } catch(error) {
        console.log(error);
        setIsProcessing(false);
        setIsEditOpen(false);
        toast.error('Something went wrong')
    }
    }
    const onDeleteFile = (values: z.infer<typeof deleteFileFormSchema>) => {
        try {
            setIsProcessing(true);
            router.delete(route('file.delete', values.file_uuid), {
                onSuccess: () => {
                    setIsProcessing(false);
                    setOpenDeleteModal(false);
                    toast.success('File deleted successfully');
                },
                onError: () => {
                    setIsProcessing(false);
                    setOpenDeleteModal(false);
                    toast.error('Unable to delete file');
                }
            })
        } catch(error) {
            console.log(error);
            setIsProcessing(false);
            setOpenDeleteModal(false);
            toast.error('Something went wrong')
        }
    }
    if (view === 'list') {
        return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
            <div className="flex items-center space-x-3">
                <FileIcon className={cn("h-5 w-5", iconColor)} />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{shortFileName(file.name)}</p>
                    <p className="text-xs text-muted-foreground">{file.formatted_date}</p>
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <span className="text-xs text-muted-foreground">{file.size_in_mb}</span>
                <span className="flex text-xs text-muted-foreground">{file.total_downloads} download(s)</span>
                <div className="flex justify-end">
                    <FileAction file={file} action="star" />
                    <FileAction file={file} action="download" view="list" />
                </div>
            </div>
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="flex items-center ml-3">
                        <Share2 className="mr-2 h-4 w-4" />
                        </Button>
                </DialogTrigger>
                <DialogContent key="share-dialog">
                    <DialogHeader>
                        <DialogTitle>Share this {file.name} with?</DialogTitle>
                    </DialogHeader>

                <Form {...form} >
                        <form onSubmit={form.handleSubmit(onShareFileSubmit)} className="mb-3">
                                <FormField
                                    control={form.control}
                                    name="file_uuid"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                        <Input
                                            type="hidden"
                                            {...field}
                                            value={file.uuid}
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="receiver_email"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <AutoCompleteSearchInput onSelect={(value) => handleSelectedUser(value)} value={field.value ?? ''}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="h-4 flex justify-end space-x-2">

                                    {isProcessing ?
                                    (<Loader2 className="w-5 h-5 animate-spin text-[hsl(185,77%,54%)]/80" />) :
                                    (<DialogFooter className="">
                                        <div className="mb-3">
                                            <Button type="submit">Share</Button>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline">Cancel</Button>
                                            </DialogClose>
                                        </div>

                                    </DialogFooter>)
                                    }
                                </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal} >
                <DialogTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="flex items-center ml-3">
                        <Trash2 className="mr-2 h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent key="share-dialog" className="">
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this file, {file.name}?</DialogTitle>
                    </DialogHeader>

                <Form {...deleteForm}>
                        <form onSubmit={deleteForm.handleSubmit(onDeleteFile)}>
                                <FormField
                                    control={form.control}
                                    name="file_uuid"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs mb-2">Enter 'delete' to confirm deletion</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="hidden"
                                                {...field}
                                                value={file.uuid}
                                                placeholder="Enter 'delete' to confirm deletion"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={deleteForm.control}
                                    name="confirmation_text"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input  className="w-full border rounded" type="text" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="h-4 mt-4 flex justify-end">
                                    {isProcessing ?
                                    (<Loader2 className="w-4 h-4 animate-spin text-gray-600" />) :
                                    (<DialogFooter>
                                        <Button type="submit" disabled={deleteForm.watch("confirmation_text") !== "delete"} className="bg-red-500 text-white hover:bg-red-600">Delete</Button>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">Cancel</Button>
                                        </DialogClose>
                                    </DialogFooter>)
                                    }
                                </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="flex items-center ml-3">
                        <Edit2 className="mr-2 h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent key="share-dialog">
                    <DialogHeader>
                        <DialogTitle>Edit {file.name}</DialogTitle>
                    </DialogHeader>

                    <Form {...editForm} >
                        <form
                        onSubmit={editForm.handleSubmit(onEditFileSubmit)}
                        className="space-y-4"
                        >
                            <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {isProcessing ?
                            (<Loader2 className="flex justify-end w-4 h-4 animate-spin text-[hsl(185,77%,54%)]/80" />) : (
                                <DialogFooter>
                                    <Button type="submit">Save</Button>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            )}
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
        );
    }

    return (
        <>
        <Card className="group hover:shadow-card transition-all duration-200 cursor-pointer">
        <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                <FileIcon className={cn("h-6 w-6", iconColor)} />
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStarringClick(e, file.uuid)}

                className={cn(isStarred && "text-yellow-500")}
                >
                <Star className={cn("h-4 w-4", isStarred && "fill-current")} />
                </Button> */}

            <FileAction file={file} action="star" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem>
                <FileAction file={file} action="download" />
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsShareOpen(true); }}>
                    <Share2 className="ml-2 mr-2 h-4 w-4" /> Share
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsEditOpen(true); }}>
                    <Edit2 className="ml-2 mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onSelect={(e) => { e.preventDefault(); setOpenDeleteModal(true); }}>
                    <Trash2 className="ml-2 mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
            </div>
            <div className="space-y-1">
            <h3 className="font-medium text-sm text-foreground truncate">{shortFileName(file.name)}</h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{file.size_in_mb}</span>
                <span className="flex items-center space-x-2 text-xs text-muted-foreground">{file.total_downloads} download(s)</span>
                <span>{file.formatted_date}</span>
            </div>
            </div>
            </CardContent>
            </Card>
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                    <DialogContent key="share-dialog">
                        <DialogHeader>
                            <DialogTitle>Share this {file.name} with?</DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onShareFileSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="file_uuid"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                            <Input
                                                type="hidden"
                                                {...field}
                                                value={file.uuid}
                                            />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="receiver_email"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <AutoCompleteSearchInput disabled={isProcessing} onSelect={(value) => handleSelectedUser(value)} value={field.value ?? ''}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <div className="h-4 mt-4 flex justify-end mb-2">
                                        {isProcessing ?
                                        (<Loader2 className="w-4 h-4 animate-spin text-[hsl(185,77%,54%)]/80" />) :
                                        (<DialogFooter className="space-x-2 mb-4">
                                            <Button type="submit">Share</Button>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline">Cancel</Button>
                                            </DialogClose>
                                        </DialogFooter>)
                                        }
                                    </div>
                            </form>
                        </Form>

                    </DialogContent>
            </Dialog>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent key="share-dialog">
                        <DialogHeader>
                            <DialogTitle>Edit {file.name}</DialogTitle>
                        </DialogHeader>

                        <Form {...editForm} >
                            <form
                            onSubmit={editForm.handleSubmit(onEditFileSubmit)}
                            className="space-y-4"
                            >
                                <FormField
                                    control={editForm.control}
                                    name="name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="flex justify-end">
                                {isProcessing ?
                                    (<Loader2 className="w-4 h-4 animate-spin text-[hsl(185,77%,54%)]/80" />)
                                    : (
                                        <DialogFooter>
                                            <Button type="submit">Save</Button>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline">Cancel</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    )}
                                </div>

                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal} >
                    <DialogContent key="share-dialog" className="">
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this file, {file.name}?</DialogTitle>
                        </DialogHeader>

                    <Form {...deleteForm}>
                            <form onSubmit={deleteForm.handleSubmit(onDeleteFile)}>
                                    <FormField
                                        control={form.control}
                                        name="file_uuid"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs mb-2">Enter 'delete' to confirm deletion</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="hidden"
                                                    {...field}
                                                    value={file.uuid}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={deleteForm.control}
                                        name="confirmation_text"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input  className="w-full border rounded" type="text" {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <div className="h-4 mt-4 flex justify-end">
                                        {isProcessing ?
                                        (<div className="flex justify-end">
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                                        </div>) :
                                        (<DialogFooter>
                                            <Button type="submit" disabled={deleteForm.watch("confirmation_text") !== "delete"} className="bg-red-500 text-white hover:bg-red-600">Delete</Button>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline">Cancel</Button>
                                            </DialogClose>
                                        </DialogFooter>)
                                        }
                                    </div>
                            </form>
                        </Form>
                    </DialogContent>
            </Dialog>
        </>
    );
}
