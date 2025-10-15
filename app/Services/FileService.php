<?php
namespace App\Services;

use App\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService extends GeneralService
{

    protected $name = 'FileService';

    public function storeFile($user_id, UploadedFile $file, $folder = 'uploads') 
    {
        try {

            $base_url = config('app.url');
            $name = explode('.', $file->getClientOriginalName())[0];
            $fileName = str()->slug($name) . "." . $file->getClientOriginalExtension();
            $filePath =  $file->storeAs($folder, $fileName, 'public');
            File::create([
                'user_id' => $user_id,
                'name' => $fileName,
                'type' => $file->getClientOriginalExtension(),
                'size' => $file->getSize(),
                'base_url' => $base_url,
                'full_path' => $base_url . "/storage" . "/$filePath",
                'relative_path' => "/storage/$filePath"
            ]);
            return $this->serviceResponse(true, "File Uploaded successfully", null);
        } catch (\Throwable $th) {
            $this->logError($th);
        }
        return $this->serviceResponse(false, "Unable to upload file", null);
    }
}