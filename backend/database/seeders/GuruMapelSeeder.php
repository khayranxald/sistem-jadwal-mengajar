<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MataPelajaran;

class GuruMapelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all guru
        $gurus = User::where('role', 'guru')->get();
        
        // Get all mata pelajaran
        $matematika = MataPelajaran::where('kode_mapel', 'MTK')->first();
        $fisika = MataPelajaran::where('kode_mapel', 'FIS')->first();
        $kimia = MataPelajaran::where('kode_mapel', 'KIM')->first();
        $biologi = MataPelajaran::where('kode_mapel', 'BIO')->first();
        $bahasaIndonesia = MataPelajaran::where('kode_mapel', 'BIN')->first();

        // Assign mata pelajaran ke guru
        if ($gurus->count() >= 5) {
            // Guru 1: Matematika
            $gurus[0]->mataPelajaran()->attach([$matematika->id]);
            
            // Guru 2: Fisika & Kimia
            $gurus[1]->mataPelajaran()->attach([$fisika->id, $kimia->id]);
            
            // Guru 3: Biologi
            $gurus[2]->mataPelajaran()->attach([$biologi->id]);
            
            // Guru 4: Bahasa Indonesia
            $gurus[3]->mataPelajaran()->attach([$bahasaIndonesia->id]);
            
            // Guru 5: Matematika (sebagai guru cadangan)
            $gurus[4]->mataPelajaran()->attach([$matematika->id]);
        }

        $this->command->info('✓ Guru-Mapel assignments created');
    }
}