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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:png,jpg,jpeg,gif,svg,webp,pdf,doc,docx,xls,xlsx,csv,ppt,pptx,txt,rtf,odt,mp4,mov,avi,wav,mp3,ogg,zip,rar,7z,tar,gz',
                'max:51200', // 50 MB
            ],
        ];
    }
}
