<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileUploadRequest;
use App\Services\FileService;
use App\Services\GeneralService;
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

            $fileResponse = $this->fileService->storeFile(auth()->id(), $file);
            if($fileResponse['status']) {
                return redirect()->back()->with('status', $fileResponse['message']);
            }
        } catch(\Throwable $th) {
           GeneralService::generalLog("Error in FileController", $th);
        }

        return redirect()->back()->withErrors('error', 'unable to upload file')->withInput();
    }
}
