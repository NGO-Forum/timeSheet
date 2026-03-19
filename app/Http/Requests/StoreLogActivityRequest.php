<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLogActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donor_id' => ['nullable', 'exists:donors,id'],
            'leave_type_id' => ['nullable', 'exists:leave_types,id'],
            'date' => ['required', 'date'],
            'task' => ['required', 'string'],
            'project' => ['nullable', 'string'],
            'hours' => ['required', 'numeric', 'min:0', 'max:8'],
            'remarks' => ['nullable', 'string'],
        ];
    }
}