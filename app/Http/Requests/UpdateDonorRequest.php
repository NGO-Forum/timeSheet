<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDonorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $donorId = $this->route('donor')->id ?? $this->route('donor');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('donors', 'name')->ignore($donorId),
            ],
        ];
    }
}