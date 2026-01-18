<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');
        
        $this->call([
            UserSeeder::class,
            MataPelajaranSeeder::class,
            KelasSeeder::class,
            JamPelajaranSeeder::class,
            GuruMapelSeeder::class,
            // Minggu 4: JadwalSeeder
        ]);

        $this->command->info('✅ Database seeding completed!');
    }
}