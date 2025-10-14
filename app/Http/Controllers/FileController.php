<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileUploadRequest;
use App\Services\FileService;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function __construct(protected FileService $fileService)
    {
        
    }

    public function store(FileUploadRequest $request)
    {
        try {

            $file = $request->file('file');

            $this->fileService->log("File", [
                "name" => $file->getClientOriginalName(),
                "type" => $file->getClientMimeType(),
                "file_size" => $file->getSize(),
                "ext" => $file->getClientOriginalExtension(),
            ]);

        } catch(\Throwable $th) {

        }
    }
}
