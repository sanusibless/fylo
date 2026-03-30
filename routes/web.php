<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Rap2hpoutre\LaravelLogViewer\LogViewerController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/features', function () {
    return Inertia::render('features');
})->name('features');

Route::get('/faqs', function () {
    return Inertia::render('faqs',[
        'faqs' => [
            [
                "question" => "What is Fylo?",
                "answer"   => "Fylo is a secure cloud storage and collaboration platform where you can store, share, and work on files in real time with your team.",
            ],
            [
                "question" => "Is Fylo free to use?",
                "answer"   => "Yes! Fylo offers a free plan with generous storage. For advanced features like unlimited collaboration and enhanced security, you can upgrade to a paid plan anytime.",
            ],
            [
                "question" => "How secure are my files on Fylo?",
                "answer"   => "Security is our top priority. Fylo uses end-to-end encryption and two-factor authentication to ensure your files are safe from unauthorized access.",
            ],
            [
                "question" => "Can I access Fylo on mobile devices?",
                "answer"   => "Absolutely! Fylo works seamlessly on desktops, tablets, and mobile phones through our responsive web app and dedicated mobile apps.",
            ],
            [
                "question" => "How does real-time collaboration work?",
                "answer"   => "Fylo allows multiple users to view, edit, and comment on files at the same time. No more sending endless versions — everyone stays on the same page.",
            ],
            [
                "question" => "What file types can I upload to Fylo?",
                "answer"   => "You can upload almost any type of file — from documents and spreadsheets to images, videos, and audio files. Fylo supports it all.",
            ],
            [
                "question" => "Can I share files with people who don’t use Fylo?",
                "answer"   => "Yes! You can generate secure shareable links for anyone, even if they don’t have a Fylo account.",
            ],
            [
                "question" => "How do I upgrade to a premium plan?",
                "answer" => "You can upgrade at any time by visiting your Account Settings and clicking on the 'Subscription' tab. Changes take effect immediately.",
            ],
            [
                "question" => "What happens when my free trial ends?",
                "answer" => "Once your 14-day trial expires, your account will automatically shift to our Free Plan. Your files will remain safe, but advanced collaboration features will be locked until you subscribe.",
            ],
            [
                "question" => "Can I cancel my subscription whenever I want?",
                "answer" => "Yes. Fylo is a month-to-month service. If you cancel, you will maintain access to your premium features until the end of your current billing cycle.",
            ],
            [
                "question" => "Do you offer discounts for non-profits or students?",
                "answer" => "We do! Please reach out to our billing team with a valid ID or documentation, and we’ll apply a 30% discount to your account.",
            ],
        ]
    ]);
})->name('faqs');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('shared-files', [DashboardController::class, 'getSharedFiles'])->name('shared_files');

    // routes/web.php
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/search', [UserController::class, 'search'])->name('search');
    });

    // File Upload
    Route::prefix('file')->name('file.')->group(function () {
        Route::post('upload', [FileController::class, 'store'])->name('upload');
        Route::delete('/{file_uuid}/delete', [FileController::class, 'deleteFile'])->name('delete');
        Route::get('/{file_uuid}/favorite', [FileController::class, 'starringFile'])->name('toggle_favorite');
        Route::get('/{file_uuid}/download', [FileController::class, 'downloadFile'])->name('download');
        Route::put('/{file_uuid}/update', [FileController::class, 'updateFile'])->name('update');
        Route::delete('/{file_uuid}/delete', [FileController::class, 'deleteFile'])->name('delete');

        // share files
        Route::post('share', [FileController::class, 'shareFile'])->name('share');

    });


    // Route::get('dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('recent');

    // Route::get('dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('starred');

    // Route::get('dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('shared');

    // Route::get('dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('folders');

    // Route::get('dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('trash');
});

Route::get('logs', [LogViewerController::class, 'index']);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
