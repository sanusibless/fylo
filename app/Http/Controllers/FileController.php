<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileUploadRequest;
use App\Http\Requests\ShareFileRequest;
use App\Models\File;
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
            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to upload file'])->withInput();
        } catch(\Throwable $th) {
           GeneralService::generalLog("Error in FileController", $th);
        }

        return redirect()->back()->withErrors(['file' => 'unable to upload file'])->withInput();
    }
    public function starringFile($file_uuid)
    {
        try {
        $fileResponse = $this->fileService->setAsFavouriteFile($file_uuid);
            if($fileResponse['status']) {

                GeneralService::generalLog("File stared",$fileResponse['data']);
                if(request()->expectsJson()) {
                    return response()->json([
                        'starred' => $fileResponse['data']['starred']
                    ]);
                }
                return redirect()->back()->with('starred', $fileResponse['data']['starred']);
            }
            GeneralService::generalLog("File unable to stared",[]);

            if(request()->expectsJson()) {
                return response()->json([
                    'error' => $fileResponse['message'] ?? 'Unable to set as favourite file'
                ]. 400);
            }
            return redirect()->back()->withErrors(['error' => $fileResponse['message'] ?? 'Unable to set as favourite file']);
        } catch(\Throwable $th) {
        GeneralService::generalLog("Error in FileController", $th);
        }
        if(request()->expectsJson()) {
            return response()->json([
                'error' => 'Unable to set as favourite file'
            ]. 422);
        }
        return redirect()->back()->withErrors(['file' => 'unable to upload file'])->withInput();
    }

    public function downloadFile($file_uuid)
    {
        try {
            $file = File::where('uuid', $file_uuid)->first();
            if(!$file) {
                return redirect()->back()->withErrors(['file' => 'File not found'])->withInput();
            }
            $url = storage_path(str_replace("/storage", 'app/public', $file->relative_path));
            $file->increaseDownloads();
            return response()->download($url);
        } catch(\Throwable $th) {
            GeneralService::generalLog("Error in FileController", $th);
        }
        return redirect()->back()->withErrors(['file' => 'unable to download file'])->withInput();
    }

    public function shareFile(ShareFileRequest $request)
    {
        try {
            $fileResponse = $this->fileService->shareFile(auth()->id(), $request->file_uuid, $request->receiver_email);
            if($fileResponse['status']) {
                return redirect()->back()->with('status', $fileResponse['message']);
            }
            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to share file'])->withInput();
        } catch(\Throwable $th) {
            GeneralService::generalLog("Error in FileController", $th);
        }
        return redirect()->back()->withErrors(['file' => 'unable to share file'])->withInput();
    }
}
