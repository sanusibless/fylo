<?php

namespace App\Http\Controllers;

use App\Services\FileService;
use App\Services\GeneralService;
use Illuminate\Http\Request;

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

    

    // public function getSharedFiles(GeneralService $generalService, $id)
    // {
    //     try {

    //         $auth = auth()->user();

    //         return inertia('SharedFiles',[
    //             'sharedFiles' => $auth->sharedFiles()->where('shared_file_id', $id)->get(),
    //         ]);

    //     } catch (Throwable $th) {

    //     }
    // }
}
