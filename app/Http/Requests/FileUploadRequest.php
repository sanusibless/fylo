<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        $maxFileSizeMB = $user ? $user->maxUploadSizeMB() : config('fylo.storage.default_max_file_size_mb', 50);
        $maxKilobytes = $maxFileSizeMB * 1024;
        $allowedExtensions = implode(',', config('fylo.storage.allowed_extensions', [
            'jpg', 'jpeg', 'png', 'gif', 'webp',
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'md', 'json',
            'mp4', 'mov', 'avi', 'webm',
            'mp3', 'wav', 'ogg', 'm4a',
            'zip', 'rar', '7z', 'tar', 'gz',
        ]));

        return [
            'file' => [
                'required',
                'file',
                "extensions:{$allowedExtensions}",
                "max:{$maxKilobytes}",
            ],
            'folder_id' => ['nullable', 'integer'],
        ];
    }

    public function messages(): array
    {
        $user = $this->user();
        $maxFileSizeMB = $user ? $user->maxUploadSizeMB() : config('fylo.storage.default_max_file_size_mb', 50);

        return [
            'file.max' => "The file exceeds your plan's maximum single-upload limit of {$maxFileSizeMB} MB.",
            'file.extensions' => 'This file type is not permitted for security reasons.',
        ];
    }
}
