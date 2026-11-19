<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $storage = null;
        if ($user) {
            $activeRecord = $user->activeStoragePlanRecord();
            $userPlan = $activeRecord?->storagePlanDetail;
            $storage = [
                'totalUsed' => round($user->totalStorageUsedBytes() / (1024 * 1024 * 1024), 4),
                'totalUsedBytes' => (int) $user->totalStorageUsedBytes(),
                'totalAvailable' => $user->storageCapacityGB(),
                'totalAvailableBytes' => (int) $user->storageCapacityBytes(),
                'maxFileSizeMB' => $user->maxUploadSizeMB(),
                'planName' => $userPlan?->name ?? 'Free',
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('fylo.name', config('app.name', 'Fylo')),
            'appConfig' => [
                'name' => config('fylo.name', 'Fylo'),
                'tagline' => config('fylo.tagline'),
                'baseUrl' => rtrim(config('app.url'), '/'),
                'location' => config('fylo.location'),
                'currency' => config('fylo.currency'),
                'contact' => config('fylo.contact'),
                'maxDefaultUploadMB' => config('fylo.storage.default_max_file_size_mb', 50),
                'allowedExtensions' => config('fylo.storage.allowed_extensions', []),
            ],
            'auth' => [
                'user' => $user,
            ],
            'storage' => $storage,
            'flash' => [
                'success' => $request->session()->get('success'),
                'status' => $request->session()->get('status'),
                'error' => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
