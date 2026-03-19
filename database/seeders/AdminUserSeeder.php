<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'info@ngoforum.org.kh',
            'password' => Hash::make('Admin#2025'),
            'role' => 'admin',
            'program' => 'System Administrator',
            'position' => 'System Administrator',
            'gender' => 'male',
        ]);
    }
}