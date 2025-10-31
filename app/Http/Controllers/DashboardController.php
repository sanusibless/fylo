<?php

namespace App\Http\Controllers;

use App\Services\FileService;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Throwable;

class DashboardController extends Controller
{
    public function __construct(protected FileService $fileService)
    {

    }
    public function index()
    {
        $files = auth()->user()->files();
        return inertia('Dashboard',[
            'recentFiles' => $files->orderByDesc("created_at")->take(20)->get(),
            'totalFiles' => $files->count(),
            'totalShared' =>  auth()->user()->totalSharedFiles(),
            'storage' => [
                'totalUsed' => auth()->user()->totalStorageUsed(),
                'availableStorage' => auth()->user()->storagePlan->storagePlanDetail,
            ]
        ]);
    }



    public function getSharedFiles()
    {
        try {
            $auth = auth()->user();
            $files = auth()->user()->files();

            return inertia('SharedFilesList',[
                'recentFiles' => $files->orderByDesc("created_at")->take(20)->get(),
                'totalFiles' => $files->count(),
                'totalShared' =>  auth()->user()->totalSharedFiles(),
                'storage' => [
                    'totalUsed' => auth()->user()->totalStorageUsed(),
                    'availableStorage' => auth()->user()->storagePlan->storagePlanDetail,
                ],
                'sharedFiles' => collect($auth->sharedFiles)->map(function ($sharedFile) {
                    return  [
                        "sharedBy" => [
                            "name" => $sharedFile->user->name,
                            "email" => $sharedFile->user->email
                        ],
                        "file" =>  $sharedFile->file,
                        "sharedDate" => $sharedFile->created_at
                    ];
                }),
            ]);
        } catch (Throwable $th) {
            GeneralService::staticLog("Error", [
                "" => $th
            ]);
        }
    }
}
