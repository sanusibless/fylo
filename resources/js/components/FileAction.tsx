import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { route } from 'ziggy-js';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileCardProps {
    file: {
      id: string;
      name: string;
      type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'folder';
      uuid: string;
      size: string;
      size_in_mb: number;
      formatted_date: string;
      is_favorite?: boolean;
      thumbnail?: string;
    };
  }
function FileAction({ file } : FileCardProps) {
  const handleStarringClick = (e: React.MouseEvent<HTMLButtonElement>, fileUuid: string) => {
    e.preventDefault()

    router.get(route('file.toggle_favorite', { file_uuid: fileUuid }), {}, {
      preserveScroll: true,
      onSuccess: (page) => {
        // you can access flash data like starred from page.props
        const starred = page.props.flash?.starred
        toast.success(starred ? 'Starred successfully' : 'Unstarred successfully')
      },
      onError: (error) => {
        console.log(error);
        toast.error(starred ? 'Starred successfully' : 'Unstarred successfully')
      },
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => handleStarringClick(e, file.uuid)}
    >
      <Star className={cn("h-4 w-4", file.is_favorite && "fill-current")} />
    </Button>
  )
}

export default FileAction
