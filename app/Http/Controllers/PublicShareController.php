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
                'extension' => $file->extension ?: pathinfo($file->name, PATHINFO_EXTENSION),
                'mime_type' => $file->mime_type,
                'size_in_mb' => $file->size_in_mb,
                'size_in_kb' => $file->size_in_kb,
                'total_downloads' => $file->total_downloads,
                'created_at' => $file->created_at?->toFormattedDateString() ?? 'Recently',
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

        $diskPath = $file->resolveDiskPath();
        $disk = $file->resolveStorageDisk();

        if (! Storage::disk($disk)->exists($diskPath)) {
            abort(404, 'File not found on cloud storage.');
        }

        $file->increaseDownloads();

        return Storage::disk($disk)->download($diskPath, $file->name);
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

        $diskPath = $file->resolveDiskPath();
        $disk = $file->resolveStorageDisk();

        if (! Storage::disk($disk)->exists($diskPath)) {
            abort(404, 'File not found on cloud storage.');
        }

        $filePath = Storage::disk($disk)->path($diskPath);
        $ext = strtolower($file->extension ?: pathinfo($file->name, PATHINFO_EXTENSION));

        $safeInlineMimes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'pdf' => 'application/pdf',
            'mp4' => 'video/mp4',
            'webm' => 'video/webm',
            'mov' => 'video/quicktime',
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',
            'ogg' => 'audio/ogg',
            'm4a' => 'audio/mp4',
            'txt' => 'text/plain; charset=utf-8',
            'csv' => 'text/plain; charset=utf-8',
            'md' => 'text/plain; charset=utf-8',
            'json' => 'application/json; charset=utf-8',
        ];

        $contentType = $safeInlineMimes[$ext] ?? 'application/octet-stream';
        $disposition = isset($safeInlineMimes[$ext]) ? 'inline' : 'attachment';

        return response()->file($filePath, [
            'Content-Type' => $contentType,
            'Content-Disposition' => $disposition.'; filename="'.addslashes($file->name).'"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
