import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { route } from 'ziggy-js';
import { Download, Edit2, Loader2, Share2, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { is } from 'date-fns/locale';
import { set } from 'zod';

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
    action: 'download' | 'share' | 'delete' | 'star' | 'edit';
  }
function FileAction({ file, action = 'star' } : FileCardProps) {
    const [isStarred, setIsStarred] = useState(file.is_favorite);
    const [showStar, setShowStar] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

const handleStarringClick = async (e, fileUuid) => {
    e.preventDefault()
  
    try {
      setIsLoading(true);
      setShowStar(false);

      const response = await fetch(route('file.toggle_favorite', { file_uuid: fileUuid }), {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
      })
  
      const data = await response.json()
      setIsStarred(data.starred);
      setIsLoading(false);
      setShowStar(true);
      toast.success(data.starred ? 'Starred successfully' : 'Unstarred successfully')

    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false);
      setShowStar(true);
    }
}

const handleDownload = (e, fileUuid) => {
  window.location.href = route('file.download', { file_uuid: fileUuid });
}

  switch(action) {
    case 'download':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleDownload(e, file.uuid)}
        >
            <Download className="mr-2 h-4 w-4" />
            Download
        </Button>
      )
    
      case 'delete':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStarringClick(e, file.uuid)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )

        case 'edit':
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleStarringClick(e, file.uuid)}
            >
                <Edit2 className="mr-2 h-4 w-4" />
                Rename
            </Button>
          )
       case 'share':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStarringClick(e, file.uuid)}
          >
            <Share2 className="mr-2 h-4 w-4" />
                Share
          </Button>
        )
        
        default: 
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleStarringClick(e, file.uuid)}
            >
                {showStar && <Star className={cn("h-4 w-4 ", isStarred && "fill-current text-yellow-500")} /> }
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-600" />}
            </Button>
        )
  }
}

export default FileAction
