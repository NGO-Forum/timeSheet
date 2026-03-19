<?php

namespace Database\Seeders;

use App\Models\Donor;
use Illuminate\Database\Seeder;

class DonorSeeder extends Seeder
{
    public function run(): void
    {
        $donors = [
            'AAC',
            'FFC',
            'EU_PFM',
            'IP3',
            'HEKS',
            'SCI',
            'TAF',
            'CANSEA-FFNPTI',
            'NES-ILC',
            'CAN-I_EU-FFF',
            'PORTICUS',
            'SDC-SCOPE',
            'OTHERS',
        ];

        foreach ($donors as $donor) {
            Donor::firstOrCreate([
                'name' => $donor,
            ]);
        }
    }
}