<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditFileNameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('file_uuid') && $this->route('file_uuid')) {
            $this->merge([
                'file_uuid' => $this->route('file_uuid'),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file_uuid' => 'required|string|exists:uploaded_files,uuid',
            'name' => 'required|string|min:1|max:255',
        ];
    }
}
