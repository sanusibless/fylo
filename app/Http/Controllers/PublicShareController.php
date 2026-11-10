<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicShareController extends Controller
{
    public function show(Request $request, string $token)
    {
        $file = File::where('share_token', $token)
            ->where('is_public', true)
            ->first();

        if (! $file) {
            return Inertia::render('PublicShare', [
                'error' => 'This shared link is invalid or has been revoked by the owner.',
            ]);
        }

        if ($file->isShareExpired()) {
            return Inertia::render('PublicShare', [
                'error' => 'This shared link has expired.',
            ]);
        }

        $requiresPassword = ! empty($file->share_password) && ! session("unlocked_share_{$token}");

        return Inertia::render('PublicShare', [
            'file' => [
                'name' => $file->name,
                'extension' => $file->extension,
                'mime_type' => $file->mime_type,
                'size_in_mb' => $file->size_in_mb,
                'size_in_kb' => $file->size_in_kb,
                'total_downloads' => $file->total_downloads,
                'created_at' => $file->created_at->toFormattedDateString(),
                'expires_at' => $file->share_expires_at?->diffForHumans(),
                'uploader_name' => $file->user?->name ?? 'Fylo User',
            ],
            'token' => $token,
            'requiresPassword' => $requiresPassword,
        ]);
    }

    public function unlock(Request $request, string $token)
    {
        $file = File::where('share_token', $token)
            ->where('is_public', true)
            ->firstOrFail();

        $request->validate([
            'password' => 'required|string',
        ]);

        if (! Hash::check($request->password, $file->share_password)) {
            return back()->withErrors(['password' => 'Incorrect password provided. Please try again.']);
        }

        session(["unlocked_share_{$token}" => true]);

        return back();
    }

    public function download(string $token)
    {
        $file = File::where('share_token', $token)
            ->where('is_public', true)
            ->firstOrFail();

        if ($file->isShareExpired()) {
            abort(410, 'This shared link has expired.');
        }

        if (! empty($file->share_password) && ! session("unlocked_share_{$token}")) {
            abort(403, 'Password verification required.');
        }

        $relativeStoragePath = ltrim(str_replace('/storage/', '', $file->relative_path), '/');

        if (! Storage::disk('public')->exists($relativeStoragePath)) {
            abort(404, 'File not found on cloud storage.');
        }

        $file->increaseDownloads();

        return Storage::disk('public')->download($relativeStoragePath, $file->name);
    }

    public function preview(string $token)
    {
        $file = File::where('share_token', $token)
            ->where('is_public', true)
            ->firstOrFail();

        if ($file->isShareExpired()) {
            abort(410, 'This shared link has expired.');
        }

        if (! empty($file->share_password) && ! session("unlocked_share_{$token}")) {
            abort(403, 'Password verification required.');
        }

        $relativeStoragePath = ltrim(str_replace('/storage/', '', $file->relative_path), '/');

        if (! Storage::disk('public')->exists($relativeStoragePath)) {
            abort(404, 'File not found on cloud storage.');
        }

        $filePath = Storage::disk('public')->path($relativeStoragePath);

        return response()->file($filePath, [
            'Content-Type' => $file->mime_type ?: 'application/octet-stream',
            'Content-Disposition' => 'inline; filename="'.$file->name.'"',
        ]);
    }
}
