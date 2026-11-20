<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\FileService;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use Throwable;

class DashboardController extends Controller
{
    public function __construct(protected FileService $fileService) {}

    protected function getStorageData($user)
    {
        $activeRecord = $user->activeStoragePlanRecord();
        $plan = $activeRecord?->storagePlanDetail;
        $capacity = $plan?->capacity ?? config('fylo.storage.default_free_capacity_gb', '5');
        $numericCapacity = strtolower((string) $capacity) === 'unlimited' ? 999999 : (float) $capacity;

        return [
            'totalUsed' => $user->totalStorageUsed(),
            'totalUsedBytes' => (int) $user->totalStorageUsedBytes(),
            'totalAvailable' => $numericCapacity,
            'totalAvailableBytes' => (int) $user->storageCapacityBytes(),
            'maxFileSizeMB' => $user->maxUploadSizeMB(),
            'planName' => $plan?->name ?? 'Free',
            'availableStorage' => $plan,
        ];
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $search = trim((string) $request->query('search', ''));
        $typeFilter = trim((string) $request->query('type', ''));
        $sort = $request->query('sort', 'desc') === 'asc' ? 'asc' : 'desc';

        $filesQuery = $user->files()->with('folder:id,uuid,name,color');

        if ($search !== '') {
            $filesQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('extension', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        if ($typeFilter !== '' && $typeFilter !== 'all') {
            $filesQuery->where('type', $typeFilter);
        }

        $recentFiles = $filesQuery
            ->orderBy('created_at', $sort)
            ->take(40)
            ->get();

        // Compute storage breakdown by type
        $storageBreakdown = $user->files()
            ->selectRaw('type, COUNT(*) as count, COALESCE(SUM(size), 0) as total_bytes')
            ->groupBy('type')
            ->get()
            ->mapWithKeys(fn ($row) => [
                $row->type => [
                    'count' => (int) $row->count,
                    'bytes' => (float) $row->total_bytes,
                ],
            ]);

        return inertia('Dashboard', [
            'recentFiles' => $recentFiles,
            'totalFiles' => $user->files()->count(),
            'totalFolders' => $user->folders()->count(),
            'totalShared' => $user->totalSharedFiles(),
            'downloads' => $user->totalDownloads(),
            'storageBreakdown' => $storageBreakdown,
            'recentActivities' => Activity::where('causer_id', $user->id)
                ->where('causer_type', User::class)
                ->latest()
                ->take(8)
                ->get(),
            'storage' => $this->getStorageData($user),
            'filters' => [
                'search' => $search,
                'type' => $typeFilter,
                'sort' => $sort,
            ],
        ]);
    }

    public function recent(Request $request)
    {
        $user = auth()->user();
        $search = trim((string) $request->query('search', ''));
        $typeFilter = trim((string) $request->query('type', ''));

        $filesQuery = $user->files()->with('folder:id,uuid,name,color');
        if ($search !== '') {
            $filesQuery->where('name', 'like', "%{$search}%");
        }
        if ($typeFilter !== '' && $typeFilter !== 'all') {
            $filesQuery->where('type', $typeFilter);
        }

        $files = $filesQuery->orderByDesc('created_at')->paginate(20)->withQueryString();

        return inertia('Recent', [
            'files' => $files,
            'storage' => $this->getStorageData($user),
            'totalFiles' => $user->files()->count(),
            'totalShared' => $user->totalSharedFiles(),
            'downloads' => $user->totalDownloads(),
            'filters' => [
                'search' => $search,
                'type' => $typeFilter,
            ],
        ]);
    }

    public function starred(Request $request)
    {
        $user = auth()->user();
        $search = trim((string) $request->query('search', ''));
        $typeFilter = trim((string) $request->query('type', ''));

        $filesQuery = $user->files()->where('is_favorite', true)->with('folder:id,uuid,name,color');
        if ($search !== '') {
            $filesQuery->where('name', 'like', "%{$search}%");
        }
        if ($typeFilter !== '' && $typeFilter !== 'all') {
            $filesQuery->where('type', $typeFilter);
        }

        $files = $filesQuery->orderByDesc('updated_at')->paginate(20)->withQueryString();

        return inertia('Starred', [
            'files' => $files,
            'storage' => $this->getStorageData($user),
            'totalFiles' => $user->files()->count(),
            'totalShared' => $user->totalSharedFiles(),
            'downloads' => $user->totalDownloads(),
            'filters' => [
                'search' => $search,
                'type' => $typeFilter,
            ],
        ]);
    }

    public function trash(Request $request)
    {
        $user = auth()->user();
        $search = trim((string) $request->query('search', ''));

        $filesQuery = $user->files()->onlyTrashed();
        if ($search !== '') {
            $filesQuery->where('name', 'like', "%{$search}%");
        }

        $files = $filesQuery->orderByDesc('deleted_at')->paginate(20)->withQueryString();

        return inertia('Trash', [
            'files' => $files,
            'storage' => $this->getStorageData($user),
            'totalFiles' => $user->files()->count(),
            'totalShared' => $user->totalSharedFiles(),
            'downloads' => $user->totalDownloads(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function getSharedFiles(Request $request)
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
                    ->whereHas('file', fn ($q) => $q->whereNull('deleted_at'))
                    ->with(['user', 'file'])
                    ->latest()
                    ->paginate(20)
                    ->through(fn ($sharedFile) => [
                        'sharedBy' => [
                            'name' => $sharedFile->user?->name ?? 'Unknown',
                            'email' => $sharedFile->user?->email ?? '',
                        ],
                        'file' => $sharedFile->file,
                        'sharedDate' => $sharedFile->created_at?->toFormattedDateString() ?? '',
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
