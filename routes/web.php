<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('recent');

    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('starred');

    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('shared');

    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('folders');

    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('trash');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
