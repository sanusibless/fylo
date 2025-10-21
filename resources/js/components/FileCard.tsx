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
  Edit3
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
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import FileAction from "./FileAction";
import { download } from './../routes/file/index';

interface FileCardProps {
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

const getFileIcon = (type: string) => {
  switch (type) {
    case 'document': return FileText;
    case 'image': return Image;
    case 'video': return Video;
    case 'audio': return Music;
    case 'archive': return Archive;
    default: return FileText;
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case 'document': return 'text-blue-400';
    case 'image': return 'text-green-400';
    case 'video': return 'text-purple-400';
    case 'audio': return 'text-pink-400';
    case 'archive': return 'text-orange-400';
    default: return 'text-muted-foreground';
  }
};



export function FileCard({ file, view }: FileCardProps) {
  // const [isStarred, setIsStarred] = useState(file.is_favorite || false);
  const FileIcon = getFileIcon(file.type);
  const iconColor = getFileColor(file.type);

  const handleStarringClick = (e,file_uuid: string) => {
    e.preventDefault();
    console.log(file.uuid);
    router.get(route("file.toggle_favorite", { file_uuid: file_uuid }), {}, {

      onSuccess: (data) => {
        console.log(data.props);
    }
});

  }

  if (view === 'list') {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
        <div className="flex items-center space-x-3">
          <FileIcon className={cn("h-5 w-5", iconColor)} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{file.formatted_date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">{file.size_in_mb}</span>
          <span className="flex items-center space-x-2 text-xs text-muted-foreground">{file.total_downloads} download(s)</span>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStarringClick(e, file.uuid)}
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              isStarred && "opacity-100 text-yellow-500"
            )}
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
              <DropdownMenuItem>
               <FileAction file={file} action="share" />
              </DropdownMenuItem>
              <DropdownMenuItem>
               <FileAction file={file} action="edit" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <FileAction file={file} action="delete" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
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
              <DropdownMenuItem>
               <FileAction file={file} action="share" />
              </DropdownMenuItem>
              <DropdownMenuItem>
               <FileAction file={file} action="edit" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <FileAction file={file} action="delete" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-sm text-foreground truncate">{file.name}</h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{file.size_in_mb}</span>
            <span className="flex items-center space-x-2 text-xs text-muted-foreground">{file.total_downloads} download(s)</span>
            <span>{file.formatted_date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
