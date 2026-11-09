import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import { Download, Edit2, Loader2, Share2, Star, Trash2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from '@radix-ui/react-dialog';
import { Input } from './ui/input';
import AutoCompleteSearchInput from './AutoCompleteSearchInput';
import { type FileItem } from '@/types';

export interface FileActionProps {
    file: FileItem;
    action?: 'download' | 'share' | 'delete' | 'star' | 'edit' | 'restore' | 'force_delete';
    view?: 'list' | 'grid' | null;
    onActionComplete?: () => void;
}

export function FileAction({ file, action = 'star', view = 'grid', onActionComplete }: FileActionProps) {
    const [isStarred, setIsStarred] = useState(Boolean(file.is_favorite));
    const [isLoading, setIsLoading] = useState(false);

    // Edit state
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editName, setEditName] = useState(() => {
        const parts = file.name.split('.');
        if (parts.length > 1) {
            parts.pop();
            return parts.join('.');
        }
        return file.name;
    });

    // Share state
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shareEmail, setShareEmail] = useState('');

    // Delete state
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [confirmDeleteText, setConfirmDeleteText] = useState('');

    const handleStarringClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setIsLoading(true);
            const response = await fetch(route('file.toggle_favorite', { file_uuid: file.uuid }), {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setIsStarred(data.starred);
                toast.success(data.starred ? 'Starred file' : 'Unstarred file');
                onActionComplete?.();
            } else {
                toast.error(data.error || 'Failed to update star');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = route('file.download', { file_uuid: file.uuid });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editName.trim()) {
            toast.error('File name cannot be empty');
            return;
        }

        setIsLoading(true);
        router.put(route('file.update', { file_uuid: file.uuid }), {
            file_uuid: file.uuid,
            name: editName.trim(),
        }, {
            onSuccess: () => {
                setIsLoading(false);
                setIsEditOpen(false);
                toast.success('File renamed successfully');
                onActionComplete?.();
            },
            onError: (errors: any) => {
                setIsLoading(false);
                toast.error(errors.name || errors.file || 'Failed to rename file');
            }
        });
    };

    const handleShareSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!shareEmail.trim()) {
            toast.error('Please enter a recipient email');
            return;
        }

        setIsLoading(true);
        router.post(route('file.share'), {
            file_uuid: file.uuid,
            receiver_email: shareEmail.trim(),
        }, {
            onSuccess: () => {
                setIsLoading(false);
                setIsShareOpen(false);
                setShareEmail('');
                toast.success('File shared successfully');
                onActionComplete?.();
            },
            onError: (errors: any) => {
                setIsLoading(false);
                toast.error(errors.receiver_email || errors.file || errors.message || 'Unable to share file');
            }
        });
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.delete(route('file.delete', { file_uuid: file.uuid }), {
            onSuccess: () => {
                setIsLoading(false);
                setIsDeleteOpen(false);
                toast.success('File moved to Trash');
                onActionComplete?.();
            },
            onError: (errors: any) => {
                setIsLoading(false);
                toast.error(errors.file || 'Unable to delete file');
            }
        });
    };

    const handleRestoreSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.post(route('file.restore', { file_uuid: file.uuid }), {}, {
            onSuccess: () => {
                setIsLoading(false);
                toast.success('File restored successfully');
                onActionComplete?.();
            },
            onError: (errors: any) => {
                setIsLoading(false);
                toast.error(errors.file || 'Unable to restore file');
            }
        });
    };

    const handleForceDeleteSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to permanently delete this file? This action cannot be undone.')) {
            return;
        }
        setIsLoading(true);
        router.delete(route('file.force_delete', { file_uuid: file.uuid }), {
            onSuccess: () => {
                setIsLoading(false);
                toast.success('File permanently deleted');
                onActionComplete?.();
            },
            onError: (errors: any) => {
                setIsLoading(false);
                toast.error(errors.file || 'Unable to delete file');
            }
        });
    };

    switch (action) {
        case 'download':
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="hover:text-teal-400"
                    title="Download"
                >
                    <Download className="h-4 w-4 mr-1" />
                    {view === 'grid' && 'Download'}
                </Button>
            );

        case 'restore':
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRestoreSubmit}
                    disabled={isLoading}
                    className="text-teal-400 hover:text-teal-300"
                    title="Restore file"
                >
                    <Undo2 className="h-4 w-4 mr-1" />
                    Restore
                </Button>
            );

        case 'force_delete':
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleForceDeleteSubmit}
                    disabled={isLoading}
                    className="text-red-500 hover:text-red-400"
                    title="Delete permanently"
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Forever
                </Button>
            );

        case 'delete':
            return (
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            title="Move to Trash"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {view === 'grid' && 'Delete'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Move to Trash</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleDeleteSubmit} className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to move <strong>{file.name}</strong> to the Trash? You can restore it anytime from the Trash.
                            </p>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
                                </DialogClose>
                                <Button type="submit" variant="destructive" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Move to Trash
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            );

        case 'edit':
            return (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Rename file"
                        >
                            <Edit2 className="h-4 w-4 mr-1" />
                            {view === 'grid' && 'Rename'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename File</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">New file name</label>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Enter new filename"
                                    disabled={isLoading}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading} className="bg-gradient-primary text-white">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            );

        case 'share':
            return (
                <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            title="Share file"
                        >
                            <Share2 className="h-4 w-4 mr-1" />
                            {view === 'grid' && 'Share'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Share "{file.name}"</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleShareSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Recipient Email</label>
                                <AutoCompleteSearchInput
                                    value={shareEmail}
                                    onSelect={(val) => setShareEmail(val)}
                                    disabled={isLoading}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading} className="bg-gradient-primary text-white">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Share
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            );

        case 'star':
        default:
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStarringClick}
                    disabled={isLoading}
                    title={isStarred ? "Unstar" : "Star"}
                    className="p-1 h-8 w-8 hover:bg-muted"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                        <Star className={cn("h-4 w-4", isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                    )}
                </Button>
            );
    }
}

export default FileAction;
