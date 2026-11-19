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
            $folderId = $request->filled('folder_id') ? (int) $request->input('folder_id') : null;
            $fileResponse = $this->fileService->storeFile(auth()->id(), $file, 'uploads', $folderId);

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
            $fileResponse = $this->fileService->setAsFavouriteFile($file_uuid, auth()->id());
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
                ], 403);
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

            $diskPath = $file->resolveDiskPath();
            $disk = $file->resolveStorageDisk();

            if (! Storage::disk($disk)->exists($diskPath)) {
                return redirect()->back()->withErrors(['file' => 'The requested file could not be found on storage.'])->withInput();
            }

            $file->increaseDownloads();
            activity()->causedBy($authId)->log("You downloaded {$file->name}");

            return Storage::disk($disk)->download($diskPath, $file->name);
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

            $diskPath = $file->resolveDiskPath();
            $disk = $file->resolveStorageDisk();

            if (! Storage::disk($disk)->exists($diskPath)) {
                abort(404, 'File not found on storage.');
            }

            $filePath = Storage::disk($disk)->path($diskPath);
            $ext = strtolower($file->extension ?: pathinfo($file->name, PATHINFO_EXTENSION));

            // Safe inline MIME types only; everything else forced as attachment or plain text
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
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            throw $e;
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
        } elseif ($request->has('clear_password') && $request->boolean('clear_password')) {
            $file->share_password = null;
        }

        if ($request->filled('expires_in_days')) {
            $file->share_expires_at = now()->addDays((int) $request->expires_in_days);
        } else {
            $file->share_expires_at = null;
        }

        $file->save();

        activity()->causedBy(auth()->id())->log("You created a public share link for {$file->name}");

        $shareUrl = rtrim(config('app.url'), '/')."/s/{$token}";

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

        activity()->causedBy(auth()->id())->log("You revoked the public share link for {$file->name}");

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
            $destinationName = $folder->name;
        } else {
            $file->folder_id = null;
            $destinationName = 'Root Drive';
        }

        $file->save();

        activity()->causedBy(auth()->id())->log("You moved {$file->name} to {$destinationName}");

        if ($request->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'File moved successfully.',
            ]);
        }

        return back()->with('status', 'File moved successfully.');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:delete,restore,force_delete,move',
            'file_uuids' => 'required|array|min:1',
            'file_uuids.*' => 'required|string',
            'folder_id' => 'nullable|integer',
        ]);

        $userId = auth()->id();
        $uuids = $validated['file_uuids'];
        $action = $validated['action'];
        $count = 0;

        if ($action === 'delete') {
            foreach ($uuids as $uuid) {
                $res = $this->fileService->deleteFile($userId, $uuid);
                if ($res['status']) {
                    $count++;
                }
            }
            $message = "{$count} file(s) moved to Trash.";
        } elseif ($action === 'restore') {
            foreach ($uuids as $uuid) {
                $res = $this->fileService->restoreFile($userId, $uuid);
                if ($res['status']) {
                    $count++;
                }
            }
            $message = "{$count} file(s) restored from Trash.";
        } elseif ($action === 'force_delete') {
            foreach ($uuids as $uuid) {
                $res = $this->fileService->forceDeleteFile($userId, $uuid);
                if ($res['status']) {
                    $count++;
                }
            }
            $message = "{$count} file(s) permanently deleted.";
        } else {
            // move
            $targetFolderId = null;
            if (! empty($validated['folder_id'])) {
                $folder = Folder::where('id', $validated['folder_id'])->where('user_id', $userId)->firstOrFail();
                $targetFolderId = $folder->id;
            }
            $count = File::where('user_id', $userId)->whereIn('uuid', $uuids)->update(['folder_id' => $targetFolderId]);
            activity()->causedBy($userId)->log("You moved {$count} file(s)");
            $message = "{$count} file(s) moved successfully.";
        }

        if ($request->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => $message,
                'count' => $count,
            ]);
        }

        return back()->with('status', $message);
    }
}
