<?php

namespace App\Http\Controllers;

use App\Http\Requests\EditFileNameRequest;
use App\Http\Requests\FileUploadRequest;
use App\Http\Requests\ShareFileRequest;
use App\Models\File;
use App\Models\Folder;
use App\Models\SharedFile;
use App\Services\FileService;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function __construct(protected FileService $fileService) {}

    public function store(FileUploadRequest $request)
    {
        try {
            $file = $request->file('file');
            $fileResponse = $this->fileService->storeFile(auth()->id(), $file);

            if ($fileResponse['status']) {
                if ($request->expectsJson()) {
                    return response()->json($fileResponse, 201);
                }

                return redirect()->back()->with('status', $fileResponse['message']);
            }

            if ($request->expectsJson()) {
                return response()->json(['message' => $fileResponse['message'] ?? 'Unable to upload file'], 422);
            }

            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to upload file'])->withInput();
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::store', $th);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to upload file'])->withInput();
    }

    public function starringFile($file_uuid)
    {
        try {
            $fileResponse = $this->fileService->setAsFavouriteFile($file_uuid);
            if ($fileResponse['status']) {
                if (request()->expectsJson()) {
                    return response()->json([
                        'starred' => $fileResponse['data']['starred'],
                        'message' => $fileResponse['data']['message'],
                    ]);
                }

                return redirect()->back()->with('starred', $fileResponse['data']['starred']);
            }

            if (request()->expectsJson()) {
                return response()->json([
                    'error' => $fileResponse['message'] ?? 'Unable to toggle favorite status',
                ], 400);
            }

            return redirect()->back()->withErrors(['error' => $fileResponse['message'] ?? 'Unable to toggle favorite status']);
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::starringFile', $th);
        }

        if (request()->expectsJson()) {
            return response()->json(['error' => 'Unable to toggle favorite status'], 500);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to toggle favorite status'])->withInput();
    }

    public function downloadFile($file_uuid)
    {
        try {
            $file = File::withTrashed()->where('uuid', $file_uuid)->first();
            if (! $file) {
                return redirect()->back()->withErrors(['file' => 'File not found'])->withInput();
            }

            $authId = auth()->id();
            $isOwner = $file->user_id === $authId;
            $isShared = SharedFile::where('file_id', $file->id)->where('receiver_id', $authId)->exists();

            if (! $isOwner && ! $isShared) {
                return redirect()->back()->withErrors(['file' => 'You do not have permission to download this file.'])->withInput();
            }

            $relativeStoragePath = ltrim(str_replace('/storage/', '', $file->relative_path), '/');

            if (! \Illuminate\Support\Facades\Storage::disk('public')->exists($relativeStoragePath)) {
                return redirect()->back()->withErrors(['file' => 'The requested file could not be found on storage.'])->withInput();
            }

            $file->increaseDownloads();
            activity()->causedBy($authId)->log("You downloaded {$file->name}");

            return \Illuminate\Support\Facades\Storage::disk('public')->download($relativeStoragePath, $file->name);
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::downloadFile', $th);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to download file'])->withInput();
    }

    public function shareFile(ShareFileRequest $request)
    {
        try {
            $fileResponse = $this->fileService->shareFile(auth()->id(), $request->file_uuid, $request->receiver_email);
            if ($fileResponse['status']) {
                if ($request->expectsJson()) {
                    return response()->json($fileResponse, 200);
                }

                return redirect()->back()->with('status', $fileResponse['message']);
            }

            if ($request->expectsJson()) {
                return response()->json(['message' => $fileResponse['message'] ?? 'Unable to share file'], 422);
            }

            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to share file'])->withInput();
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::shareFile', $th);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to share file'])->withInput();
    }

    public function updateFile(EditFileNameRequest $request, $file_uuid)
    {
        try {
            $fileResponse = $this->fileService->updateFile(auth()->id(), $file_uuid, $request->name);
            if ($fileResponse['status']) {
                if ($request->expectsJson()) {
                    return response()->json($fileResponse, 200);
                }

                return redirect()->back()->with('status', $fileResponse['message']);
            }

            if ($request->expectsJson()) {
                return response()->json(['message' => $fileResponse['message'] ?? 'Unable to update file name'], 422);
            }

            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to update file name'])->withInput();
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::updateFile', $th);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to update file name'])->withInput();
    }

    public function deleteFile($file_uuid)
    {
        try {
            $fileResponse = $this->fileService->deleteFile(auth()->id(), $file_uuid);
            if ($fileResponse['status']) {
                if (request()->expectsJson()) {
                    return response()->json($fileResponse, 200);
                }

                return redirect()->back()->with('status', $fileResponse['message']);
            }

            if (request()->expectsJson()) {
                return response()->json(['message' => $fileResponse['message'] ?? 'Unable to delete file'], 422);
            }

            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to delete file'])->withInput();
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::deleteFile', $th);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to delete file'])->withInput();
    }

    public function restoreFile($file_uuid)
    {
        try {
            $fileResponse = $this->fileService->restoreFile(auth()->id(), $file_uuid);
            if ($fileResponse['status']) {
                if (request()->expectsJson()) {
                    return response()->json($fileResponse, 200);
                }

                return redirect()->back()->with('status', $fileResponse['message']);
            }

            if (request()->expectsJson()) {
                return response()->json(['message' => $fileResponse['message'] ?? 'Unable to restore file'], 422);
            }

            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to restore file'])->withInput();
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::restoreFile', $th);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to restore file'])->withInput();
    }

    public function forceDeleteFile($file_uuid)
    {
        try {
            $fileResponse = $this->fileService->forceDeleteFile(auth()->id(), $file_uuid);
            if ($fileResponse['status']) {
                if (request()->expectsJson()) {
                    return response()->json($fileResponse, 200);
                }

                return redirect()->back()->with('status', $fileResponse['message']);
            }

            if (request()->expectsJson()) {
                return response()->json(['message' => $fileResponse['message'] ?? 'Unable to permanently delete file'], 422);
            }

            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to permanently delete file'])->withInput();
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::forceDeleteFile', $th);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to permanently delete file'])->withInput();
    }

    public function emptyTrash()
    {
        try {
            $fileResponse = $this->fileService->emptyTrash(auth()->id());
            if ($fileResponse['status']) {
                if (request()->expectsJson()) {
                    return response()->json($fileResponse, 200);
                }

                return redirect()->back()->with('status', $fileResponse['message']);
            }

            if (request()->expectsJson()) {
                return response()->json(['message' => $fileResponse['message'] ?? 'Unable to empty trash'], 422);
            }

            return redirect()->back()->withErrors(['file' => $fileResponse['message'] ?? 'Unable to empty trash'])->withInput();
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::emptyTrash', $th);
        }

        return redirect()->back()->withErrors(['file' => 'Unable to empty trash'])->withInput();
    }

    public function previewFile($file_uuid)
    {
        try {
            $file = File::withTrashed()->where('uuid', $file_uuid)->firstOrFail();
            $authId = auth()->id();
            $isOwner = $file->user_id === $authId;
            $isShared = SharedFile::where('file_id', $file->id)->where('receiver_id', $authId)->exists();

            if (! $isOwner && ! $isShared) {
                abort(403, 'Unauthorized access to preview.');
            }

            $relativeStoragePath = ltrim(str_replace('/storage/', '', $file->relative_path), '/');

            if (! Storage::disk('public')->exists($relativeStoragePath)) {
                abort(404, 'File not found on storage.');
            }

            $filePath = Storage::disk('public')->path($relativeStoragePath);

            return response()->file($filePath, [
                'Content-Type' => $file->mime_type ?: 'application/octet-stream',
                'Content-Disposition' => 'inline; filename="'.$file->name.'"',
            ]);
        } catch (\Throwable $th) {
            GeneralService::generalLog('Error in FileController::previewFile', $th);
            abort(404, 'Unable to preview file.');
        }
    }

    public function createPublicShare(Request $request, $file_uuid)
    {
        $request->validate([
            'password' => 'nullable|string|min:4|max:100',
            'expires_in_days' => 'nullable|integer|min:1|max:365',
        ]);

        $file = File::where('uuid', $file_uuid)->where('user_id', auth()->id())->firstOrFail();

        $token = $file->share_token ?: Str::random(32);
        $file->share_token = $token;
        $file->is_public = true;

        if ($request->filled('password')) {
            $file->share_password = Hash::make($request->password);
        }

        if ($request->filled('expires_in_days')) {
            $file->share_expires_at = now()->addDays((int) $request->expires_in_days);
        }

        $file->save();

        $shareUrl = url("/s/{$token}");

        if ($request->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'Public share link created successfully.',
                'share_url' => $shareUrl,
                'token' => $token,
                'has_password' => ! empty($file->share_password),
                'expires_at' => $file->share_expires_at?->toIso8601String(),
            ]);
        }

        return back()->with('status', 'Share link activated!')->with('share_url', $shareUrl);
    }

    public function revokePublicShare(Request $request, $file_uuid)
    {
        $file = File::where('uuid', $file_uuid)->where('user_id', auth()->id())->firstOrFail();

        $file->is_public = false;
        $file->share_token = null;
        $file->share_password = null;
        $file->share_expires_at = null;
        $file->save();

        if ($request->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'Public share link revoked successfully.',
            ]);
        }

        return back()->with('status', 'Public share link revoked.');
    }

    public function moveFile(Request $request, $file_uuid)
    {
        $request->validate([
            'folder_id' => 'nullable|integer',
        ]);

        $file = File::where('uuid', $file_uuid)->where('user_id', auth()->id())->firstOrFail();

        if ($request->filled('folder_id')) {
            $folder = Folder::where('id', $request->folder_id)->where('user_id', auth()->id())->firstOrFail();
            $file->folder_id = $folder->id;
        } else {
            $file->folder_id = null;
        }

        $file->save();

        if ($request->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'File moved successfully.',
            ]);
        }

        return back()->with('status', 'File moved successfully.');
    }
}
