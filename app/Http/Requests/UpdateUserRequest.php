<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->route('user');
        $userId = is_object($user) ? $user->id : $user;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],

            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],

            'password' => [
                'nullable',
                'confirmed',
                Password::min(6),
            ],

            'role' => [
                'sometimes',
                'required',
                Rule::in(['admin', 'manager', 'staff']),
            ],

            'program' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],

            'gender' => [
                'nullable',
                Rule::in(['male', 'female']),
            ],

            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'User name is required.',
            'email.required' => 'Email is required.',
            'email.unique' => 'This email already exists.',
            'password.confirmed' => 'Password confirmation does not match.',
            'role.required' => 'Role is required.',
            'role.in' => 'Selected role is invalid.',
            'gender.in' => 'Selected gender is invalid.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Image must be a JPG, JPEG, PNG, or WEBP file.',
            'image.max' => 'Image size must not exceed 5MB.',
        ];
    }
}