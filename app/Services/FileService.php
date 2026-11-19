<?php

namespace App\Services;

use App\Models\File;
use App\Models\Folder;
use App\Models\SharedFile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService extends GeneralService
{
    protected $name = 'FileService';

    public function storeFile($user_id, UploadedFile $file, $folder = 'uploads', ?int $folder_id = null)
    {
        try {
            return DB::transaction(function () use ($user_id, $file, $folder, $folder_id) {
                $user = User::lockForUpdate()->find($user_id);
                if (! $user) {
                    return $this->serviceResponse(false, 'User not found', null);
                }

                $fileSize = (int) $file->getSize();
                if (! $user->hasAvailableStorageFor($fileSize)) {
                    return $this->serviceResponse(false, 'Storage quota exceeded. Please upgrade your storage plan or free up space.', null);
                }

                // Verify folder ownership if folder_id is provided
                $resolvedFolderId = null;
                if ($folder_id) {
                    $targetFolder = Folder::where('id', $folder_id)->where('user_id', $user_id)->first();
                    if (! $targetFolder) {
                        return $this->serviceResponse(false, 'Selected destination folder does not exist or does not belong to you.', null);
                    }
                    $resolvedFolderId = $targetFolder->id;
                }

                $base_url = rtrim(config('app.url'), '/');
                $originalName = $file->getClientOriginalName();
                $extension = strtolower($file->getClientOriginalExtension() ?: pathinfo($originalName, PATHINFO_EXTENSION));
                $baseName = pathinfo($originalName, PATHINFO_FILENAME);

                // Prevent dangerous executable extensions
                $allowedExtensions = config('fylo.storage.allowed_extensions', []);
                if (! empty($allowedExtensions) && ! in_array($extension, $allowedExtensions, true)) {
                    return $this->serviceResponse(false, "File extension .{$extension} is not permitted.", null);
                }

                $slugBase = Str::slug($baseName);
                if (empty($slugBase)) {
                    $slugBase = 'file_'.time();
                }
                $sanitizedDisplayName = $slugBase.($extension ? '.'.$extension : '');

                // Deduplicate display name within the same folder for this user
                $counter = 1;
                $candidateName = $sanitizedDisplayName;
                while (
                    File::where('user_id', $user_id)
                        ->where('folder_id', $resolvedFolderId)
                        ->where('name', $candidateName)
                        ->exists()
                ) {
                    $candidateName = "{$slugBase}-{$counter}".($extension ? '.'.$extension : '');
                    $counter++;
                }
                $sanitizedDisplayName = $candidateName;

                $storageDisk = config('fylo.storage.disk', 'local');
                $storageFileName = (string) Str::uuid().($extension ? '.'.$extension : '');
                $storedPath = $file->storeAs($folder, $storageFileName, $storageDisk);

                if (! $storedPath) {
                    return $this->serviceResponse(false, 'Failed to write file to storage disk.', null);
                }

                $mimeType = $file->getClientMimeType() ?: $file->getMimeType() ?: 'application/octet-stream';

                $fileRecord = File::create([
                    'user_id' => $user_id,
                    'folder_id' => $resolvedFolderId,
                    'name' => $sanitizedDisplayName,
                    'type' => getFileType($extension),
                    'mime_type' => $mimeType,
                    'extension' => $extension,
                    'size' => $fileSize,
                    'base_url' => $base_url,
                    'full_path' => $base_url.'/storage/'.$storedPath,
                    'relative_path' => '/storage/'.$storedPath,
                    'storage_disk' => $storageDisk,
                ]);

                activity()->causedBy($user_id)->log("You uploaded {$sanitizedDisplayName}");

                return $this->serviceResponse(true, 'File uploaded successfully', $fileRecord);
            });
        } catch (\Throwable $th) {
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to upload file', null);
    }

    public function setAsFavouriteFile($file_uuid, ?int $auth_id = null)
    {
        try {
            $userId = $auth_id ?? auth()->id();
            $file = File::where('uuid', $file_uuid)->where('user_id', $userId)->first();
            if (! $file) {
                return $this->serviceResponse(false, 'File not found or unauthorized', null);
            }
            $file->update([
                'is_favorite' => ! $file->is_favorite,
            ]);

            activity()->causedBy($userId)->log("You set {$file->name} as ".($file->is_favorite ? 'starred' : 'unstarred'));

            return $this->serviceResponse(true, '', [
                'starred' => (bool) $file->is_favorite,
                'message' => $file->is_favorite ? 'File starred successfully' : 'File unstarred successfully',
            ]);
        } catch (\Throwable $th) {
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to star file', null);
    }

    public function shareFile($auth_id, $file_uuid, $user_email)
    {
        try {
            $file = File::where('uuid', $file_uuid)->first();
            $receiver_user = User::where('email', $user_email)->first();
            if (! $file) {
                return $this->serviceResponse(false, 'File not found', null);
            }
            if (! $receiver_user) {
                return $this->serviceResponse(false, 'User not found', null);
            }
            if ($receiver_user->id == $auth_id) {
                return $this->serviceResponse(false, 'You cannot share a file with yourself', null);
            }
            if ($file->user_id != $auth_id) {
                return $this->serviceResponse(false, 'You do not have permission to share this file', null);
            }

            $alreadyShared = SharedFile::where('file_id', $file->id)
                ->where('receiver_id', $receiver_user->id)
                ->exists();
            if ($alreadyShared) {
                return $this->serviceResponse(false, 'This file has already been shared with this user', null);
            }

            $shared_file = SharedFile::create([
                'file_id' => $file->id,
                'user_id' => $auth_id,
                'receiver_id' => $receiver_user->id,
            ]);
            if ($shared_file) {
                activity()->causedBy($auth_id)->log("You shared {$file->name} with {$receiver_user->name}");

                return $this->serviceResponse(true, 'File shared successfully', null);
            }
        } catch (\Throwable $th) {
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to share file', null);
    }

    public function updateFile($auth_id, $file_uuid, $name)
    {
        try {
            $file = File::where('uuid', $file_uuid)->first();
            if (! $file) {
                return $this->serviceResponse(false, 'File not found', null);
            }
            if ($file->user_id == $auth_id) {
                $former_name = $file->name;
                $extension = $file->extension ?: pathinfo($former_name, PATHINFO_EXTENSION);
                $baseName = pathinfo($name, PATHINFO_FILENAME);
                $slugBase = Str::slug($baseName) ?: 'file';
                $new_name = $slugBase.($extension ? '.'.strtolower($extension) : '');

                $file->update([
                    'name' => $new_name,
                ]);

                activity()->causedBy($auth_id)->log("You renamed {$former_name} to {$new_name}");

                return $this->serviceResponse(true, 'File name updated successfully', $file);
            }

            return $this->serviceResponse(false, "You don't have permission to update this file", null);
        } catch (\Throwable $th) {
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to update file name', null);
    }

    public function deleteFile($auth_id, $file_uuid)
    {
        try {
            $file = File::where('uuid', $file_uuid)->first();
            if (! $file) {
                return $this->serviceResponse(false, 'File not found', null);
            }
            if ($file->user_id == $auth_id) {
                $file_name = $file->name;
                $file->delete();
                activity()->causedBy($auth_id)->log("You moved {$file_name} to Trash");

                return $this->serviceResponse(true, 'File moved to Trash', null);
            }

            return $this->serviceResponse(false, "You don't have permission to delete this file", null);
        } catch (\Throwable $th) {
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to delete file', null);
    }

    public function restoreFile($auth_id, $file_uuid)
    {
        try {
            return DB::transaction(function () use ($auth_id, $file_uuid) {
                $user = User::lockForUpdate()->find($auth_id);
                $file = File::onlyTrashed()->where('uuid', $file_uuid)->first();
                if (! $file) {
                    return $this->serviceResponse(false, 'File not found in Trash', null);
                }
                if ($file->user_id != $auth_id) {
                    return $this->serviceResponse(false, "You don't have permission to restore this file", null);
                }

                // If trash does not consume quota, verify restoring won't exceed quota
                if (! config('fylo.storage.trash_consumes_quota', false) && $user && ! $user->hasAvailableStorageFor((int) $file->size)) {
                    return $this->serviceResponse(false, 'Restoring this file would exceed your storage quota. Please free up space or upgrade your plan.', null);
                }

                $file->restore();
                activity()->causedBy($auth_id)->log("You restored {$file->name} from Trash");

                return $this->serviceResponse(true, 'File restored successfully', null);
            });
        } catch (\Throwable $th) {
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to restore file', null);
    }

    public function forceDeleteFile($auth_id, $file_uuid)
    {
        try {
            DB::beginTransaction();
            $file = File::withTrashed()->where('uuid', $file_uuid)->first();
            if (! $file) {
                DB::rollBack();

                return $this->serviceResponse(false, 'File not found', null);
            }
            if ($file->user_id == $auth_id) {
                $fileName = $file->name;
                $diskPath = $file->resolveDiskPath();
                $disk = $file->resolveStorageDisk();
                if (Storage::disk($disk)->exists($diskPath)) {
                    Storage::disk($disk)->delete($diskPath);
                }
                if ($disk !== 'public' && Storage::disk('public')->exists($diskPath)) {
                    Storage::disk('public')->delete($diskPath);
                }
                SharedFile::where('file_id', $file->id)->delete();
                $file->forceDelete();
                DB::commit();

                activity()->causedBy($auth_id)->log("You permanently deleted {$fileName}");

                return $this->serviceResponse(true, 'File permanently deleted', null);
            }

            DB::rollBack();

            return $this->serviceResponse(false, "You don't have permission to permanently delete this file", null);
        } catch (\Throwable $th) {
            DB::rollBack();
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to permanently delete file', null);
    }

    public function emptyTrash($auth_id)
    {
        try {
            DB::beginTransaction();
            $trashedFiles = File::onlyTrashed()->where('user_id', $auth_id)->get();
            foreach ($trashedFiles as $file) {
                $diskPath = $file->resolveDiskPath();
                $disk = $file->resolveStorageDisk();
                if (Storage::disk($disk)->exists($diskPath)) {
                    Storage::disk($disk)->delete($diskPath);
                }
                if ($disk !== 'public' && Storage::disk('public')->exists($diskPath)) {
                    Storage::disk('public')->delete($diskPath);
                }
                SharedFile::where('file_id', $file->id)->delete();
                $file->forceDelete();
            }
            DB::commit();
            activity()->causedBy($auth_id)->log('You emptied the Trash');

            return $this->serviceResponse(true, 'Trash emptied successfully', null);
        } catch (\Throwable $th) {
            DB::rollBack();
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to empty trash', null);
    }
}
