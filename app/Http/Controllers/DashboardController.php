<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\FileService;
use App\Services\GeneralService;
use Spatie\Activitylog\Models\Activity;
use Throwable;

class DashboardController extends Controller
{
    public function __construct(protected FileService $fileService) {}

    protected function getStorageData($user)
    {
        $plan = $user->storagePlan?->storagePlanDetail;
        $capacity = $plan?->capacity ?? '10';
        $numericCapacity = strtolower((string) $capacity) === 'unlimited' ? 999999 : (float) $capacity;

        return [
            'totalUsed' => $user->totalStorageUsed(),
            'totalAvailable' => $numericCapacity,
            'planName' => $plan?->name ?? 'Free',
            'availableStorage' => $plan,
        ];
    }

    public function index()
    {
        $user = auth()->user();
        $files = $user->files();

        return inertia('Dashboard', [
            'recentFiles' => $files->orderByDesc('created_at')->take(20)->get(),
            'totalFiles' => $files->count(),
            'totalShared' => $user->totalSharedFiles(),
            'downloads' => $user->totalDownloads(),
            'recentActivities' => Activity::where('causer_id', $user->id)
                ->where('causer_type', User::class)
                ->latest()
                ->take(5)
                ->get(),
            'storage' => $this->getStorageData($user),
        ]);
    }

    public function recent()
    {
        $user = auth()->user();
        $files = $user->files()->orderByDesc('created_at')->paginate(20);

        return inertia('Recent', [
            'files' => $files,
            'storage' => $this->getStorageData($user),
            'totalFiles' => $user->files()->count(),
            'totalShared' => $user->totalSharedFiles(),
            'downloads' => $user->totalDownloads(),
        ]);
    }

    public function starred()
    {
        $user = auth()->user();
        $files = $user->files()->where('is_favorite', true)->orderByDesc('updated_at')->paginate(20);

        return inertia('Starred', [
            'files' => $files,
            'storage' => $this->getStorageData($user),
            'totalFiles' => $user->files()->count(),
            'totalShared' => $user->totalSharedFiles(),
            'downloads' => $user->totalDownloads(),
        ]);
    }

    public function trash()
    {
        $user = auth()->user();
        $files = $user->files()->onlyTrashed()->orderByDesc('deleted_at')->paginate(20);

        return inertia('Trash', [
            'files' => $files,
            'storage' => $this->getStorageData($user),
            'totalFiles' => $user->files()->count(),
            'totalShared' => $user->totalSharedFiles(),
            'downloads' => $user->totalDownloads(),
        ]);
    }

    public function getSharedFiles()
    {
        try {
            $user = auth()->user();
            $files = $user->files();

            return inertia('SharedFilesList', [
                'recentFiles' => $files->orderByDesc('created_at')->take(20)->get(),
                'totalFiles' => $files->count(),
                'totalShared' => $user->totalSharedFiles(),
                'downloads' => $user->totalDownloads(),
                'storage' => $this->getStorageData($user),
                'sharedFiles' => $user->sharedFiles()
                    ->with(['user', 'file'])
                    ->paginate(20)
                    ->through(fn ($sharedFile) => [
                        'sharedBy' => [
                            'name' => $sharedFile->user?->name ?? 'Unknown',
                            'email' => $sharedFile->user?->email ?? '',
                        ],
                        'file' => $sharedFile->file,
                        'sharedDate' => $sharedFile->created_at,
                    ]),
            ]);
        } catch (Throwable $th) {
            GeneralService::staticLog('Error in DashboardController::getSharedFiles', [
                'error' => $th->getMessage(),
            ]);

            return redirect()->route('dashboard')->withErrors(['error' => 'Unable to retrieve shared files']);
        }
    }
}
