<?php

function getFileType($extention) {
    $extention = strtolower($extention);
    switch ($extention) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'svg':
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
            return 'document';
        case 'mp4':
        case 'wav':
        case 'ogg':
            return 'video';
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
        case 'bz2':
            return 'archive';
        case 'mp3':
            return 'audio';
        default:
            return 'unknown';
        
    }

}