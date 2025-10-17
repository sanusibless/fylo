import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

function FileActions({ file }) {
  const handleStarringClick = (e: React.MouseEvent<HTMLButtonElement>, fileUuid: string) => {
    e.preventDefault()

    router.get(route('file.toggle_favorite', { file_uuid: fileUuid }), {}, {
      preserveScroll: true,
      onSuccess: (page) => {
        // you can access flash data like starred from page.props
        const starred = page.props.flash?.starred
        console.log('Starred:', starred)
      },
      onError: (error) => {
        console.error(error)
      },
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => handleStarringClick(e, file.uuid)}
    >
      {file.starred ? '★ Unstar' : '☆ Star'}
    </Button>
  )
}

export default FileActions
