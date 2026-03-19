<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LeaveType;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            ['name' => 'Sick Leave', 'code' => 'SICK'],
            ['name' => 'Mat./ Pat. Leave', 'code' => 'MAT_PAT'],
            ['name' => 'Com. Leave', 'code' => 'COM'],
            ['name' => 'Unpaid Leave', 'code' => 'UNPAID'],
            ['name' => 'Annual Leave', 'code' => 'ANNUAL'],
            ['name' => 'Marriage', 'code' => 'MARRIAGE'],
            ['name' => 'Death in Immediate Family', 'code' => 'DEATH_FAMILY'],
            ['name' => 'Public Holiday', 'code' => 'HOLIDAY'],
        ];

        foreach ($leaveTypes as $type) {
            LeaveType::updateOrCreate(
                ['code' => $type['code']],
                ['name' => $type['name']]
            );
        }
    }
}
