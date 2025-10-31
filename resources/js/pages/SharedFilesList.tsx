import { useState } from "react";
import { FileText, Image, FileVideo, FileAudio, File, MoreVertical, Download, Share2, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"
import DashboardLayout from "@/layouts/dashboard-layout/DashboardLayout";
import FileAction from "@/components/FileAction";
import EmptyState from "@/components/EmptyState";
import { Link } from "@inertiajs/react";

interface SharedFile {

    file : {
        id: string;
        name: string;
        type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'folder';
        uuid: string;
        size: string;
        size_in_mb: number;
        formatted_date: string;
        is_favorite?: boolean;
        thumbnail?: string;
    }
    sharedBy: { name: string; email: string };
    sharedDate: string;
}

const getFileIcon = (type: SharedFile["file"]["type"]) => {
  const iconProps = { className: "w-5 h-5" };
  switch (type) {
    case "document":
      return <FileText {...iconProps} className="w-5 h-5 text-primary" />;
    case "image":
      return <Image {...iconProps} className="w-5 h-5 text-green-600" />;
    case "video":
      return <FileVideo {...iconProps} className="w-5 h-5 text-red-600" />;
    case "audio":
      return <FileAudio {...iconProps} className="w-5 h-5 text-orange-600" />;
    default:
      return <File {...iconProps} className="w-5 h-5 text-muted-foreground" />;
  }
};

interface SharedFileItemProps {
  sharedFiles: SharedFile[];
  storage: {
    totalUsed: number | string;
    totalAvailable: number | string;
  };
  
}

const SharedFilesList = ({ sharedFiles, storage }: SharedFileItemProps ) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filesShared] = useState<SharedFile[]>(sharedFiles.data);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log(sharedFiles);

  const filteredFiles = filesShared.filter((filesShared) =>
    filesShared.file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (action: string, fileName: string) => {
    toast({
      title: `${action} action`,
      description: `${action} "${fileName}"`,
    });
  };

  return (
        <DashboardLayout title="Shared Files">
          <DashboardSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} storage={storage} />
          <div className="flex-1 flex flex-col lg:ml-0">
            <DashboardHeader onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Shared Files</h1>
                    <p className="text-muted-foreground">Manage your shared documents and media</p>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                    </div>

                    {/* Files List */}
                    <div className=" rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead>
                            <tr className="border-b border-border ">
                            <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Name</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-foreground hidden md:table-cell">
                                Shared By
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-foreground hidden sm:table-cell">
                                Size
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-foreground hidden lg:table-cell">
                                Date Shared
                            </th>
                            <th className="w-12 py-4 px-6">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFiles.length > 0 && filteredFiles.map((sharedFile) => {
                                const { file, sharedDate, sharedBy } = sharedFile;
                                return (
                                    <tr
                                        key={file.id}
                                        className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                                    >
                                <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                                    <span className="font-medium text-foreground truncate">{file.name}</span>
                                </div>
                                </td>
                                <td className="py-4 px-6 hidden md:table-cell">
                                <div className="flex flex-col justify-center -space-x-2">
                                    <span className="text-muted-foreground">{sharedBy.name}</span>
                                    <span className="text-muted-foreground text-xs">({sharedBy.email})</span>
                                </div>
                                </td>
                                <td className="py-4 px-6 text-sm text-muted-foreground hidden sm:table-cell">
                                {file.size}
                                </td>
                                <td className="py-4 px-6 text-sm text-muted-foreground hidden lg:table-cell">
                                {new Date(sharedDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                                </td>
                                <td className="py-4 px-6 text-white">
                                <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                        <FileAction file={file} action="download" />
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                            <FileAction file={file} action="delete" />
                                        </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                                )
                            })}
                        </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end m-3 space-x-2 ">
                    {sharedFiles.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || '#'}
                        preserveScroll
                        className={`px-3 py-1 text-sm border rounded ${
                        link.active
                            ? 'bg-blue-400 text-white'
                            : 'hover:bg-gray-400 hover:text-white'
                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                    ))}
                </div>
                    </div>

                    {/* Empty State */}
                    {filteredFiles.length === 0 && (
                    <EmptyState message="No shared files found" />
                    )}
                </div>
                </div>
            </div>
        </DashboardLayout>
  );
};

export default SharedFilesList;
