<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
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
    return Inertia::render('faqs');
})->name('faqs');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // File Upload
    Route::prefix('file')->name('file.')->group(function () {
        Route::post('upload', [FileController::class, 'store'])->name('upload');
        Route::get('/{file_uuid}/favorite', [FileController::class, 'starringFile'])->name('toggle_favorite');
        Route::get('/{file_uuid}/download', [FileController::class, 'downloadFile'])->name('download');
    });

    Route::get('logs', [LogViewerController::class, 'index']);

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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
