<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AdminPlanController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\PublicShareController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\EnsureAdmin;
use App\Models\StoragePlan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Rap2hpoutre\LaravelLogViewer\LogViewerController;

$resolvePublicPlans = function () {
    $configuredPlans = config('fylo.plans', []);
    $existingSlugs = StoragePlan::pluck('slug')->toArray();
    $requiredSlugs = array_column($configuredPlans, 'slug');

    if (count(array_intersect($requiredSlugs, $existingSlugs)) < count($requiredSlugs)) {
        foreach ($configuredPlans as $plan) {
            StoragePlan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }

    return StoragePlan::where('is_active', true)
        ->when(! empty($requiredSlugs), fn ($q) => $q->whereIn('slug', $requiredSlugs))
        ->orderBy('price_monthly')
        ->get();
};

/*
|--------------------------------------------------------------------------
| Public SaaS Pages
|--------------------------------------------------------------------------
*/
Route::get('/', function () use ($resolvePublicPlans) {
    return Inertia::render('welcome', [
        'plans' => $resolvePublicPlans(),
    ]);
})->name('home');

Route::get('/features', function () {
    return Inertia::render('features');
})->name('features');

Route::get('/pricing', function () use ($resolvePublicPlans) {
    return Inertia::render('Pricing', [
        'plans' => $resolvePublicPlans(),
    ]);
})->name('pricing');

Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

Route::get('/faqs', function () {
    return Inertia::render('faqs', [
        'faqs' => [
            [
                'question' => 'What is Fylo?',
                'answer' => 'Fylo is a cloud file storage and document management platform operating from Abuja, Nigeria. You can upload, organize in folders, preview, and share files with colleagues or clients.',
            ],
            [
                'question' => 'Is Fylo free to use?',
                'answer' => 'Yes. Every new account starts on our Free plan with 5 GB of storage and up to 50 MB per file upload at ₦0. You can upgrade to Starter (₦15,000/month), Growth (₦20,000/month), or Business (₦30,000/month) anytime.',
            ],
            [
                'question' => 'How are my files protected on Fylo?',
                'answer' => 'Uploaded files are stored in isolated server storage and served exclusively through authenticated ownership and permission checks. Public share links use cryptographic tokens with optional password protection and expiry dates.',
            ],
            [
                'question' => 'Can I access Fylo on mobile devices?',
                'answer' => 'Yes. Fylo works across desktops, laptops, tablets, and smartphones through our responsive web interface without requiring additional software installation.',
            ],
            [
                'question' => 'Can I preview files without downloading them?',
                'answer' => 'Yes. Our built-in preview modal supports images (with zoom controls), PDF documents, video and audio playback, and plain text / CSV / JSON / Markdown inspection directly in your browser.',
            ],
            [
                'question' => 'Can I share files with people who do not have a Fylo account?',
                'answer' => 'Yes. You can generate tokenized public share links for any file, protect them with an optional password, set an expiration window, or revoke access with one click.',
            ],
            [
                'question' => 'How does the Recycle Bin (Trash) work?',
                'answer' => 'When you delete a file, it moves to your Recycle Bin where you can restore it to your workspace or permanently erase it. Trashed files do not count against your active storage quota.',
            ],
            [
                'question' => 'What currency and payment methods do you support?',
                'answer' => 'All plans and transactions are billed in Nigerian Naira (₦ / NGN). We support Moneta and Paystack (Cards, Bank Transfer, USSD) with a 20% discount on annual subscriptions.',
            ],
        ],
    ]);
})->name('faqs');

/*
|--------------------------------------------------------------------------
| Payment Gateway Webhooks (CSRF Exempt)
|--------------------------------------------------------------------------
*/
Route::post('/webhooks/paystack', [SubscriptionController::class, 'handlePaystackWebhook'])
    ->name('webhooks.paystack');

/*
|--------------------------------------------------------------------------
| Public Tokenized Share Links
|--------------------------------------------------------------------------
*/
Route::prefix('s')->name('public_share.')->group(function () {
    Route::get('/{token}', [PublicShareController::class, 'show'])->name('show');
    Route::post('/{token}/verify', [PublicShareController::class, 'unlock'])
        ->middleware('throttle:10,1')
        ->name('unlock');
    Route::get('/{token}/download', [PublicShareController::class, 'download'])->name('download');
    Route::get('/{token}/preview', [PublicShareController::class, 'preview'])->name('preview');
});

/*
|--------------------------------------------------------------------------
| Authenticated User Workspace
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('recent', [DashboardController::class, 'recent'])->name('recent');
    Route::get('starred', [DashboardController::class, 'starred'])->name('starred');
    Route::get('trash', [DashboardController::class, 'trash'])->name('trash');
    Route::get('shared-files', [DashboardController::class, 'getSharedFiles'])->name('shared_files');

    // Folders Management
    Route::prefix('folders')->name('folders.')->group(function () {
        Route::get('/', [FolderController::class, 'index'])->name('index');
        Route::post('/', [FolderController::class, 'store'])->name('store');
        Route::put('/{folder_uuid}', [FolderController::class, 'update'])->name('update');
        Route::delete('/{folder_uuid}', [FolderController::class, 'destroy'])->name('destroy');
    });

    // Subscription & Billing
    Route::prefix('subscription')->name('subscription.')->group(function () {
        Route::get('/', [SubscriptionController::class, 'index'])->name('index');
        Route::get('/checkout', [SubscriptionController::class, 'showCheckout'])->name('checkout.show');
        Route::post('/checkout', [SubscriptionController::class, 'checkout'])->name('checkout');
        Route::get('/callback/{gateway?}', [SubscriptionController::class, 'handleCallback'])->name('callback');
        Route::post('/verify/{reference}', [SubscriptionController::class, 'verifyTransaction'])->name('verify');
        Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/search', [UserController::class, 'search'])->name('search');
    });

    // File Operations
    Route::prefix('file')->name('file.')->group(function () {
        Route::post('upload', [FileController::class, 'store'])->name('upload');
        Route::post('bulk', [FileController::class, 'bulkAction'])->name('bulk');
        Route::delete('/trash/empty', [FileController::class, 'emptyTrash'])->name('empty_trash');
        Route::delete('/{file_uuid}/delete', [FileController::class, 'deleteFile'])->name('delete');
        Route::post('/{file_uuid}/restore', [FileController::class, 'restoreFile'])->name('restore');
        Route::delete('/{file_uuid}/force-delete', [FileController::class, 'forceDeleteFile'])->name('force_delete');
        Route::get('/{file_uuid}/favorite', [FileController::class, 'starringFile'])->name('toggle_favorite');
        Route::get('/{file_uuid}/download', [FileController::class, 'downloadFile'])->name('download');
        Route::get('/{file_uuid}/preview', [FileController::class, 'previewFile'])->name('preview');
        Route::put('/{file_uuid}/update', [FileController::class, 'updateFile'])->name('update');
        Route::post('share', [FileController::class, 'shareFile'])->name('share');
        Route::post('/{file_uuid}/public-share', [FileController::class, 'createPublicShare'])->name('public_share');
        Route::delete('/{file_uuid}/revoke-public-share', [FileController::class, 'revokePublicShare'])->name('revoke_public_share');
        Route::post('/{file_uuid}/move', [FileController::class, 'moveFile'])->name('move');
    });
});

/*
|--------------------------------------------------------------------------
| Admin Portal
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', EnsureAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [AdminUserController::class, 'index'])->name('users');
    Route::post('/users/{id}/toggle-admin', [AdminUserController::class, 'toggleAdmin'])->name('users.toggle_admin');
    Route::post('/users/{id}/plan', [AdminUserController::class, 'updatePlan'])->name('users.update_plan');
    Route::get('/plans', [AdminPlanController::class, 'index'])->name('plans');
    Route::put('/plans/{id}', [AdminPlanController::class, 'update'])->name('plans.update');
    Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments');
    Route::get('/logs', [LogViewerController::class, 'index'])->name('logs');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
