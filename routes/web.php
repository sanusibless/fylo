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
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Rap2hpoutre\LaravelLogViewer\LogViewerController;

/*
|--------------------------------------------------------------------------
| Public SaaS Pages
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/features', function () {
    return Inertia::render('features');
})->name('features');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
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
                'answer' => 'Fylo is a secure cloud storage and collaboration platform where you can store, share, and work on files in real time with your team.',
            ],
            [
                'question' => 'Is Fylo free to use?',
                'answer' => 'Yes! Fylo offers a generous Free plan with 10 GB storage. For higher quotas, password-protected links, and version history, you can upgrade to Basic, Pro, or Business at any time.',
            ],
            [
                'question' => 'How secure are my files on Fylo?',
                'answer' => 'Security is our top priority. Fylo uses AES-256 end-to-end encryption at rest and TLS 1.3 in transit to ensure your files are safe from unauthorized access.',
            ],
            [
                'question' => 'Can I access Fylo on mobile devices?',
                'answer' => 'Absolutely! Fylo works seamlessly across desktops, tablets, and smartphones through our fully responsive web platform.',
            ],
            [
                'question' => 'Can I preview files without downloading them?',
                'answer' => 'Yes! Our built-in media viewer supports video and audio playback, PDF reading, image lightbox, and text/code inspection right in your browser.',
            ],
            [
                'question' => 'Can I share files with people who do not have a Fylo account?',
                'answer' => 'Yes! You can generate secure, tokenized public share links with optional password protection and customizable expiration dates.',
            ],
            [
                'question' => 'How does the recycle bin / trash work?',
                'answer' => 'Deleted files are moved to your Trash bin. Depending on your plan, you have 7 to 90 days to restore files before they are permanently purged.',
            ],
            [
                'question' => 'What payment methods do you accept?',
                'answer' => 'We support major cards, Apple Pay, Google Pay, and localized African gateways including Paystack and Flutterwave.',
            ],
        ],
    ]);
})->name('faqs');

/*
|--------------------------------------------------------------------------
| Public Tokenized Share Links
|--------------------------------------------------------------------------
*/
Route::prefix('s')->name('public_share.')->group(function () {
    Route::get('/{token}', [PublicShareController::class, 'show'])->name('show');
    Route::post('/{token}/verify', [PublicShareController::class, 'unlock'])->name('unlock');
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
        Route::post('/checkout', [SubscriptionController::class, 'checkout'])->name('checkout');
        Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/search', [UserController::class, 'search'])->name('search');
    });

    // File Operations
    Route::prefix('file')->name('file.')->group(function () {
        Route::post('upload', [FileController::class, 'store'])->name('upload');
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

    Route::get('logs', [LogViewerController::class, 'index'])->name('logs');
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
