import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { route } from 'ziggy-js';
import { Loader2, Star } from 'lucide-react';
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
  }
function FileAction({ file } : FileCardProps) {
    const [isStarred, setIsStarred] = useState(file.is_favorite);
    const [showStar, setShowStar] = useState(true);
    const [isloading, setIsLoading] = useState(false);

//   const handleStarringClick = (e: React.MouseEvent<HTMLButtonElement>, fileUuid: string) => {
//     e.preventDefault()

//     router.visit(route('file.toggle_favorite', { file_uuid: fileUuid }),{
//       preserveScroll: true,
//       method: 'get',
//       preserveState: true,
//       only: ['flash'],
//       onSuccess: (page) => {
//         // you can access flash data like starred from page.props

//         const starred = page.props.flash?.starred
//         console.log(page.props);
//         setIsStarred(starred);
//         toast.success(starred ? 'Starred successfully' : 'Unstarred successfully')
//       },
//       onError: (error) => {
//         console.log(error);
//         // toast.error(starred ? 'Starred successfully' : 'Unstarred successfully')
//       },
//     })
//   }
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

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => handleStarringClick(e, file.uuid)}
    >
      {showStar && <Star className={cn("h-4 w-4 ", isStarred && "fill-current text-yellow-500")} /> }
      {isloading && <Loader2 className="w-4 h-4 animate-spin text-gray-600" />}
    </Button>
  )
}

export default FileAction
