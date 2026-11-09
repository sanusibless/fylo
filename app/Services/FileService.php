<?php

namespace App\Services;

use App\Models\File;
use App\Models\SharedFile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService extends GeneralService
{
    protected $name = 'FileService';

    public function storeFile($user_id, UploadedFile $file, $folder = 'uploads')
    {
        try {
            $user = User::find($user_id);
            if (! $user) {
                return $this->serviceResponse(false, 'User not found', null);
            }

            if (! $user->hasAvailableStorageFor($file->getSize())) {
                return $this->serviceResponse(false, 'Storage quota exceeded. Please upgrade your storage plan.', null);
            }

            $base_url = rtrim(config('app.url'), '/');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension() ?: pathinfo($originalName, PATHINFO_EXTENSION);
            $baseName = pathinfo($originalName, PATHINFO_FILENAME);
            $sanitizedDisplayName = Str::slug($baseName).($extension ? '.'.strtolower($extension) : '');
            if (empty($sanitizedDisplayName)) {
                $sanitizedDisplayName = 'file_'.time().($extension ? '.'.strtolower($extension) : '');
            }

            $storageFileName = (string) Str::uuid().($extension ? '.'.strtolower($extension) : '');
            $storedPath = $file->storeAs($folder, $storageFileName, 'public');

            $fileRecord = File::create([
                'user_id' => $user_id,
                'name' => $sanitizedDisplayName,
                'type' => getFileType($extension),
                'size' => $file->getSize(),
                'base_url' => $base_url,
                'full_path' => $base_url.'/storage/'.$storedPath,
                'relative_path' => '/storage/'.$storedPath,
            ]);

            activity()->causedBy($user_id)->log("You uploaded {$sanitizedDisplayName}");

            return $this->serviceResponse(true, 'File uploaded successfully', $fileRecord);
        } catch (\Throwable $th) {
            $this->logError($th);
        }

        return $this->serviceResponse(false, 'Unable to upload file', null);
    }

    public function setAsFavouriteFile($file_uuid)
    {
        try {
            $file = File::where('uuid', $file_uuid)->first();
            if (! $file) {
                return $this->serviceResponse(false, 'File not found', null);
            }
            $file->update([
                'is_favorite' => ! $file->is_favorite,
            ]);

            activity()->causedBy(auth()->id())->log("You set {$file->name} as ".($file->is_favorite ? 'favourite' : 'unfavourite').' file');

            return $this->serviceResponse(true, '', [
                'starred' => $file->is_favorite,
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
                $extension = pathinfo($former_name, PATHINFO_EXTENSION);
                $baseName = pathinfo($name, PATHINFO_FILENAME);
                $new_name = Str::slug($baseName).($extension ? '.'.strtolower($extension) : '');

                $file->update([
                    'name' => $new_name,
                ]);

                activity()->causedBy($auth_id)->log("You renamed {$former_name} to {$new_name}");

                return $this->serviceResponse(true, 'File name updated successfully', null);
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
            $file = File::onlyTrashed()->where('uuid', $file_uuid)->first();
            if (! $file) {
                return $this->serviceResponse(false, 'File not found in Trash', null);
            }
            if ($file->user_id == $auth_id) {
                $file->restore();
                activity()->causedBy($auth_id)->log("You restored {$file->name} from Trash");

                return $this->serviceResponse(true, 'File restored successfully', null);
            }

            return $this->serviceResponse(false, "You don't have permission to restore this file", null);
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
                return $this->serviceResponse(false, 'File not found', null);
            }
            if ($file->user_id == $auth_id) {
                $fileName = $file->name;
                $diskPath = ltrim(str_replace('/storage/', '', $file->relative_path), '/');
                if (Storage::disk('public')->exists($diskPath)) {
                    Storage::disk('public')->delete($diskPath);
                }
                SharedFile::where('file_id', $file->id)->delete();
                $file->forceDelete();
                DB::commit();

                activity()->causedBy($auth_id)->log("You permanently deleted {$fileName}");

                return $this->serviceResponse(true, 'File permanently deleted', null);
            }

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
                $diskPath = ltrim(str_replace('/storage/', '', $file->relative_path), '/');
                if (Storage::disk('public')->exists($diskPath)) {
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
