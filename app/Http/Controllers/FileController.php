<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileUploadRequest;
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
            $url = str_replace( $file->base_url . "/storage", 'app/public', $file->full_path);
            return response()->download($url);
        } catch(\Throwable $th) {
            GeneralService::generalLog("Error in FileController", $th);
        }
        return redirect()->back()->withErrors(['file' => 'unable to download file'])->withInput();
    }
}
