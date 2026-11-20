<?php

function getFileType(?string $extension): string
{
    $extension = strtolower(trim((string) $extension));
    switch ($extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'gif':
        case 'bmp':
            return 'image';
        case 'pdf':
        case 'doc':
        case 'docx':
        case 'txt':
        case 'rtf':
        case 'odt':
        case 'csv':
        case 'xls':
        case 'xlsx':
        case 'ppt':
        case 'pptx':
        case 'md':
        case 'json':
            return 'document';
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'webm':
            return 'video';
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
        case 'bz2':
            return 'archive';
        case 'mp3':
        case 'wav':
        case 'ogg':
        case 'm4a':
            return 'audio';
        default:
            return 'unknown';
    }
}

function formatNaira(float|int|string $amount): string
{
    $numeric = (float) $amount;

    return '₦'.number_format($numeric, $numeric == floor($numeric) ? 0 : 2);
}
